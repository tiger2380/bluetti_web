function syntaxHighlight(json) {
  if (typeof json != "string") {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
}

function crc16(data) {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x0001) !== 0) {
        crc >>= 1;
        crc ^= 0xa001;
      } else {
        crc >>= 1;
      }
    }
  }
  return crc;
}

function convertCRC16ToBytes(crc16) {
  const uint16Array = new Uint16Array([crc16]);
  const buffer = uint16Array.buffer;
  const bytes = new Uint8Array(buffer);
  return bytes;
}

function crc16String(data) {
  const crc = crc16(data);
  return crc.toString(16);
}

function crc16HexString(data) {
  const crc = crc16(data);
  return crc.toString(16).padStart(4, "0");
}

const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Converts a DataView to an array.
 *
 * @param {DataView} dataView - The DataView to be converted.
 * @return {Array<number>} The converted array.
 */
function dataViewToArray(dataView) {
  let array = [];
  for (let i = 0; i < dataView.byteLength; i++) {
    array.push(dataView.getUint8(i));
  }
  return array;
}

/**
 * Creates an array of numbers in the specified range.
 *
 * @param {number} start - the start of the range
 * @param {number} end - the end of the range
 * @return {array} the array of numbers in the specified range
 */
function range(start, end) {
  return Array.from({ length: end - start }, (_, i) => i + start);
}

window.parsed = {};
window.targetProxy = new Proxy(parsed, {
  set: function (target, key, value) {
    if (typeof value === "string" && "undefined" != value.substring(0, 9)) {
      target[key] = value;
      console.log(target);
      window.eventEmitter.emit("update", target);
    }
    return true;
  },
});
