var PASSE_RATEE = 4,
	PASSE_REUSSIE = 12;

function MainController($scope) {

	$scope.animaux = [
		{
			'type' : 'Lion',
			'nom' : 'Joe',
			'skills' : {
				'force' : 6,
				'rapidite' : 4,
				'main' : 5,
				'pied' : 1
			}
		},
		{
			'type' : 'Rhinoceros',
			'nom' : 'Brutus',
			'skills' : {
				'force' : 8,
				'rapidite' : 3,
				'main' : 4,
				'pied' : 1
			}
		}
	];

	$scope.resultatPasse = "";

	$scope.passer = function() {
		var numOfDices = 1,
			numOfFaces = 6,
			dice6Roll = rollDice(numOfDices, numOfFaces),
			res = dice6Roll + $scope.passeur.skills.main;

		console.log('res : ' + res);

		if (res < PASSE_RATEE) {

			$scope.resultatPasse = "RATEE !";

		} else if (PASSE_RATEE < res < PASSE_REUSSIE){
			
			$scope.resultatPasse = "JET RECEVEUR !";

		} else {
			$scope.resultatPasse = "REUSSIE !"
		}
	}
};