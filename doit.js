'use strict';
var FB = require('fb').default;
var url = require('url');

FB.options({
	accessToken: process.env.ACCESS_TOKEN,
	appId: process.env.APP_ID})

let numPosts = 0;
let list = function(urlPath, del) {
	FB.api(
	  urlPath,
	  'GET',
	  {"fields":"id"},
	  (response) => {
		if(!response || response.error) {
			console.log(!response ? 'error occurred' : response.error);
			return;
		}
		// console.log(response);
	        numPosts += response.data.length;
		console.log('Num posts: ', numPosts);
		if (del) {
		  response.data.forEach((elem) => {
			  FB.api(elem.id, 'delete', (res) => {
				  if(!res || res.error) {
				    console.log(!res ? 'error occurred' : res.error);
				    return;
				  }
				  console.log('Deleted ', elem.id);
				});
		  });
		}
		let next = url.parse(response.paging.next, true);
		list(next.path, del);
	  }
	);
};

list('/me/feed', true);

