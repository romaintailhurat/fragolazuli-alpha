#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
import jinja2
import os
import logging

from squaredwars import SWMainHandler, SWGameHandler, SWGameCreation
from crystalwars.cw import CWHandler, CWGameHandler

#see https://developers.google.com/appengine/docs/python/gettingstartedpython27/templates
jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

class MainHandler(webapp2.RequestHandler):
    def get(self):
    	template = jinja_environment.get_template('index.html')
        self.response.out.write(template.render({}))


handlers = [('/', MainHandler),
			('/squaredwars',SWMainHandler), #hmm, on doit pouvoir faire mieux =/
			('/squaredwars/',SWMainHandler),
			('/squaredwars/play',SWGameHandler),
			('/squaredwars/create',SWGameCreation),

			('/crystalwars',CWHandler),
			('/crystalwars/',CWHandler),
			('/crystalwars/game',CWGameHandler),
			('/crystalwars/game/',CWGameHandler),
			('/crystalwars/game/(\d+)',CWGameHandler)]

logging.getLogger().setLevel(logging.DEBUG)

app = webapp2.WSGIApplication(handlers, debug=True)
