const parsed = {};
var targetProxy = new Proxy(parsed, {
  set: function (target, key, value) {
    if (typeof value === "string" && "undefined" != value.substring(0, 9)) {
      target[key] = value;

      window.eventEmitter.emit("update", target);
    }
    return true;
  },
});

class DeviceCommand {
  constructor(functionCode, data) {
    this.functionCode = functionCode;

    this.cmd = new Uint8Array(data.byteLength + 4);
    this.cmd[0] = 1;
    this.cmd[1] = functionCode;
    const d = new Uint8Array(data);
    this.cmd.set(d, 2);
    const subCmd = this.cmd.subarray(0, this.cmd.length - 2);
    let crc = crc16(subCmd);
    this.cmd.set(new Uint8Array([crc & 0xff, crc >> 8]), this.cmd.length - 2);
  }

  responseSize() {
    // Returns the expected response size in bytes
    throw new Error("Not implemented");
  }

  [Symbol.iterator]() {
    // Provide an iter implementation so that bytes(cmd) works
    return this.cmd[Symbol.iterator]();
  }

  isExceptionResponse(response) {
    // Checks the response code to see if it's a MODBUS exception
    if (response.length < 2) {
      return false;
    } else {
      return response[1] === this.functionCode + 0x80;
    }
  }

  isValidResponse(response) {
    if (response.byteLength < 3) {
      return false;
    }

    const minusCrc = new Uint8Array(response.buffer, 0, response.byteLength - 2);
    let crc = crc16(minusCrc);
    let crcBytes = new Uint8Array([crc & 0xff, crc >> 8]);
    const buffer = response.buffer;
    return new Uint8Array(buffer.slice(-2))
       .every((value, index) => value === crcBytes[index]);
  }

  parseResponse(response) {
    // Returns the raw body of the response
    return response;
  }
}

class ReadHoldingRegisters extends DeviceCommand {
  constructor(startingAddress, quantity) {
    const buffer = new ArrayBuffer(4);
    const dataview = new DataView(buffer);
    dataview.setUint16(0, startingAddress, false);
    dataview.setUint16(2, quantity, false);

    super(3, buffer);

    this.startAddress = startingAddress;
    this.quantity = quantity;
  }

  get resolver() {
    let resolve,
      prom = new Promise((r) => (resolve = r));
    prom.resolve = resolve;
    this.prom = prom;

    return prom;
  }

  isValidResponse(response) {
    return super.isValidResponse(response);
  }

  parseResponse(response) {
    return response.buffer.slice(3, -2);
  }

  get responseSize() {
    return 2 * this.quantity + 5;
  }

  toString() {
    return `ReadHoldingRegisters(startingAddress=${this.startingAddress}, quantity=${this.quantity})`;
  }
}

class WriteSingleRegisterCommand extends DeviceCommand {
  constructor(address, value) {
    const buffer = new ArrayBuffer(4);
    const dataview = new DataView(buffer);
    dataview.setUint16(0, address, false);
    dataview.setUint16(2, value, false);

    super(6, buffer);

    this.startAddress = address;
    this.value = value;
  }

  get resolver() {
    let resolve,
      prom = new Promise((r) => (resolve = r));
    prom.resolve = resolve;
    this.prom = prom;

    return prom;
  }

  isValidResponse(response) {
    return super.isValidResponse(response);
  }

  parseResponse(response) {
    return response.buffer.slice(4, -6);
  }

  get responseSize() {
    return 2 * this.value + 5;
  }

  toString() {
    return `WriteSingleRegisterCommand(page=${this.page
      .toString(16)
      .padStart(4, "0")}, offset=${this.offset
      .toString(16)
      .padStart(4, "0")}, value=${this.value.toString(16).padStart(4, "0")})`;
  }
}
