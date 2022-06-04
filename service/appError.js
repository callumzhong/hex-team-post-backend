const appError = (httpStatus, errMessage, next) => {
	const error = new Error(errMessage);
	error.statusCode = httpStatus;
	error.isOperational = true;
	next(error);
};
const Success = (res, data) => {
	res.status(200).json({
		status: 'success',
		data,
	});
};
const SuccessPagination = (res, data,Pagination) => {
	res.status(200).json({
		status: 'success',
		data,
		Pagination,
	});
};

module.exports = { appError, Success,SuccessPagination };
