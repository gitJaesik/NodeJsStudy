const http = require('https');
const apiUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=2ce73bc2244005400b6e36dfab7282f3&format=json&nojsoncallback=1&api_sig=8ab859e3897aba07f9929bb18d5dbf74";
const querystring = require('querystring');


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
	console.log(res[0]);
});
