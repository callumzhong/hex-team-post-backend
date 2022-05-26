

const appError = (httpStatus,errMessage,next)=>{
    const error = new Error(errMessage);
    error.statusCode = httpStatus;
    error.isOperational = true;
    next(error);
};
const Success= (res, data)=>{
      res.status(200).json({
        status: true,
        data
      });
}

module.exports = {appError,Success};