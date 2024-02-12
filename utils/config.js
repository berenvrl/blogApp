//handling env variables
require("dotenv").config();

const PORT = process.env.PORT;

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

module.exports = {
  PORT,
  MONGODB_URI,
};

//NOTES
/* In package.json file, we define NODE_ENV variable to seperate test and production
 "start": "cross-env NODE_ENV=production node server.js",
  "dev": "cross-env NODE_ENV=development nodemon server.js",
  "test": "cross-env NODE_ENV=test jest --verbose --runInBand"

  --runInBand: this flag prevents jest from running tests in parallel

  npm install --save-dev cross-env:
  **The cross-env package is used in the "test" script to set the NODE_ENV environment variable to "test" before running the jest command. This ensures that your tests are executed in the appropriate environment
  Installing cross-env as a development dependency allows you to use it during development, testing, or any other build processes that require setting environment variables in a cross-platform manner.
*/
