const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  maxConcurrency: 1,
  testPathIgnorePatterns: [
    "/node_modules/",
    "/config",
    "/src/handlers",
    "/dist",
  ],
  globals: {
    "ts-jest": {
      isolatedModules: true,
      tsconfig: {
        rootDir: './src'
      }
    },
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/src/",
  }),
};
