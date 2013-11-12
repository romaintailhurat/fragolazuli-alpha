__author__ = 'romaintailhurat'

from google.appengine.ext import db

class Game(db.Model):

    state = db.StringProperty()
    player1Ready = False
    player2Ready = False

    def init(self):
        self.state = 'created'

    def toJSON():
    	None
