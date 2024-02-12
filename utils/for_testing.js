const reverse = (string) => {
  return string.split("").reverse().join("");
};

const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item;
  };

  return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length;
};

module.exports = {
  reverse,
  average,
};

/*
NOTES:
AUTOMATED TESTING: 
1) efficiency=>much faster, more efficient compared to manual testing
2)reliability: eliminate human errors
3)time, cost saving=> reduced time &cost associated with testing activities, reused code
4)various scenarios
5)decrease complexity for larger projects
6)crucial role in CI/CD (cover later on :) )
*/

/*
JEST LIBRARY: for writing automated tests, simple, fast and parallel execution
jest need to be executed with verbose style:
in package.json file;
"test": jest --verbose --runInBand

*** --verbose: This flag enables verbose output during test execution. It provides more detailed information about the tests
***--runInBand: This flag tells Jest to run tests sequentially in a single process

jest requires to specify that the execution env is Node, in package.json file:
"jest": {
    "testEnvironment": "node",
  }
*/
