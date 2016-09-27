const http = require('https');
const apiUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=46a247f7ad0611a92fa3bf67a931c5db&format=json&nojsoncallback=1";
const querystring = require('querystring');


module.exports = {getFlickrPhotos : getFlickrPhotos};

function getFlickrPhotos(callback) {

  http.get(apiUrl, (res) => {
  //console.log(`Got response: ${res}`);
  //console.log(res);
  var data = "";
  res.on('data', function (chunk) {
  	//console.log('BODY:', chunk);
  	data += chunk;
  });

  var arr = [];
  res.on('end', () => {
  	data = JSON.parse(data);
  	//console.log(data);
  	//console.log(data.photos.photo);
  	for (var i = 0; i < data.photos.photo.length; i++) {
  		var photo = data.photos.photo[i];
  		var title = photo.title;
  		var small = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_s.jpg`;
  		var medium = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_m.jpg`;
      var large = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_z.jpg`;
  		var PhotoData = {title:title, small:small, medium:medium};
  		arr.push(PhotoData);
  	}

  	//console.log(arr);
  	callback(arr);
  });
  // consume response body
  //res.resume();
}).on('error', (e) => {
  console.log(`Got error: ${e.message}`);
});
}

getFlickrPhotos((res)=>{
	//console.log(res[0]);
});

