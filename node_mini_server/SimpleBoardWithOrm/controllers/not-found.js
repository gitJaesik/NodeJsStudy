module.exports = (req, res, next) => {
	res.status(404).end("Not Found");
};
// req, res는 request, response
// next는 미들웨어 변수