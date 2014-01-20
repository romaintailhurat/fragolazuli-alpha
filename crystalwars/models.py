__author__ = 'romaintailhurat'

from google.appengine.ext import db
from logging import *

import utils
import pickle

#See http://stackoverflow.com/questions/2028355/datastore-list-of-lists
class GridProperty(db.Property):

    data_type = list

    def get_value_for_datastore(self, model_instance):
        return db.Blob(pickle.dumps(getattr(model_instance,self.name)))

    def make_value_from_datastore(self, value):
        return pickle.loads(value)

    def validate(self, value):
        return value

    def empty(self, value):
        return not value

class Game(db.Model):

    # TODO we need a field for the grid !

    state = db.StringProperty()
    grid = GridProperty()
    player1Here = db.BooleanProperty()
    player2Here = db.BooleanProperty()
    player1Ready = db.BooleanProperty()
    player2Ready = db.BooleanProperty()

    def init(self):
        self.state = 'created'
        self.grid = utils.generateGrid(20, 20)
        self.player1Here = False
    	self.player2Here = False
    	self.player1Ready = False
    	self.player2Ready = False
        log(INFO, 'One game has been initialized')

    def toJSON():
    	None
