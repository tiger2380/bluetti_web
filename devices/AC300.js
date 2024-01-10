const OutputMode = Object.freeze({
    0: 'STOP',
    1: 'INVERTER_OUTPUT',
    2: 'BYPASS_OUTPUT_C',
    3: 'BYPASS_OUTPUT_D',
    4: 'LOAD_MATCHING',
});

const BatteryState = Object.freeze({
    0: 'STANDBY',
    1: 'CHARGE',
    2: 'DISCHARGE',
});

const UpsMode = Object.freeze({
    0: 'CUSTOMIZED',
    1: 'EPV_PRIORITY',
    2: 'STANDARD',
    3: 'TIME_CONTROL',
});

const MachineAddress = Object.freeze({
	0: 'SLAVE',
	1: 'MASTER',
});

const AutoSleepMode = Object.freeze({
	2: 'THIRTY_SECONDS',
	3: 'ONE_MINUTE',
	4: 'FIVE_MINUTES',
	5: 'NEVER',
});

const fields = [
  new ReadSingleRegisterCommand({
	  name: "device_type",
	  page: 0x00,
	  offset: 0x0a,
	  length: 6,
	  field_type: FIELD_TYPE.string
  }),
  new ReadSingleRegisterCommand({
    name: "ac_output_power",
    page: 0x00,
	offset: 0x26,
    length: 1,
    unit: "w",
    field_type: FIELD_TYPE.uint16
  }),
  new ReadSingleRegisterCommand({
    name: "ac_input_power",
    page: 0x00,
    offset: 0x25,
    length: 1,
    unit: "w",
    field_type: FIELD_TYPE.uint16
  }),
  new ReadSingleRegisterCommand({
    name: "dc_input_power",
    page: 0x00,
    offset: 0x24,
    length: 1,
    unit: "w",
    field_type: FIELD_TYPE.uint16
  }),
  new ReadSingleRegisterCommand({
    name: "dc_output_power",
    page: 0x00,
    offset: 0x27,
    length: 1,
    unit: "w",
    field_type: FIELD_TYPE.uint16
  }),
  new ReadSingleRegisterCommand({
    name: "battery",
    page: 0x00,
    offset: 0x2b,
    length: 1,
    unit: "%",
    field_type: FIELD_TYPE.uint32
  }),
  new ReadSingleRegisterCommand({
    name: "serial_number",
    page: 0x00,
    offset: 0x11,
    length: 4,
    field_type: FIELD_TYPE.serial_number
  }),
  new ReadSingleRegisterCommand({
    name: "ac_output_state",
    page: 0x00,
    offset: 0x30,
    length: 1,
    field_type: FIELD_TYPE.bool
  }),
  new ReadSingleRegisterCommand({
    name: "dc_output_state",
    page: 0x00,
    offset: 0x31,
    length: 1,
    field_type: FIELD_TYPE.bool
  }),
  // detail page
  new ReadSingleRegisterCommand({
    name: "ac_output_mode",
    page: 0x00,
    offset: 0x46,
    length: 1,
    field_type: FIELD_TYPE.enum,
	enum: OutputMode
  }),
  new ReadSingleRegisterCommand({
    name: "ac_output_voltage",
    page: 0x00,
    offset: 0x47,
    length: 1,
    unit: "v",
    field_type: FIELD_TYPE.decimal,
    scale: 1
  }),
  new ReadSingleRegisterCommand({
    name: "arm_version",
    page: 0x00,
    offset: 0x17,
    length: 2,
    feld_type: FIELD_TYPE.version
  }),
  new ReadSingleRegisterCommand({
    name: "dsp_version",
    page: 0x00,
    offset: 0x19,
    length: 2,
    feld_type: FIELD_TYPE.version
  }),
  new ReadSingleRegisterCommand({
    name: "power_generation",
    page: 0x00,
    offset: 0x29,
    length: 1,
    unit: "w",
    field_type: FIELD_TYPE.decimal,
    scale: 1
  }),
  new ReadSingleRegisterCommand({
    name: "internal_current_one",
    page: 0x00,
    offset: 0x48,
    length: 1,
    unit: "a",
    field_type: FIELD_TYPE.decimal
  }),

  new ReadSingleRegisterCommand({
    name: "internal_ac_frequency",
    page: 0x00,
    offset: 0x4a,
    length: 2,
    unit: "hz",
    field_type: FIELD_TYPE.decimal,
  }),
  new ReadSingleRegisterCommand({
    name: "total_battery_percent",
    page: 0x00,
    offset: 0x2b,
    length: 1,
    unit: "%",
    field_type: FIELD_TYPE.uint16
  }),
  new ReadSingleRegisterCommand({
    name: "internal_power_one",
    page: 0x00,
    offset: 0x49,
    length: 1,
    unit: "w",
    field_type: FIELD_TYPE.uint16
  }),
  new ReadSingleRegisterCommand({
    name: "internal_power_two",
    page: 0x00,
    offset: 0x4c,
    length: 1,
    unit: "w",
    field_type: FIELD_TYPE.uint16
  }),
  new ReadSingleRegisterCommand({
    name: "internal_power_three",
    page: 0x00,
    offset: 0x4f,
    length: 1,
    unit: "w",
    field_type: FIELD_TYPE.uint16
  }),
  new ReadSingleRegisterCommand({
    name: "internal_pack_voltage",
    page: 0x00,
    offset: 0x5c,
    length: 1,
    unit: "v",
    field_type: FIELD_TYPE.decimal,
    scale: 1
  }),
  new ReadSingleRegisterCommand({
    name: "internal_dc_input_current",
    page: 0x00,
    offset: 0x58,
    length: 1,
    unit: "a",
    field_type: FIELD_TYPE.decimal,
    scale: 1
  }),
  new ReadSingleRegisterCommand({
    name: "internal_dc_input_power",
    page: 0x00,
    offset: 0x57,
    length: 1,
    uint: "w",
    field_type: FIELD_TYPE.uint16
  }),
  new ReadSingleRegisterCommand({
    name: "internal_dc_input_voltage",
	page: 0x00,
    offset: 0x56,
    length: 1,
    unit: "v",
    field_type: FIELD_TYPE.decimal
  }),
  // battery details
  new ReadSingleRegisterCommand({
    name: "pack_num_max",
    page: 0x00,
    offset: 0x5b,
    length: 1,
    field_type: FIELD_TYPE.uint16
  }),
  new ReadSingleRegisterCommand({
	  name: "total_battery_voltage",
	  page: 0x00,
	  offset: 0x5c,
	  length: 1,
	  unit: "v",
	  field_type: FIELD_TYPE.decimal
  }),
  new ReadSingleRegisterCommand({
	  name: "total_battery_current",
	  page: 0x00,
	  offset: 0x5d,
	  length: 1,
	  unit: "a",
	  field_type: FIELD_TYPE.decimal
  }),
  new ReadSingleRegisterCommand({
    name: "pack_num",
    page: 0x00,
    offset: 0x60,
    length: 1,
    field_type: FIELD_TYPE.uint16
  }),
  new ReadSingleRegisterCommand({
	  name: 'pack_status',
	  page: 0x00,
	  offset: 0x61,
	  length: 1,
	  field_type: FIELD_TYPE.enum,
	  enum: BatteryState,
  }),
  new ReadSingleRegisterCommand({
	  name: "pack_voltage",
	  page: 0x00,
	  offset: 0x62,
	  length: 1,
	  unit: "v",
	  field_type: FIELD_TYPE.decimal
  }),
  new ReadSingleRegisterCommand({
    name: "pack_battery_percent",
    page: 0x00,
    offset: 0x63,
    length: 1,
    unit: "%",
    field_type: FIELD_TYPE.uint16
  }),
  new ReadSingleRegisterCommand({
	name: "cell_voltages",
	page: 0x00,
	offset: 0x69,
	length: 16,
	field_type: FIELD_TYPE.array,
	scale: 2
  }),
  new ReadSingleRegisterCommand({
	  name: "pack_bms_version",
	  page: 0x00,
	  offset: 0xc9,
	  field_type: FIELD_TYPE.version,
  }),
  // controls
  new ReadSingleRegisterCommand({
	  name: "ups_mode",
	  page: 0x00,
	  offset: 0xbb9,
	  field_type: FIELD_TYPE.enum,
	  enum: UpsMode,
  }),
  new ReadSingleRegisterCommand({
	  name: "split_phase_on",
	  page: 0x00,
	  offset: 0xbbc,
	  field_type: FIELD_TYPE.bool,
  }),
  new ReadSingleRegisterCommand({
	  name: "split_phase_machine_mode",
	  page: 0x00,
	  offset: 0xbbd,
	  field_type: FIELD_TYPE.enum,
	  enum: MachineAddress,
  }),
  new ReadSingleRegisterCommand({
	  name: "pack_num",
	  page: 0x00,
	  offset: 0xbbe,
	  field_type: FIELD_TYPE.uint16,
  }),
  new ReadSingleRegisterCommand({
	  name: "ac_output_on",
	  page: 0x00,
	  offset: 0xbbf,
	  field_type: FIELD_TYPE.bool,
  }),
  new ReadSingleRegisterCommand({
	  name: "dc_output_on",
	  page: 0x00,
	  offset: 0xbc0,
	  field_type: FIELD_TYPE.bool,
  }),
  new ReadSingleRegisterCommand({
	  name: "grid_charge_on",
	  page: 0x00,
	  offset: 0xbc3,
	  field_type: FIELD_TYPE.bool,
  }),
  new ReadSingleRegisterCommand({
	  name: "time_control_on",
	  page: 0x00,
	  offset: 0xbc5,
	  field_type: FIELD_TYPE.bool,
  }),
  new ReadSingleRegisterCommand({
	  name: "battery_range_start",
	  page: 0x00,
	  offset: 0xbc7,
	  field_type: FIELD_TYPE.uint16,
  }),
  new ReadSingleRegisterCommand({
	  name: "battery_range_end",
	  page: 0x00,
	  offset: 0xbc8,
	  field_type: FIELD_TYPE.uint16,
  }),
  new ReadSingleRegisterCommand({
	  name: "bluetooth_connected",
	  page: 0x00,
	  offset: 0xbdc,
	  field_type: FIELD_TYPE.bool,
  }),
  new ReadSingleRegisterCommand({
	  name: "auto_sleep_mode",
	  page: 0x00,
	  offset: 0xbf5,
	  field_type: FIELD_TYPE.enum,
	  enum: AutoSleepMode,
  })
];
