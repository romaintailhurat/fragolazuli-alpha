# coding=utf-8
__author__ = 'romaintailhurat'

import webapp2
import jinja2
import os
import json

from google.appengine.api import channel

from logging import *

import models

getLogger('cw').setLevel(DEBUG)


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
        template = jinja_environment.get_template('cw.game.html')
        token = channel.create_channel(gameId)
        self.response.out.write(template.render({
            'id' : game.key().id(), # can't use gameId, makes it buggy
            'token' : token
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
        Game modification
        """
        channel.send_message(gameId,'the game was modified')
        self.response.out.write(json.dumps({'m' : 'PUT on a game'}))

    def delete(self, gameId):
        """
        Delete a game
        """
        self.response.out.write(json.dumps({'m' : 'DELETE on a game'}))
