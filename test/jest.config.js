// See: jestjs.io/docs/configuration.html
module.exports = {
  "rootDir": "../",
  "roots": [
    "src/js",
    "test/js"
  ],
  "moduleFileExtensions": [
    "js",
    "jsx"
  ],
  "moduleDirectories": [
    "node_modules",
    "src/js",
    "test/js"
  ],
  "setupFilesAfterEnv": [
    "<rootDir>/test/jest.setup.js"
  ],
  "transform": {
    "\\.jsx?$": "babel-jest"
  },
  "verbose": false
};
