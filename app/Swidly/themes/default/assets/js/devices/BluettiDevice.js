import {Struct, EnumField, BoolField } from "./Struct.js";
class BluettiDevice {
  constructor(address, type, sn) {
    this.address = address;
    this.sn = sn;
    this.type = type;
    this.struct = new Struct();
  }

  parse(address, data) {
    return this.struct.parse(address, data);
  }

  packNumMax() {
    return 1;
  }

  hasField(field) {
    return this.struct.fields.some((f) => f.name === field);
  }

  hasFieldSetter(field) {
    let matches = this.struct.fields.filter((f) => f.name === field);
    return matches.some((f) =>
      this.writableRanges.some((r) => r.includes(f.address))
    );
  }

  buildSetterCommand(field, value) {
    let matches = this.struct.fields.filter((f) => f.name === field);
    let deviceField = matches.find((f) =>
      this.writableRanges.includes(f.address)
    );

    // Convert value to an integer
    if (deviceField instanceof EnumField) {
      value = deviceField.enum[value].value;
    } else if (deviceField instanceof BoolField) {
      value = value ? 1 : 0;
    }

    return new WriteSingleRegisterCommand(deviceField.address, value);
  }
}

export default BluettiDevice;