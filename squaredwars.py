import webapp2
import jinja2
import os
import json

from google.appengine.api import channel

from google.appengine.ext import db

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

CHAN_ID  = 'SW'

#----------- GAME logic and persistence

GAME_STATE_MACHINE = {
    'created' : 'in progress',
    'in progress' : 'closed'
}

class Game(db.Model):
    state = 'created'


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

class SWGameHandler(webapp2.RequestHandler):
    def get(self, gameId):
        try :
            gameIdAsAnInt = int(gameId)
            game = Game.get_by_id(gameIdAsAnInt)
            if(game != None):
                self.response.out.write("Game #%s exist : %s" % (gameId, game))
            else:
                self.response.out.write("Game doesn't exist")    
        except ValueError:
            self.response.out.write("There was an error")

class SWGameCreation(webapp2.RequestHandler):
    def post(self):
        game = Game()
        gameId = game.key()
        self.response.out.write("Game #%s has been created" % gameId)
