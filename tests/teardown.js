module.exports = () => {
  process.exit(0);
};

/*
NOTES
when test fails with an error: "Jest didnt exit one second after the test run has completed"
This error related with Mongoose version
To get rid of the error=>
1) module.exports = () => {process.exit(0);};
2)extend jest definition in package.json file:
"jest": {
   "testEnvironment": "node",
   "globalTeardown": "./tests/teardown.js"
 }
*/
