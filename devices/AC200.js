const fields = [
  new ReadSingleRegisterCommand(
    "device_type",
    0x00,
    0x0a,
    6,
    "",
    FIELD_TYPE.string
  ),
  new ReadSingleRegisterCommand(
    "ac_output_power",
    0x00,
    0x26,
    1,
    "w",
    FIELD_TYPE.uint16
  ),
  new ReadSingleRegisterCommand(
    "ac_input_power",
    0x00,
    0x25,
    1,
    "w",
    FIELD_TYPE.uint16
  ),
  new ReadSingleRegisterCommand(
    "dc_input_power",
    0x00,
    0x24,
    1,
    "w",
    FIELD_TYPE.uint16
  ),
  new ReadSingleRegisterCommand(
    "dc_output_power",
    0x00,
    0x27,
    1,
    "w",
    FIELD_TYPE.uint16
  ),
  new ReadSingleRegisterCommand(
    "serial_number",
    0x00,
    0x11,
    4,
    "",
    FIELD_TYPE.serial_number
  ),
  new ReadSingleRegisterCommand(
    "ac_output_state",
    0x00,
    0x30,
    1,
    "",
    FIELD_TYPE.bool
  ),
  new ReadSingleRegisterCommand(
    "dc_output_state",
    0x00,
    0x31,
    1,
    "",
    FIELD_TYPE.bool
  ),
  new ReadSingleRegisterCommand(
    "pack_num",
    0x00,
    0x60,
    1,
    "",
    FIELD_TYPE.uint16
  ),
  // detail page
  new ReadSingleRegisterCommand(
    "ac_output_mode",
    0x00,
    0x46,
    1,
    "",
    FIELD_TYPE.uint16
  ),
  new ReadSingleRegisterCommand(
    "ac_output_voltage",
    0x00,
    0x47,
    1,
    "v",
    FIELD_TYPE.decimal,
    1
  ),
  new ReadSingleRegisterCommand(
    "arm_version",
    0x00,
    0x17,
    2,
    "",
    FIELD_TYPE.version
  ),
  new ReadSingleRegisterCommand(
    "dsp_version",
    0x00,
    0x19,
    2,
    "",
    FIELD_TYPE.version
  ),
  new ReadSingleRegisterCommand(
    "power_generation",
    0x00,
    0x29,
    1,
    "w",
    FIELD_TYPE.decimal,
    1
  ),
  new ReadSingleRegisterCommand(
    "internal_current_one",
    0x00,
    0x48,
    1,
    "a",
    FIELD_TYPE.decimal
  ),

  new ReadSingleRegisterCommand(
    "internal_ac_frequency",
    0x00,
    0x4a,
    1,
    "hz",
    FIELD_TYPE.decimal,
    2
  ),
  new ReadSingleRegisterCommand(
    "total_battery_percent",
    0x00,
    0x2b,
    1,
    "%",
    FIELD_TYPE.uint16
  ),
  new ReadSingleRegisterCommand(
    "internal_pack_voltage",
    0x00,
    0x5c,
    1,
    "v",
    FIELD_TYPE.decimal,
    1
  ),
  new ReadSingleRegisterCommand(
    "pack_num_max",
    0x00,
    0x5b,
    1,
    "",
    FIELD_TYPE.uint16
  ),
  new ReadSingleRegisterCommand(
    "internal_dc_input_current",
    0x00,
    0x58,
    1,
    "a",
    FIELD_TYPE.decimal,
    1
  ),
  new ReadSingleRegisterCommand(
    "internal_dc_input_power",
    0x00,
    0x57,
    1,
    "w",
    FIELD_TYPE.uint16
  ),
  new ReadSingleRegisterCommand(
    "internal_dc_input_voltage",
    0x00,
    0x56,
    1,
    "v",
    FIELD_TYPE.decimal
    ),
    new ReadSingleRegisterCommand(
        "internal_cell01_voltage",
        0x00,
        0x69,
        2,
        "v",
        FIELD_TYPE.decimal,
    ),
    new ReadSingleRegisterCommand(
        "internal_cell02_voltage",
        0x00,
        0x6A,
        2,
        "v",
        FIELD_TYPE.decimal,
    ),
    new ReadSingleRegisterCommand(
        "internal_cell03_voltage",
        0x00,
        0x6B,
        2,
        "v",
        FIELD_TYPE.decimal,
    ),
    new ReadSingleRegisterCommand(
        "internal_cell04_voltage",
        0x00,
        0x6C,
        2,
        "v",
        FIELD_TYPE.decimal,
    ),
    new ReadSingleRegisterCommand(
        "internal_cell05_voltage",
        0x00,
        0x6D,
        2,
        "v",
        FIELD_TYPE.decimal,
    ),
    new ReadSingleRegisterCommand(
        "internal_cell06_voltage",
        0x00,
        0x6E,
        2,
        "v",
        FIELD_TYPE.decimal,
    ),
    new ReadSingleRegisterCommand(
        "internal_cell07_voltage",
        0x00,
        0x6F,
        2,
        "v",
        FIELD_TYPE.decimal,
    ),
    new ReadSingleRegisterCommand(
        "internal_cell08_voltage",
        0x00,
        0x70,
        2,
        "v",
        FIELD_TYPE.decimal,
    ),
    new ReadSingleRegisterCommand(
        "internal_cell09_voltage",
        0x00,
        0x71,
        2,
        "v",
        FIELD_TYPE.decimal,
    ),
    new ReadSingleRegisterCommand(
        "internal_cell10_voltage",
        0x00,
        0x72,
        2,
        "v",
        FIELD_TYPE.decimal,
    ),
    new ReadSingleRegisterCommand(
        "internal_cell11_voltage",
        0x00,
        0x73,
        2,
        "v",
        FIELD_TYPE.decimal,
    ),
    new ReadSingleRegisterCommand(
        "internal_cell12_voltage",
        0x00,
        0x74,
        2,
        "v",
        FIELD_TYPE.decimal,
    ),
    new ReadSingleRegisterCommand(
        "internal_cell13_voltage",
        0x00,
        0x75,
        2,
        "v",
        FIELD_TYPE.decimal,
    ),
    new ReadSingleRegisterCommand(
        "internal_cell14_voltage",
        0x00,
        0x76,
        2,
        "v",
        FIELD_TYPE.decimal,
    ),
    new ReadSingleRegisterCommand(
        "internal_cell15_voltage",
        0x00,
        0x77,
        2,
        "v",
        FIELD_TYPE.decimal,
    ),
    new ReadSingleRegisterCommand(
        "internal_cell16_voltage",
        0x00,
        0x78,
        2,
        "v",
        FIELD_TYPE.decimal,
    ),
    new ReadSingleRegisterCommand(
        "auto_sleep_mode",
        0x00,
        0xF5,
        1,
        "",
        FIELD_TYPE.uint16
    ),
];
