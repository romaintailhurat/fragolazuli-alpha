import webapp2
import jinja2
import os
import json
import logging

from google.appengine.api import channel

from google.appengine.ext import db

from random import randint

import pickle

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

#See http://stackoverflow.com/questions/2028355/datastore-list-of-lists
class GridProperty(db.Property):

    data_type = list

    def get_value_for_datastore(self, model_instance):
        return db.Blob(pickle.dumps(getattr(model_instance,self.name)))

    def make_value_from_datastore(self, value):
        return pickle.loads(value)

    def validate(self, value):
        return value

    def empty(self, value):
        return not value

class Game(db.Model):
    state = db.StringProperty()
    grid = GridProperty()
    player1 = db.StringProperty()
    player2 = db.StringProperty()

    """
    MUST BE CALLED BEFORE USING THE OTHER METHODS
    """
    def init(self):
        self.state = ''
        self.grid = []
        self.player1 = ''
        self.player2  = ''


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
        randomPosition1 = randint(0, len(resourceTilesLocation) - 1)
        randomPosition2 = randomPosition1
        player1StartingDomeLocation = resourceTilesLocation[randomPosition1]
        player2StartingDomeLocation = ''

        #and then for player2
        while (randomPosition2 == randomPosition1) : 
            randomPosition2 = randint(0, len(resourceTilesLocation) - 1)
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

        if game.player1 == '' :
            currentPlayer = 'player1'
            game.player1 = 'player1'
            game.put()

        elif game.player2 == '' :
            currentPlayer = 'player2'
            game.player2 = 'player2'
            game.put()

        else :
            currentPlayer = 'observer' #TODO the spectator should be able to see the entire map ala SC2

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
        # TODO
        # use a JSON message
        # add parameters : game_id, data
        # return a JSON string
        sender = self.request.get('player')

        logging.debug('The value of the parameter player is %s' %sender )

        if sender == 'player1' :
            channel.send_message('player2','ping from %s' %sender)
        elif sender == 'player2' :
            channel.send_message('player1','ping from %s' %sender)

        self.response.out.write('message sent to the other player') 

#----------- GAME Creation Handler

class SWGameCreation(webapp2.RequestHandler):
    def post(self):
        game = Game()
        game.init()
        game.generateGrid(10, 20)
        game.state = 'created'
        game.put()
        gameId = game.key()
        #self.response.content_type = 'application/json'
        self.response.out.write('{"gameId" : "%s"}' % str(gameId))
