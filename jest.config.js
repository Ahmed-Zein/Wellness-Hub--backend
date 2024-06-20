/**
 * Jest configuration
 */
module.exports = {
  modulePathIgnorePatterns: ["<rootDir>/config/"],
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/vendor/**",
  ],
  coverageReporters: ["text", "cobertura"],
  reporters: ["default", "jest-junit"],
};
