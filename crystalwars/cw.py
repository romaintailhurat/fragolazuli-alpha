# coding=utf-8
__author__ = 'romaintailhurat'

import webapp2
import jinja2
from logging import *

import models

getLogger('cw').setLevel(DEBUG)

ROOT = '/crystalwars'

class CWHandler(webapp2.RequestHandler):
    """
    map to '/'
    """

    def get(self):
        log(INFO, 'test de log')
        self.response.out.write('welcome to crystalwars!')

class CWGameHandler(webapp2.RequestHandler):
    """
    map to '/game'
    """

    def get(self, gameId):
        game = models.Game.get_by_id(int(gameId))
        self.response.out.write(game.state)

    def post(self):
        game = models.Game()
        game.init()
        game.put()
        self.response.out.write('game created with id %s' %str(game.key().id()))
