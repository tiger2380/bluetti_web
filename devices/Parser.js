/**
 * Converts an array buffer to a string.
 *
 * @param {ArrayBuffer} buffer - The array buffer to convert.
 * @return {string} The converted string.
 */
function arrayBufferToString(buffer) {
  var arr = new Uint8Array(buffer);
  var str = String.fromCharCode.apply(String, arr);

  if (/[\u0080-\uffff]/.test(str)) {
    throw new Error("this string seems to contain (still encoded) multibytes");
  }
  return str.replace(/\0+$/, "");
}


/**
 * Parses a uint field from the given value.
 *
 * @param {any} value - The value to parse.
 * @return {number} The parsed uint field value.
 */
const parse_uint_field = (value) => {
  return value.getInt16(0);
};

/**
 * Parses a decimal field value.
 *
 * @param {object} value - The value to parse.
 * @param {number} scale - The scale of the decimal field.
 * @return {number} The parsed decimal value.
 */
const parse_decimal_field = (value, scale) => {
  const rawValue = value.getUint16(0, false);
  return rawValue / Math.pow(10, scale);
};

/**
 * Parses a boolean field from a given value.
 *
 * @param {value} value - The value to parse.
 * @return {boolean} The parsed boolean value.
 */
const parse_bool_field = (value) => {
  return value.getInt8(1) === 1;
};

/**
 * Parses a string field.
 *
 * @param {any} value - The value to be parsed.
 * @return {string} The parsed string value.
 */
const parse_string_field = (value) => {
  return arrayBufferToString(value.buffer);
};

/**
 * Parses a serial number field and returns the combined value.
 *
 * @param {object} value - The serial number field to parse.
 * @return {number} The combined value of the serial number field.
 */
const parse_serial_number_field = (value) => {
  let values = [
    value.getUint8(0, false),
    value.getUint8(2, false),
    value.getUint8(4, false),
    value.getUint8(6, false),
  ];
  return values[0] | (values[1] << 16) | (values[2] << 32) | (values[3] << 48);
};

/**
 * Parses the version field from a given value.
 *
 * @param {Uint8Array} value - The value to parse.
 * @return {number} The parsed version field value.
 */
const parse_version_field = (value) => {
  let values = [value.getUint16(0, false), value.getUint16(2, false)];
  return (values[0] + (values[1] << 16)) / 100;
};

/**
 * Parses a field value based on its type and scale.
 *
 * @param {any} value - The value to be parsed.
 * @param {string} type - The type of the field.
 * @param {number} scale - The scale of the field.
 * @return {any} - The parsed field value.
 */
const parse_field = (value, type, scale) => {
  try {
    switch (type) {
      case FIELD_TYPE.uint8:
      case FIELD_TYPE.uint16:
      case FIELD_TYPE.uint32:
        return parse_uint_field(value);
      case FIELD_TYPE.decimal:
        return parse_decimal_field(value, scale);
      case FIELD_TYPE.bool:
        return parse_bool_field(value);
      case FIELD_TYPE.string:
        return parse_string_field(value);
      case FIELD_TYPE.serial_number:
        return parse_serial_number_field(value);
      case FIELD_TYPE.version:
        return parse_version_field(value);
      default:
        throw new Error(`Unknown field type ${type}`);
    }
  } catch (error) {
    if (error instanceof RangeError) {
      //throw new Error(`Invalid field type ${type}`);
    }
  }
};