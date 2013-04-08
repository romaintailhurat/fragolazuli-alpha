/*
UTILS
*/

var addImageFromSourceToPool = function(nom, source) {
	var img = new Image();
	img.src = source;
	IMAGES[nom] = img;
};