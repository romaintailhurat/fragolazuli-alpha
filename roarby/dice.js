// JavaScript Document

// Script found here : http://www.underprise.com/2012/06/05/dicejs-a-javascript-dice-roller/
// Slightly enhanced...


function rollDice( numberOfDice, numberOfSides )
{
	//default the values to numberOfDice (1) and numberOfSides (6)
	if (typeof numberOfDice == "undefined" ) numberOfDice = 1;
	if (typeof numberOfSides == "undefined" ) numberOfSides = 6;
	
	//debug to the screen
	var debug = false;
	//results of the dice rolls;
	var resultOfDice = new Array();

	// becuz at the end we want the sum of all the rolls !!!
	var finalRes = 0;
	
	//loop over the numberOfDice generating a random number between one and the the numberOfSides
	for( i=0; i<numberOfDice; i++)
	{
		//generate a random number between 1 and numberOfSides;
		var valueOfDice = Math.floor( (Math.random()*numberOfSides) +1 );
		//store it in the array;
		resultOfDice[i] = valueOfDice;
	}
	
	//debugging;
	if( debug )
	{
		//string to hold the output;
		var outputOfDice = "";
		//loop over the results
		for( i=0; i<resultOfDice.length; i++ )
		{
			//add to the outputOfDice string;
			outputOfDice += resultOfDice[i].toString() + " ";
		}
		
		//Show me the money!;
		alert( outputOfDice );
	}
	else
	{
		for (var i = 0 ; i < resultOfDice.length ; i++) {
			finalRes += resultOfDice[i];
		}

		return finalRes;
	}
			
}