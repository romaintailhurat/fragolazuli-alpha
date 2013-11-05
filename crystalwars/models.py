__author__ = 'romaintailhurat'

from google.appengine.ext import db

class Game(db.Model):

    state = db.StringProperty()

    def init(self):
        self.state = 'created'
