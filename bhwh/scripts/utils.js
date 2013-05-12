/*
UTILS
*/

/*
Ajoute une image au sens balise <img/> dans un tableau global IMAGES.
*/
var addImageFromSourceToPool = function(nom, source) {
	var img = new Image();
	img.src = source;
	IMAGES[nom] = img;
};

/*
Exécute une fonction en passant son nom en String.

Voir http://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string
*/
var executeFunctionByName = function(functionName, context /*, args */) {
  var args = Array.prototype.slice.call(arguments).splice(2);
  var namespaces = functionName.split(".");
  var func = namespaces.pop();
  for(var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(this, args);
}