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

class ReadSingleRegisterCommand {
  constructor(params) {
    this.name = params.name || "unknown";
    this.page = params.page || 0x00;
    this.offset = params.offset || 0x00;
    this.length = params.length || 0x1;
    this.unit = params.unit || "";
    this.FIELD_TYPE = params.field_type || FIELD_TYPE.uint16;
    this.scale = params.scale || 0;
    this.enum = params.enum;
    this.validRange = params.validRange ?? null;
  }

  get resolver() {
    let resolve,
      prom = new Promise((r) => (resolve = r));
    prom.resolve = resolve;
    this.prom = prom;

    return prom;
  }

  /**
   * Parses the given response.
   *
   * @param {any} response - The response to parse.
   * @return {Promise<any>} A promise that resolves to the parsed value.
   */
  async parse(page, offset, response, length) {
    return new Promise((resolve, reject) => {
      if (!response) {
        reject("No response");
      }

      if (!(response instanceof DataView)) {
        throw new Error("Invalid response type. Expected DataView.");
      }

      /**
       * Slice the buffer to get the filtered response.
       * @type {ArrayBuffer}
       */
      const filterResponse = response.buffer.slice(3, -2);
      /** Create a DataView to work with the filtered response.
       * @type {DataView}
       */
      const dataview = new DataView(filterResponse);

      /**
       * Parse the field from the data view.
       * @type {any}
       */
      this.value = parse_field(
        dataview,
        this.FIELD_TYPE,
        this.scale,
        this.enum
      );
      
      /**
       * Check if the value is within the valid range.
       * @type {any}
       * @todo Move this to a separate function.
       */
      if (this.validRange) {
        const minRange = Math.min(...this.validRange);
        const maxRange = Math.max(...this.validRange);
        if (
          this.value < minRange ||
          this.value > maxRange
        ) {
          reject(
            `Invalid value. Expected ${minRange} <= ${this.name} <= ${maxRange}, got ${this.value}`
          );
        }
      }
      
      targetProxy[this.name] = this.value; // + this.unit;
      parsed[this.name] = this.value; // + this.unit;
      resolve(parsed[this.name]);
    });
  }

  isValidResponse(response) {
    if (response.byteLength < 3) {
      return false;
    }

    let crc = crc16(
      new Uint8Array(response.buffer, 0, response.byteLength - 2)
    );
    let crcBytes = new Uint8Array([crc]);
    let responseCrc = new Uint8Array(
      response.buffer,
      response.byteLength - 2,
      1
    );

    return crcBytes[0] === responseCrc[0];
  }

  /**
   * Calculates the size of the response.
   *
   * @return {number} The size of the response in bytes.
   */
  responseSize() {
    // 3 byte header
    // 2 byte crc
    return 2 * this.length + 5;
  }

  /**
   * Returns a string representation of the object.
   *
   * @return {string} A string representation of the object.
   */
  toString() {
    return `ReadSingleRegisterCommand(name=${this.name}, offset=${this.offset
      .toString(16)
      .padStart(4, "0")}, length=${this.length.toString(16).padStart(4, "0")})`;
  }
}

class QueryRangeCommand {
  constructor(page, offset, length) {
    this.page = page;
    this.offset = offset;
    this.length = length;

    let buffer = new ArrayBuffer(8);
    let dataview = new DataView(buffer);

    dataview.setUint8(0, 1); // Standard prefix
    dataview.setUint8(1, 3); // Range query command
    dataview.setUint8(2, page);
    dataview.setUint8(3, offset);
    dataview.setUint16(4, length, false);

    // Assuming modbus_crc is a function that calculates the CRC
    let cmd = new Uint8Array(buffer);
    let crc = crc16(cmd.subarray(0, cmd.length - 2));
    dataview.setUint16(6, crc, true);

    this.cmd = cmd;
  }

  responseSize() {
    // 3 byte header
    // each returned field is actually 2 bytes
    // 2 byte crc
    return 2 * this.length + 5;
  }

  toString() {
    return `QueryRangeCommand(page=${this.page
      .toString(16)
      .padStart(4, "0")}, offset=${this.offset
      .toString(16)
      .padStart(4, "0")}, length=${this.length.toString(16).padStart(4, "0")})`;
  }
}

class WriteSingleRegisterCommand {
  constructor(page, offset, value) {
    this.page = page;
    this.offset = offset;
    this.value = value;

    let buffer = new ArrayBuffer(9);
    let dataview = new DataView(buffer);

    dataview.setUint8(0, 1); // Standard prefix
    dataview.setUint8(1, 6); // Write single register command
    dataview.setUint8(2, page);
    dataview.setUint8(3, offset);
    dataview.setUint16(4, value, false);

    // Assuming modbus_crc is a function that calculates the CRC
    let cmd = new Uint8Array(buffer);
    let crc = crc16(cmd.subarray(0, cmd.length - 2));
    console.log("crc", crc);
    dataview.setUint16(6, crc, true);

    this.cmd = cmd;
  }

  parseResponse(response) {
    return new Promise((resolve, reject) => {
      if (!response) {
        reject("No response");
      }
      const filterResponse = response.buffer.slice(4, 6);
      const dataview = new DataView(filterResponse);

      if (dataview.byteLength !== 2) {
        reject(
          `Invalid response length. Expected 2, got ${dataview.byteLength}`
        );
      }

      this.value = dataview.getUint16(0, false);
      resolve(this.value);
    });
  }

  responseSize() {
    // 3 byte header
    // 2 byte crc
    return 5;
  }

  toString() {
    return `WriteSingleRegisterCommand(page=${this.page
      .toString(16)
      .padStart(4, "0")}, offset=${this.offset
      .toString(16)
      .padStart(4, "0")}, value=${this.value.toString(16).padStart(4, "0")})`;
  }
}
