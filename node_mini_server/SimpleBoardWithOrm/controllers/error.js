module.exports = (err, req, res, next) => {
	res.status(500).end(JSON.stringify(err));
};
// err가 맨 앞이다. 순서를 외우는 것이 중요