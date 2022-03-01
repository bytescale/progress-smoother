module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "progress-smoother/(.*)": "<rootDir>/src/$1"
  },
  setupFilesAfterEnv: ["<rootDir>/jest.config.pretest.js"]
};
