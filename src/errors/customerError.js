module.exports = class CustomError extends Error {
  constructor(msg, type, statusCode) {
    super(msg);
    this.type = type;
    this.statusCode = statusCode;
  }
};
