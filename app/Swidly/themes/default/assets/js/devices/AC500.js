import BluettiDevice from "./BluettiDevice.js";

const OutputMode = Object.freeze({
  0: "STOP",
  1: "INVERTER_OUTPUT",
  2: "BYPASS_OUTPUT_C",
  3: "BYPASS_OUTPUT_D",
  4: "LOAD_MATCHING",
});

const BatteryState = Object.freeze({
  0: "STANDBY",
  1: "CHARGE",
  2: "DISCHARGE",
});

const UpsMode = Object.freeze({
  1: "CUSTOMIZED",
  2: "EPV_PRIORITY",
  3: "STANDARD",
  4: "TIME_CONTROL",
});

const MachineAddress = Object.freeze({
  0: "SLAVE",
  1: "MASTER",
});

const AutoSleepMode = Object.freeze({
  2: "THIRTY_SECONDS",
  3: "ONE_MINUTE",
  4: "FIVE_MINUTES",
  5: "NEVER",
});

class AC500 extends BluettiDevice {
  constructor(address, sn) {
    super(address, "AC500", sn);
  }

  addFields() {
    // Core
    this.struct.addStringField("device_type", 10, 6);
    this.struct.addSerialNumber("serial_number", 17);
    this.struct.addVersionField("arm_version", 23);
    this.struct.addVersionField("dsp_version", 25);
    this.struct.addUintField("dc_input_power", 36);
    this.struct.addUintField("ac_input_power", 37);
    this.struct.addUintField("ac_output_power", 38);
    this.struct.addUintField("dc_output_power", 39);
    this.struct.addDecimalField("power_generation", 41, 1); // Total power generated since last reset (kwh)
    this.struct.addUintField("total_battery_percent", 43);
    this.struct.addBoolField("ac_output_on", 48);
    this.struct.addBoolField("dc_output_on", 49);

    // Details
    this.struct.addEnumField("ac_output_mode", 70, OutputMode);
    this.struct.addDecimalField("internal_ac_voltage", 71, 1);
    this.struct.addDecimalField("internal_current_one", 72, 1);
    this.struct.addUintField("internal_power_one", 73);
    this.struct.addDecimalField("internal_ac_frequency", 74, 2);
    this.struct.addDecimalField("internal_current_two", 75, 1);
    this.struct.addUintField("internal_power_two", 76);
    this.struct.addDecimalField("ac_input_voltage", 77, 1);
    this.struct.addDecimalField("internal_current_three", 78, 1, [0, 100]);
    this.struct.addUintField("internal_power_three", 79);
    this.struct.addDecimalField("ac_input_frequency", 80, 2);
    this.struct.addDecimalField("internal_dc_input_voltage", 86, 1);
    this.struct.addUintField("internal_dc_input_power", 87);
    this.struct.addDecimalField("internal_dc_input_current", 88, 1, [0, 15]);

    // Battery Data
    this.struct.addUintField("pack_num_max", 91);
    this.struct.addDecimalField("total_battery_voltage", 92, 1);
    this.struct.addDecimalField("total_battery_current", 93, 1);
    this.struct.addUintField("pack_num", 96);
    this.struct.addEnumField("pack_status", 97, BatteryState);
    this.struct.addDecimalField("pack_voltage", 98, 2); // Full pack voltage
    this.struct.addUintField("pack_battery_percent", 99);
    this.struct.addDecimalArrayField("cell_voltages", 105, 16, 2);
    this.struct.addVersionField("pack_bms_version", 201);

    // Controls
    this.struct.addEnumField("ups_mode", 3001, UpsMode);
    this.struct.addBoolField("split_phase_on", 3004);
    this.struct.addEnumField("split_phase_machine_mode", 3005, MachineAddress);
    this.struct.addUintField("pack_num", 3006);
    this.struct.addBoolField("ac_output_on", 3007);
    this.struct.addBoolField("dc_output_on", 3008);
    this.struct.addBoolField("grid_charge_on", 3011);
    this.struct.addBoolField("time_control_on", 3013);
    this.struct.addUintField("battery_range_start", 3015);
    this.struct.addUintField("battery_range_end", 3016);
    // 3031-3033 is the current device time & date without a timezone
    this.struct.addBoolField("bluetooth_connected", 3036);
    // 3039-3056 is the time control programming
    this.struct.addEnumField("auto_sleep_mode", 3061, AutoSleepMode);
  }

  get packNumMax() {
    return 6;
  }

  get pollingCommands() {
    return [
      new ReadHoldingRegisters(10, 42),
      new ReadHoldingRegisters(70, 21),
      new ReadHoldingRegisters(3000, 62),
    ];
  }

  get packPollingCommands() {
    return [new ReadHoldingRegisters(91, 37)];
  }

  get loggingCommands() {
    return [
      new ReadHoldingRegisters(0, 70),
      new ReadHoldingRegisters(70, 21),
      new ReadHoldingRegisters(3000, 62),
    ];
  }

  get packLoggingCommands() {
    return [new ReadHoldingRegisters(91, 119)];
  }

  get writableRanges() {
    return range(3000, 3062);
  }
}

export default AC500;
