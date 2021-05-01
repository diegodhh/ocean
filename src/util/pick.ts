const pick = (
  object: { [x: string]: any },
  keys: any[],
  notEmptyObject: boolean = false
) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      if (notEmptyObject && Object.keys(object[key]).length === 0) {
        return obj;
      }
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

export default pick;
