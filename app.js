'use strict';


window.eventEmitter.on("update", (data) => {
  document.querySelector("#details").innerHTML = syntaxHighlight(data);
});

const button = document.querySelector("button");
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
    {
      namePrefix: "AC300",
    },
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
      .writeValueWithoutResponse(new Uint8Array(command))
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
  const currentTime = new Date().toLocaleTimeString('en-US', {hour12: false});
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
const exponentialBackoff = (max, delay, toTry, success, fail) => {
  toTry()
    .then((result) => success(result))
    .catch((_) => {
      if (max === 0) {
        return fail();
      }
      time("Retrying in " + delay + "s... (" + max + " tries left)");
      setTimeout(function () {
        exponentialBackoff(--max, delay * 2, toTry, success, fail);
      }, delay * 1000);
    });
};

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
        return bluetoothDevice.gatt;
      }
      return bluetoothDevice.gatt.connect();
    },
    async function success(server) {
      log("> Bluetooth Device connected. Try disconnect it now.");
      log(`> Server connected: ${server}`);
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

      /**
       * Executes a logging command.
       *
       * @return {Promise<void>} A promise that resolves when the logging command is complete.
       */
      const loggingCommand = async () => {
        try {
          for (let idx in fields) {
            const field = fields[idx];
            let doSkip = false;
            const queryRangeCommand = new QueryRangeCommand(
              field.page,
              field.offset,
              field.length
            );
            const promise = field.resolver;
            await sendCommand(writeCharacteristic, queryRangeCommand.cmd);

            characteristic.addEventListener(
              "characteristicvaluechanged",
              async function onCharacteristicValueChanged(event) {
                characteristic.removeEventListener(
                  "characteristicvaluechanged",
                  onCharacteristicValueChanged,
                  false
                );
                promise.resolve(event.target.value);
              }
            );
            const response = await Promise.timeout(promise, 1000).catch(() => {
              doSkip = true;
            });

            if (doSkip) {
              continue;
            }
            await field.parse(response);
          }
          /*document.getElementById("ac_output").innerHTML =
            parsed.ac_output_power;
          document.getElementById("battery").innerHTML = parsed.battery;
          document.getElementById("dc_input").innerHTML = parsed.dc_input_power;
          document.getElementById("ac_input").innerHTML = parsed.ac_input_power;
          document.getElementById("ac_output_state").innerHTML =
            parsed.ac_output_state == "true" ? "ON" : "OFF";
          document.getElementById("dc_output_state").innerHTML =
            parsed.dc_output_date == "true" ? "ON" : "OFF";*/

          /*await fetch("http://localhost:8000/server.php", {
            method: "POST",
            content: "application/json",
            mode: "no-cors",
            body: JSON.stringify(parsed),
          });*/
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
  try {
    bluetoothDevice = await navigator.bluetooth.requestDevice(options);
    console.log("Device discovered", bluetoothDevice);
    bluetoothDevice.addEventListener("gattserverdisconnected", onDisconnected);

    connect();
  } catch (error) {
    console.error("Something went wrong", error);
  }
});