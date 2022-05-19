

const appError = (httpStatus,errMessage,next)=>{
    const error = new Error(errMessage);
    error.statusCode = httpStatus;
    error.isOperational = true;
    next(error);
};
const Success= (res, data)=>{
    res.send({
        status: true,
        data
      }).end();
}

module.exports = {appError,Success};