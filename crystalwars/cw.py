# coding=utf-8
__author__ = 'romaintailhurat'

import webapp2
import jinja2
import os
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
        game = models.Game.get_by_id(int(gameId))
        self.response.out.write(game.state)

    def post(self):
        game = models.Game()
        game.init()
        game.put()
        self.response.out.write('game created with id %s' %str(game.key().id()))
