var obj = require('./flickrmodule');

obj.getFlickrPhotos((res) => {
	console.log(res.length);
});