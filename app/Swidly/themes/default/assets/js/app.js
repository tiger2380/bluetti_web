"use strict";

var Scrollbar = window.Scrollbar;

Scrollbar.init(document.querySelector(".scrollable"));

/**
 * Listen for incoming changes from Bluetti device.
 * This is where you can update the UI or save data to the database.
 */
window.eventEmitter.on("update", (data) => {
  // updated data from bluetti device
  //console.log(JSON.parse(data));
 // document.querySelector("#details").innerHTML = syntaxHighlight(data);
});

const button = document.querySelector("#conntectBluetooth");
let isConnected = false;
const SERVICEUUID = "0000ff00-0000-1000-8000-00805f9b34fb";
const NOTIFYCHARACTERISTICUUID = "0000ff01-0000-1000-8000-00805f9b34fb";
const WRITECHARACTERISTICUUID = "0000ff02-0000-1000-8000-00805f9b34fb";

//const DCONCOMMAND = [0x01, 0x06, 0x0b, 0xc0, 0x00, 0x01, 0x4a, 0x12];
//const DCOFFCOMMAND = [0x01, 0x06, 0x0b, 0xc0, 0x00, 0x00, 0x8b, 0xd2];
//const ACONCOMMAND = [0106 0BBF 0001 7BCA];
//const ACOFFCOMMAND = [0106 0BBF 0000 BA0A];

Promise.timeout = function (promise, timeoutInMilliseconds) {
  return Promise.race([
    promise,
    new Promise(function (_, reject) {
      setTimeout(function () {
        reject("timeout");
      }, timeoutInMilliseconds);
    }),
  ]);
};

let options = {
  //acceptAllDevices: true,
  optionalServices: [SERVICEUUID],
  filters: [
    { namePrefix: "AC300" },
    { namePrefix: "AC200" },
    { namePrefix: "AC500" },
  ],
};

/**
 * Sends a command to the writeCharacteristic.
 *
 * @param {Object} writeCharacteristic - The writeCharacteristic to send the command to.
 * @param {Array} command - The command to be sent as a Uint8Array.
 * @return {Promise} A promise that resolves when the command is sent successfully or rejects with an error.
 */
const sendCommand = async (writeCharacteristic, command) => {
  try {
    await writeCharacteristic
      .writeValueWithResponse(new Uint8Array(command))
      .catch((error) => {
        console.error("Error when writing value", error);
        return Promise.resolve()
          .then(() => sleep(5000))
          .then(() => sendCommand(writeCharacteristic, command));
      });
  } catch (error) {
    console.error("Error when sending command", error);
  }
};

/**
 * Logs a message to the console.
 *
 * @param {string} message - The message to be logged.
 * @return {undefined} This function does not return a value.
 */
const log = (message) => {
  console.log(message);
};

/**
 * Logs the given text along with the current time in the format "[HH:mm:ss] text".
 *
 * @param {string} text - The text to be logged.
 */
const time = (text) => {
  const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false });
  log(`[${currentTime}] ${text}`);
};

let bluetoothDevice;

/**
 * Executes a function with exponential backoff.
 *
 * @param {number} max - The maximum number of retries.
 * @param {number} delay - The initial delay in seconds.
 * @param {function} toTry - The function to execute.
 * @param {function} success - The success callback.
 * @param {function} fail - The failure callback.
 * @return {void}
 */
const exponentialBackoff = async (max, delay, toTry, success, fail) => {
  const result = await toTry();

  if (result) {
    return success(result);
  }

  if (max === 0) {
    return fail();
  }

  time("Retrying in " + delay + "s... (" + max + " tries left)");
  setTimeout(function () {
    exponentialBackoff(--max, delay, toTry, success, fail);
  }, delay * 1000);
};

/**
 * Append an ArrayBuffer to an existing ArrayBuffer.
 * 
 * @param {ArrayBuffer} existingBuffer - The existing ArrayBuffer.
 * @param {ArrayBuffer} newBuffer - The new ArrayBuffer to be appended.
 * @return {ArrayBuffer} The combined ArrayBuffer.
 */
function appendArrayBuffer(existingBuffer, newBuffer) {
    // Calculate the total length of both buffers
    let totalLength = existingBuffer.byteLength + newBuffer.byteLength;

    // Create a new buffer of the total length
    let result = new Uint8Array(totalLength);

    // Copy the existing buffer to the result buffer
    result.set(new Uint8Array(existingBuffer), 0);

    // Copy the new buffer to the result buffer, offset by the length of the existing buffer
    result.set(new Uint8Array(newBuffer), existingBuffer.byteLength);

    // Return the result buffer
    return result.buffer;
}

/**
 * Connects to a Bluetooth device using exponential backoff for retries.
 *
 * @param {number} maxRetries - The maximum number of retries.
 * @param {number} delay - The delay in seconds between retries.
 * @param {function} toTry - The function to try connecting to the Bluetooth device.
 * @param {function} success - The function to run if the connection is successful.
 * @param {function} fail - The function to run if the connection fails.
 */
