__author__ = 'romaintailhurat'

from google.appengine.ext import db
from logging import *

class Game(db.Model):

    state = db.StringProperty()
    player1Here = db.BooleanProperty()
    player2Here = db.BooleanProperty()
    player1Ready = db.BooleanProperty()
    player2Ready = db.BooleanProperty()

    def init(self):
        self.state = 'created'
        self.player1Here = False
    	self.player2Here = False
    	self.player1Ready = False
    	self.player2Ready = False
        log(INFO, 'One game has been initialized')

    def toJSON():
    	None
