const isOwnProperty = (targetObject, targetProperty) => {
  return Object.prototype.hasOwnProperty.call(targetObject, targetProperty);
};

module.exports = isOwnProperty;
