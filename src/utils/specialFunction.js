// Get Unique data from array

const getUniqueListBy = (arr, key) => {
  return [
    ...new Map([...arr].reverse().map((item) => [item[key], item])).values(),
  ];
};
