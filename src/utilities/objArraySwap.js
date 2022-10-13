export const arrayToObj = (arr, key) => {
  const obj = {};

  [...arr].forEach((item) => {
    obj[item[key]] = { ...item };
  });

  return obj;
};

export const objToArray = (obj) => {
  const arr =
    obj && Object.keys(obj).length
      ? Object.keys(obj).map((key) => obj[key])
      : [];
  return arr;
};
