# coding=utf-8
__author__ = 'romaintailhurat'

import webapp2
import jinja2
import os
import json

from google.appengine.api import channel

from logging import *

import models
import utils

# LOGGER
getLogger('cw').setLevel(DEBUG)

# CONSTS
# FIXME extract the constant
OPERATION_LIST = ['disco_nexus', 'destroy_nexus', 'create_nexus']

# Setup env to retrieve templates
jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))


class CWHandler(webapp2.RequestHandler):
    """
    map to '/'
    """

    def get(self):
        log(INFO, 'test de log')
        template = jinja_environment.get_template('cw.html')
        self.response.out.write(template.render({}))

class CWGameHandler(webapp2.RequestHandler):
    """
    map to '/game'
    """

    def get(self, gameId):
        """
        Display game each player
        """
        game = models.Game.get_by_id(int(gameId))
        player = ''
        token = ''
        template = jinja_environment.get_template('cw.game.html')

        if game.player1Here == False:
            log(INFO, 'Player1 connection ; channel creation')
            game.player1Here = True
            game.put()
            player = 'player1'
            token = channel.create_channel(gameId + 'player1')
        elif game.player2Here == False:
            log(INFO, 'Player2 connection ; channel creation')
            game.player2Here = True
            game.put()
            player = 'player2'
            token = channel.create_channel(gameId + 'player2')
        else:
            log(ERROR, 'There are already two players !')
            raise Exception()

        self.response.out.write(template.render({
            'id' : game.key().id(), # can't use gameId, makes it buggy
            'token' : token,
            'player' : player,
            'grid' : json.dumps(game.grid)
            }))

    def post(self):
        """
        Game creation
        """
        game = models.Game()
        game.init()
        game.put()
        message = 'game created with id %s' %str(game.key().id())
        self.response.out.write(json.dumps({'m': message }))

    def put(self, gameId):
        """
        Game modification.
        Every change in the elements of the game must be communicated / validated here,
        and propagated to the other player
        """
        # The game
        game = models.Game.get_by_id(int(gameId))

        # Request params
        sender = self.request.get('sender')
        receiver = ''
        operation = self.request.get('operation')
        position = self.request.get('position')
        positionX, positionY = position.split(',')

        log(INFO, 'PUT send by %s for operation %s and position %s - %s' %(sender, operation, str(positionX),str(positionY)))

        # Using python introspection with getattr()
        # ex : 'create_nexus' string is passed to getattr(<module or class>,'create_nexus')()
        if (operation in OPERATION_LIST) :
            operationResults = getattr(utils, operation)(game.grid, x=positionX, y=positionY)
            # FIXME Game.put ???

        messageToOtherPlayer = operationResults[1]

        log(INFO, 'The message to the other player is : %s' %messageToOtherPlayer)

        # Decide which player must receive an update
        if (sender == 'player1'):
            receiver = 'player2'
        elif (sender == 'player2'):
            receiver = 'player1'

        # message send to the other player, a.k.a the receiver
        # if operation is ok
        if (operationResults[0]):
            channel.send_message(gameId + receiver, json.dumps({'operation' : operation, 'x' : positionX, 'y' : positionY}))

        # response to the PUT request
        self.response.out.write( json.dumps({
            'isOk' : operationResults[0],
            'message' : '%s is okay' %operation
            }) )

    def delete(self, gameId):
        """
        Delete a game
        """
        self.response.out.write(json.dumps({'m' : 'DELETE on a game'}))

###
# MOCK HANDLER
###
class CWMockGameHandler(webapp2.RequestHandler):
    """
    map to /mockgame/
    Used for UI testing purpose
    """

    def get(self):
        token = channel.create_channel('mockgame')
        template = jinja_environment.get_template('cw.game.html')
        grid = utils.generateGrid(20, 20)

        self.response.out.write(template.render({
            'id' : '123456', # can't use gameId, makes it buggy
            'token' : token,
            'player' : 'player1',
            'grid' : json.dumps(grid)
            }))
