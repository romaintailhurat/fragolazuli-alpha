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

	// PASSE
	$scope.passer = function() {
		var numOfDices = 1,
			numOfFaces = 6,
			dice6RollPasseur = rollDice(numOfDices, numOfFaces),
			dice6RollReceveur,
			jetPasseur = dice6RollPasseur + $scope.passeur.skills.main,
			jetReceveur;


		if (jetPasseur < PASSE_RATEE) {

			$scope.resultatPasse = "RATEE PASSEUR! [" + jetPasseur + "]";

		} else if (PASSE_RATEE < jetPasseur < PASSE_REUSSIE){
			dice6RollReceveur = rollDice(numOfDices, numOfFaces);
			jetReceveur = dice6RollReceveur + $scope.receveur.skills.main;

			if (jetPasseur + jetReceveur > PASSE_REUSSIE) {
				$scope.resultatPasse = "REUSSIE RECEVEUR ! [" + jetPasseur + " - " + jetReceveur + "]";	
			} else {
				$scope.resultatPasse = "RATEE RECEVEUR ! [" + jetPasseur + " - " + jetReceveur + "]";
			}
			

		} else {
			$scope.resultatPasse = "REUSSIE PASSEUR! [" + jetPasseur + "]";
		}
	}

	// COURSE
	$scope.courir = function () {
		$scope.resultatCourse = rollDice(2, 6) + $scope.coureur.skills.rapidite;
	}
};