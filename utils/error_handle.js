// module.exports = (status, message) => {
//   const err = new Error();
//   err.status = status;
//   err.message = message;
// };

class CreateError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.status = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CreateError;
