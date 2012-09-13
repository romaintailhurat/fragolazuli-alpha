import webapp2
import jinja2
import os
import json

from google.appengine.api import channel

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

CHAN_ID  = 'SW'

class SquaredWarsHandler(webapp2.RequestHandler):
    def get(self):
    	token = channel.create_channel(CHAN_ID)
    	template = jinja_environment.get_template('squaredwars.html')
        self.response.out.write(template.render({'token' : token}))

    def post(self):
		message = self.request.get('m')
		jsonMessage = json.JSONDecoder().decode(message)
		#TODO : how to log to the gae log ?
		channel.send_message(CHAN_ID, jsonMessage)


handlers = [('/', SquaredWarsHandler)]

app = webapp2.WSGIApplication(handlers, debug=True)