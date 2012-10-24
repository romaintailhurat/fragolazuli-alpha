import webapp2
import jinja2
import os
import json

from google.appengine.api import channel

from google.appengine.ext import db

from random import randint

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

CHAN_ID  = 'SW'

#----------- GAME logic and persistence

#------ consts

GAME_STATE_MACHINE = {
    'created' : 'in progress',
    'in progress' : 'closed'
}

TYPES = {
    'T' : 'T',
    'R' : 'R',
    }
TYPES_WITH_WEIGHT = {'T':0.9,'R':0.2}
TYPES_FREQ = {'T': 0,'R' : 0}

#------ functions

#--- random id


#------ models

class Game(db.Model):
    state = 'created'
    grid = []
    players = {
        'player1' : '',
        'player2' : ''
    }

    """
    Generate the grid map for the game. We start by choosing a type of
    cell (T or R) for each position ij ; after that, we choose of position
    on a R type cell for each starting dome.
    """
    def generateGrid(self, m, n):

        resourceTilesLocation = []
        
        #generate basic map with T and R
        for i in range(m):
            arrayToPush = []

            for j in range(n):
                cell = self.generateTypeOfCell()
                arrayToPush.append(cell)
                if cell == 'R' :
                    resourceTilesLocation.append(str(i) + str(j))
            
            self.grid.append(arrayToPush)

        positionsDic = self.generatePlayersStartingDomePositions(resourceTilesLocation)

        player1StartingDome_I = int(positionsDic['P1'][0])
        player1StartingDome_J = int(positionsDic['P1'][1])

        player2StartingDome_I = int(positionsDic['P2'][0])
        player2StartingDome_J = int(positionsDic['P2'][1])

        self.grid[player1StartingDome_I][player1StartingDome_J] = 'D1'
        self.grid[player2StartingDome_I][player2StartingDome_J] = 'D2'

    """
    Determining a position for each starting dome based on an array containing
    the coordinates of each R type cell
    """
    def generatePlayersStartingDomePositions(self, resourceTilesLocation):
        #add players starting domes
        #for player1
        randomPosition1 = randint(0, len(resourceTilesLocation))
        randomPosition2 = randomPosition1
        player1StartingDomeLocation = resourceTilesLocation[randomPosition1]
        player2StartingDomeLocation = ''

        #and then for player2
        while (randomPosition2 == randomPosition1) : 
            randomPosition2 = randint(0, len(resourceTilesLocation))
            player2StartingDomeLocation = resourceTilesLocation[randomPosition2]

        return {'P1' : player1StartingDomeLocation, 'P2' : player2StartingDomeLocation}

    
    """
    Generate a type of cell, using weight in TYPES_WITH_WEIGHT
    for drawing.
    @return one of the type defined in TYPES
    """
    def generateTypeOfCell(self):
        numberOfTypes = len(TYPES)
        proba = randint(0,10) / 10

        if proba < TYPES_WITH_WEIGHT['T']:
            return TYPES['T']
        else :
            return TYPES['R']


#----------- MAIN Request Handler

class SWMainHandler(webapp2.RequestHandler):
    def get(self):
    	token = channel.create_channel(CHAN_ID)
    	template = jinja_environment.get_template('squaredwars.html')
        query = Game.all()
        res = query.fetch(10)
        self.response.out.write(template.render({'token' : token, 'res' : res}))

    def post(self):
		message = self.request.get('m')
		jsonMessage = json.JSONDecoder().decode(message)
		#TODO : how to log to the gae log ?
		channel.send_message(CHAN_ID, message)

#----------- GAME Handler

class SWGameHandler(webapp2.RequestHandler):
    def get(self):
        gameId = self.request.get("game_id")
        game = Game.get(gameId)
        message ="game_id : %s has status : %s" % (gameId, game.state)

        currentPlayer = ''
        if game.players['player1'] == '' :
            currentPlayer = 'player1'
            game.players['player1'] = 'player1'
        elif game.players['player2'] == '' :
            currentPlayer = 'player2'
            game.players['player1'] = 'player2'
        else :
            currentPlayer = 'spectator'

        #channel creation
        token = channel.create_channel(currentPlayer)

        template = jinja_environment.get_template('squaredwars.play.html')
        self.response.out.write(template.render(
            {
            'message' : message,
             'token' : token, 
             'grid' : game.grid,
             'player' : currentPlayer
             })
        )

    def post(self):
        pass

#----------- GAME Creation Handler

class SWGameCreation(webapp2.RequestHandler):
    def post(self):
        game = Game()
        game.generateGrid(10, 20)
        game.put()
        gameId = game.key()
        #self.response.content_type = 'application/json'
        self.response.out.write('{"gameId" : "%s"}' % str(gameId))
