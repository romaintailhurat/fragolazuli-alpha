# coding=utf-8
__author__ = 'romaintailhurat'

import webapp2
import jinja2
from logging import *

getLogger('cw').setLevel(DEBUG)

ROOT = '/crystalwars'

class CWHandler(webapp2.RequestHandler):

    def get(self):
        log(INFO, 'test de log')
        self.response.out.write('welcome to crystalwars!')

class CWGameHandler(webapp2.RequestHandler):

    def get(self, gameId):
        self.response.out.write(gameId)