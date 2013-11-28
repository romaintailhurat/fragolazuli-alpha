
/*
CRYSTALWARS

Messaging operations

DEPENDENCIES:
 - appengine channel client lib (provided by Appengine containers)
 - jquery 2.x
*/

var CW = CW || {};

CW.messaging = {
	
	onopen : function() {
		console.log('Socket is open');
	},

	onmessage : function(data) {
    	console.log('A message received from the server via the channel');
    	console.log('Data was : ' + data);
    },

    onerror : function() {
    	console.log('There was a com error with the channel');
    },

    onclose : function() {
        CW.currentPlayer;
    	console.log('Socket just closed');
    }
};