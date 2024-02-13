function swapBytes(data) {
  let arr = new Uint8Array(data.buffer);
  for (let i = 0; i < arr.length - 1; i += 2) {
    let temp = arr[i];
    arr[i] = arr[i + 1];
    arr[i + 1] = temp;
  }
  return arr;
}

class DeviceField {
  constructor(name, address, size) {
    this.name = name;
    this.address = address;
    this.size = size;
  }

  inRange(value) {
    return true;
  }
}

class UintField extends DeviceField {
  constructor(name, address, range = null) {
    super(name, address, 1);
    this.range = range;
  }

  parse(data) {
    return new DataView(data).getInt16(0, false);
  }

  inRange(value) {
    if (!this.range) return true;

    if (value >= this.range[0] && value <= this.range[1]);
  }
}

class BoolField extends DeviceField {
  constructor(name, address) {
    super(name, address, 1);
  }

  parse(data) {
    return new DataView(data).getUint16(0, false) === 1;
  }
}

class EnumField extends DeviceField {
  constructor(name, address, enumType) {
    super(name, address, 1);
    this.enumType = enumType;
  }

  parse(data) {
    let val = new DataView(data).getUint16(0, false);
    return this.enumType[val];
  }
}

class DecimalField extends DeviceField {
  constructor(name, address, scale, range = []) {
    super(name, address, 1);
    this.scale = scale;
    this.range = range;
  }

  parse(data) {
    let val = new DataView(data).getUint16(0, false);
    return val / Math.pow(10, this.scale);
  }

  inRange(val) {
    if (this.range.length === 0) {
      return true;
    } else {
      return val >= this.range[0] && val <= this.range[1];
    }
  }
}

class DecimalArrayField extends DeviceField {
  constructor(name, address, size, scale) {
    super(name, address, size);
    this.scale = scale;
  }

  parse(data) {
    let values = [];
    for (let i = 0; i < this.size; i++) {
      let val = new DataView(data).getUint16(i * 2, false);
      values.push(val / Math.pow(10, this.scale));
    }
    return values;
  }
}

class StringField extends DeviceField {
  constructor(name, address, size) {
    super(name, address, size);
  }

  parse(data) {
    var arr = new Uint8Array(data);
    var str = String.fromCharCode.apply(String, arr);

    if (/[\u0080-\uffff]/.test(str)) {
      throw new Error(
        "this string seems to contain (still encoded) multibytes"
      );
    }
    return str.replace(/\0+$/, "");
  }
}

class SwapStringField extends DeviceField {
  constructor(name, address, size) {
    super(name, address, size);
  }

  parse(data) {
    let swapped = swapBytes(data);
    let str = new TextDecoder("ascii").decode(swapped);
    return str.replace(/\0+$/, "");
  }
}

class VersionField extends DeviceField {
  constructor(name, address) {
    super(name, address, 2);
  }

  parse(data) {
    let val1 = new DataView(data).getUint16(0, false);
    let val2 = new DataView(data).getUint16(2, false);
    return (val1 + (val2 << 16)) / 100;
  }
}

class SerialNumberField extends DeviceField {
  constructor(name, address) {
    super(name, address, 4);
  }

  parse(data) {
    let view = new DataView(data);
    let values = [
      view.getUint16(0, false), // false indicates big-endian order
      view.getUint16(2, false), // false indicates big-endian order
      view.getUint16(4, false), // false indicates big-endian order
      view.getUint16(6, false), // false indicates big-endian order
    ];
    return (
      values[0] + (values[1] << 16) + (values[2] << 32) + (values[3] << 48)
    );
  }
}

class Struct {
  constructor() {
    this.fields = [];
  }

  addSerialNumber(name, address) {
    this.fields.push(new SerialNumberField(name, address));
  }

  addUintField(name, address, range) {
    this.fields.push(new UintField(name, address, range));
  }

  addBoolField(name, address) {
    this.fields.push(new BoolField(name, address));
  }

  addEnumField(name, address, enumType = null) {
    this.fields.push(new EnumField(name, address, enumType));
  }

  addDecimalField(name, address, scale, range) {
    this.fields.push(new DecimalField(name, address, scale, range));
  }

  addDecimalArrayField(name, address, size, scale) {
    this.fields.push(new DecimalArrayField(name, address, size, scale));
  }

  addStringField(name, address, size) {
    this.fields.push(new StringField(name, address, size));
  }

  addSwapStringField(name, address, size) {
    this.fields.push(new SwapStringField(name, address, size));
  }

  addVersionField(name, address) {
    this.fields.push(new VersionField(name, address));
  }

  parse(startingAddress, data) {
    // Offsets and size are counted in 2 byte chunks, so for the range we
    // need to divide the byte size by 2
    let dataSize = Math.floor(data.byteLength / 2);

    // Filter out fields not in range
    let r = [...Array(dataSize).keys()].map((i) => i + startingAddress);
    let fields = this.fields.filter(
      (f) => r.includes(f.address) && r.includes(f.address + f.size - 1)
    );

    // Parse fields
    for (let f of fields) {
      let dataStart = 2 * (f.address - startingAddress);
      let fieldData = data.slice(dataStart, dataStart + 2 * f.size);
      let val = f.parse(fieldData);

      // Skip if the value is "out-of-range" - sometimes the sensors
      // report weird values
      if (!f.inRange(val)) {
        continue;
      }

      targetProxy[f.name] = val; // + this.unit;
      parsed[f.name] = val;
      window.eventEmitter.emit("update", targetProxy.target);
    }

    return parsed;
  }
}

export {
  Struct,
  EnumField,
  DecimalField,
  DecimalArrayField,
  UintField,
  BoolField,
  StringField,
  SwapStringField,
  VersionField,
  SerialNumberField,
};