function connect() {
  exponentialBackoff(
    3 /* max retries */,
    2 /* seconds delay */,
    function toTry() {
      time("Connecting to Bluetooth Device... ");
      if (bluetoothDevice.gatt.connected) {
        isConnected = true;
        return bluetoothDevice.gatt;
      }
      return bluetoothDevice.gatt.connect();
    },
    async function success(server) {
      log("> Bluetooth Device connected. Try disconnect it now.");
      log(`> Server connected: ${server}`);

      isConnected = true;
      const service = await server
        .getPrimaryService(SERVICEUUID)
        .catch((error) => {
          console.error("Error when getting service", error);
        });
      log(`> Service discovered: ${service}`);
      const characteristic = await service.getCharacteristic(
        NOTIFYCHARACTERISTICUUID
      );
      log(`Characteristic discovered: ${characteristic}`);

      await characteristic.startNotifications();
      log(`Notifications started on: ${characteristic.uuid}`);

      const writeCharacteristic = await service.getCharacteristic(
        WRITECHARACTERISTICUUID
      );

      const runCommand = async (command) => {
        let doSkip = false;
        const promise = command.resolver;
        await sendCommand(writeCharacteristic, command.cmd);
        const responseSize = command.responseSize;
        let fullResponse = new ArrayBuffer();

        characteristic.addEventListener(
          "characteristicvaluechanged",
          async function onCharacteristicValueChanged(event) {
            if (fullResponse.byteLength < responseSize) {
              fullResponse = appendArrayBuffer(
                fullResponse,
                event.target.value.buffer
              );
            } else {
              doSkip = true;
            }

            if (fullResponse.byteLength === responseSize) {
              characteristic.removeEventListener(
                "characteristicvaluechanged",
                onCharacteristicValueChanged,
                false
              );
              promise.resolve(fullResponse);
            }
          }
        );
        
        const response = await Promise.timeout(promise, 10000).catch(($ex) => {
          doSkip = true;
        });

        if (doSkip) {
          return;
        }

        return new DataView(response);
      };

      /**
       * Executes a logging command.
       *
       * @return {Promise<void>} A promise that resolves when the logging command is complete.
       */
      const loggingCommand = async () => {
        let result = "";
        try {
          for (let logging of clientDevice.loggingCommands) {
            const response = await runCommand(logging);
            if (response) {
              if (logging.isValidResponse(response)) {
                const body = logging.parseResponse(response);
                result = await clientDevice.parse(logging.startAddress, body);
              }
            }
            //await sleep(100);
          }

          for (let pack = 1; pack <= clientDevice.packNumMax; pack++) {
            if (clientDevice.packNumMax > 1) {
              const command = clientDevice.buildSetterCommand("pack_num", pack);
              await runCommand(command);
              await sleep(10);

              for (let packCommand of clientDevice.packLoggingCommands) {
                const response = await runCommand(packCommand);
                if (response) {
                  if (packCommand.isValidResponse(response)) {
                    const body = packCommand.parseResponse(response);
                    result = await clientDevice.parse(
                      packCommand.startAddress,
                      body
                    );
                  }
                }
              }
            }
          }

          document.querySelector("#details").innerHTML =
            syntaxHighlight(result);
          await sleep(100);
          loggingCommand();
        } catch (error) {
          console.error("Error when sending command", error);
          loggingCommand();
        }
      };

      loggingCommand();
    },
    function fail() {
      time("Failed to reconnect.");
    }
  );
}

/**
 * Handles the event when a device is disconnected.
 *
 * @param {Object} event - The event object containing information about the disconnection.
 * @return {Promise} A Promise that resolves once the device is reconnected.
 */
const onDisconnected = async (event) => {
  const device = event.target;
  console.log(`Device ${device.name} is disconnected.`);
  connect();
};

button.addEventListener("click", async () => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;

    const response = await fetch(
      `https://api.weather.gov/points/${lat},${long}`
    );
    const json = await response.json();
    const properties = json.properties;
    const forecast = properties.forecast;
    const forecastResponse = await fetch(forecast);
    const forecastJson = await forecastResponse.json();
    const data = forecastJson.properties.periods[0];
    document.querySelector("#weatherCondition").innerHTML = data.shortForecast;
  });

  try {
    bluetoothDevice = await navigator.bluetooth.requestDevice(options);
    console.log("Device discovered", bluetoothDevice);
    bluetoothDevice.addEventListener("gattserverdisconnected", onDisconnected);

    window.addEventListener("beforeunload", () => {
      if (bluetoothDevice.gatt.connected) {
        bluetoothDevice.gatt.disconnect();
      } else {
        log("> Bluetooth Device is already disconnected");
      }
    });

    if (bluetoothDevice.name.includes("AC200")) {
      const script = document.createElement("script");
      script.src = `Swidly/themes/default/assets/js/devices/AC200.js`;
      script.defer = true;
      document.head.appendChild(script);
    } else if (bluetoothDevice.name.includes("AC300")) {
      const AC300 = (await import("./devices/AC300.js")).default;
      window.clientDevice = new AC300(bluetoothDevice.id, bluetoothDevice.name);
      clientDevice.addFields();
    } else if (bluetoothDevice.name.includes("AC500")) {
      const script = document.createElement("script");
      script.src = `Swidly/themes/default/assets/js/devices/AC500.js`;
      script.defer = true;
      document.head.appendChild(script);
    } else {
      log("> Unknown device: " + bluetoothDevice.name);
    }

    log(`> Device: ${bluetoothDevice.name}`);
    await sleep(2000);
    connect();
  } catch (error) {
    console.error("Something went wrong", error);
  }
});
