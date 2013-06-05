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
		},
		{
			'type' : 'Singe',
			'nom' : 'Monk',
			'skills' : {
				'force' : 2,
				'rapidite' : 4,
				'main' : 7,
				'pied' : 3
			}
		},
		{
			'type' : 'Crocodile',
			'nom' : 'Gator',
			'skills' : {
				'force' :5,
				'rapidite' : 3,
				'main' : 8,
				'pied' : 0
			}
		},
		{
			'type' : 'Gorille',
			'nom' : 'Rex',
			'skills' : {
				'force' : 7,
				'rapidite' : 2,
				'main' : 5,
				'pied' : 2
			}
		},
		{
			'type' : 'Aigle',
			'nom' : 'Jet',
			'skills' : {
				'force' : 1,
				'rapidite' : 5,
				'main' : 2,
				'pied' : 8
			}
		},
		{
			'type' : 'Pieuvre',
			'nom' : 'Octo',
			'skills' : {
				'force' : 3,
				'rapidite' : 2,
				'main' : 6,
				'pied' : 5
			}
		},
		{
			'type' : 'Guepard',
			'nom' : 'Paw',
			'skills' : {
				'force' : 2,
				'rapidite' : 8,
				'main' : 5,
				'pied' : 1
			}
		},
		{
			'type' : 'Autruche',
			'nom' : 'Berthe',
			'skills' : {
				'force' : 1,
				'rapidite' : 7,
				'main' : 2,
				'pied' : 6
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