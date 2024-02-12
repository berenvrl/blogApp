//handling logging

//printing log messages
const info = (...params) => {
  //dont print when its in test mode
  if (process.env.NODE_ENV !== "test") {
    console.log(...params);
  }
};

//printing error message
const error = (...params) => {
  //dont print when its in test mode
  if (process.env.NODE_ENV !== "test") {
    console.error(...params);
  }
};

module.exports = {
  info,
  error,
};
