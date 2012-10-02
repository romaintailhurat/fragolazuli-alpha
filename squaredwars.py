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

TYPES = {'T' : 'T','R' : 'R'}
TYPES_WITH_WEIGHT = {'T':0.9,'R':0.2}
TYPES_FREQ = {'T': 0,'R' : 0}

#------ functions

#--- random id


#------ models

class Game(db.Model):
    state = 'created'
    grid = []

    def generateGrid(self, m, n):
        for i in range(m):
            arrayToPush = []

            for j in range(n):
                cell = self.generateTypeOfCell()
                arrayToPush.append(cell)
            
            self.grid.append(arrayToPush)
    
    """
    Generate a type of cell, using weight in TYPES_WITH_WEIGHT
    for drawing.
    @return a type defined in TYPES
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
        self.response.out.write(template.render({'token' : token}))

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

        #channel creation
        token = channel.create_channel(CHAN_ID)

        template = jinja_environment.get_template('squaredwars.play.html')
        self.response.out.write(template.render(
            {
            'message' : message,
             'token' : token, 
             'grid' : game.grid
             })
        )

#----------- GAME Creation Handler

class SWGameCreation(webapp2.RequestHandler):
    def post(self):
        game = Game()
        game.generateGrid(5, 20)
        game.put()
        gameId = game.key()
        #self.response.content_type = 'application/json'
        self.response.out.write('{"gameId" : "%s"}' % str(gameId))
