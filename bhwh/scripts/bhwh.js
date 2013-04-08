// ----------------------------------------
// GAME SCENES
// ----------------------------------------

var GameScene = pc.Scene.extend('GameScene', 
	{},
	{
		gameLayer : null,

		init : function() {
			console.log("Initialisation GameScene");
			this._super();

			// Instanciation des Layers
			var carteMondeLayer = new CarteMondeLayer("carteMondeLayer", 1);

			carteMondeLayer.name = "carteMondeLayer"; // BUG ???? le nom devrait découler du nom après l'extend

			// Ajout des layers
			this.addLayer(carteMondeLayer);
			var subnetEntitiesLayer = new SubnetEntitiesLayer();
			subnetEntitiesLayer.name = "subnetEntitiesLayer";
			this.addLayer(subnetEntitiesLayer);

			// Création d'une entité de type Subnet
			var US = pc.Entity.create(subnetEntitiesLayer);
			// Ajout du composant définissant la position
			US.addComponent(pc.components.Spatial.create({ x: 47, y: 205, w: 355 ,h: 210}));
			// Ajout composant Rectangle
			US.addComponent(pc.components.Rect.create({ color: '#FFEEFF' }));
			// Puis le système permettant le rendu
			subnetEntitiesLayer.addSystem( new pc.systems.Render());
		},
		process : function() {
			this._super();
		}

	});

// ----------------------------------------
// GAME LAYERS
// ----------------------------------------

var CarteMondeLayer = pc.Layer.extend('CarteMondeLayer',
	{},
	{
		init : function() {
			this._super();
		},

		draw : function() {
			pc.device.ctx.drawImage(IMAGES.monde, 0, 0);
			this._super();
		},
		process : function() {
			this._super();
		}

	});

// ----------------------------------------
// GAME
// ----------------------------------------

var BHWH = pc.Game.extend('BHWH',
	{},
	{
		menuScene : null,

		onReady : function() {
			console.log('Game, onReady');
			this._super();
			
			// lance le loader, et enchaine onLoading et onLoaded à l'exécution
			pc.device.loader.start(this.onLoading.bind(this), this.onLoaded.bind(this));
		},
		onLoading : function() {
			console.log('Game, onLoading');
			
			
		},
		onLoaded : function() {
			
			console.log('Game, onLoaded');

			// Binding inputs joueurs
		    pc.device.input.bindAction(this, 'info', 'SPACE');

			// Chargement des images dans le pool
			addImageFromSourceToPool('menu', IMG_SRC.Menu);
			addImageFromSourceToPool('monde', IMG_SRC.Monde);
			addImageFromSourceToPool('black', IMG_SRC.BlackSkull);

			// Intanciation des Scenes
			this.gameScene = new GameScene();
			
			// Ajout des scenes
			this.addScene(this.gameScene);

		},
		onAction : function(actionName) {

			// FIXME switch plutôt que if
			if(actionName === 'info') {
				alert('INFOS !');
			}

		}
	});




