const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let CustomErrors = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong'
  }

  if (err.name === 'ValidationError') {
    CustomErrors.msg = Object.values(err.errors).map((item) => item.message).join(',')
    CustomErrors.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.code === 11000) {
    CustomErrors.msg = `provided value ${Object.keys(err.keyValue)} already exist please choose different value`;
    CustomErrors.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === 'CastError') {
    CustomErrors.msg = `job with id ${err.value} does not exist`;
    CustomErrors.statusCode = StatusCodes.NOT_FOUND;

  }
  return res.status(CustomErrors.statusCode).json({ err: CustomErrors.msg })
}

module.exports = errorHandlerMiddleware
