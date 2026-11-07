function autoNullify(obj, keys) {
  const result = {};
  for (const key of keys) {
    result[key] = obj[key] ?? null; // null if undefined
  }
  return result;
}


module.exports = autoNullify;