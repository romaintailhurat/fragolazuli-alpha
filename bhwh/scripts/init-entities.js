
var 
TEST = TEST || {};
TEST.data = (function() {
	// private fields and methods

	var

	fetchEntitiesLayersFromGameData = function (gamedata) {

		var layers = {};

		for (var layer in gamedata) {
			console.log('Ajout de ' + layer + ' de type ' + gamedata[layer].type);
			layers[layer] = gamedata[layer].type;
		}

		return layers;
	},

	addEntitiesLayers = function (scene, layers) {

		console.log(layers);
		
		for (var layer in layers) {
			console.log(layer + ' - ' + layers[layer]);
			scene.addLayer(layer);
		}
	};

	// public API
	return {
		
		/*
		@param scene la scene à laquelle on ajout les layers
		@param dataSource le fichier JSON d'initialisation
		*/
		initEntitiesAndComponents : function(scene, dataSource) {

			console.log('fonction d\'initialisation des entités et composants à partir du fichier ' + dataSource);

			var gamedata,
				entitiesLayers;

			// Récupère le JSON sous forme d'objet JS directement
			$.getJSON(dataSource, function(data) {

				gamedata = data;

			}).done(function() {

				console.log("Game data fetched.");
				
				// -----------
				// WHERE MAGIC HAPPENS !
				// -----------

				console.log(gamedata.subnetEntitiesLayer.type);

				// On récupère les entities layers
				entitiesLayers = fetchEntitiesLayersFromGameData(gamedata);
				// on les ajoute à la scene cible
				addEntitiesLayers(scene, entitiesLayers);
				

			}).fail(function(jqxhr,status,error) {

				console.log("oups, failed to fetch data.");
				console.log("S : " + status);
				console.log("E : " + error);

			});


		}
	};

} () );