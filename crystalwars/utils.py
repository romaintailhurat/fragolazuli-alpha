# UTILS babe !

from random import randint, uniform

from logging import *

import unittest

def generateGrid(N,M):
	"""
	Generate a random grid of N x M
	"""
	grid = []

	types = {'Land' : 70, 'Rock': 25, 'Resource' : 5}

	maxNexus = 2

	for i in range(N):

		# add a row in grid
		grid.append([])

		for j in range(M):
			type = weightedChoice(types)

			# add a type in current row
			grid[i].append(type)

	nexus1Position = chooseRandomPosition(N, M)
	nexus2Position = chooseRandomPosition(N, M)

	grid [nexus1Position[0]] [nexus1Position[1]] = 'NexusP1'
	grid [nexus2Position[0]] [nexus2Position[1]] = 'NexusP2'

	return grid

def chooseType(listOfTypes):
	"""
	Return a type of tile chosen from a given list of tile types
	"""
	maxIndex = len(listOfTypes) - 1
	randomIndex = randint(0, maxIndex)
	return listOfTypes[randomIndex]

def chooseRandomPosition(N, M):
	"""
	Return a random position [n,m] on a N x M grid
	"""
	n = randint(0, N - 1)
	m = randint(0, M - 1)
	return [n,m]

def weightedChoice(choices):
	"""
	http://stackoverflow.com/questions/3679694/a-weighted-version-of-random-choice
	adapted with '.items()'' method
	"""
	total = sum(w for c, w in choices.items())
	r = uniform(0, total)
	upto = 0

	for c, w in choices.items():
		if upto + w > r:
			return c
		upto += w

def disco_nexus(grid, *args, **kwargs):
	"""
	Return the results of the operation
	"""
	# FIXME instead of a tuple, we could use a OperationResults object ?
	log(INFO, 'Executing disco_nexus operation')
	isOk = True
	messageToOtherPlayer = 'Un de vos Nexus a ete decouvert.'
	return (isOk, messageToOtherPlayer)

def destroy_nexus(grid, *args, **kwargs):

	# FIXME write a good condition...
	#if kwargs['x'] or kwargs['y'] is None:
	#	raise Exception('Missing x or y arguments')

	x = kwargs['x']
	y = kwargs['y']

	log(INFO, 'Executing destroy_nexus operation in position %s - %s' %(x, y))

	# FIXME add logic !
	#if grid[x][y] == 'NexusP1' or grid[x][y] == 'NexusP2':
	#	grid[x][y] == 'Land'

	isOk = True
	messageToOtherPlayer = 'Un de vos Nexus a ete detruit.'

	return(isOk, messageToOtherPlayer)


def create_nexus(grid, *args, **kwargs):
	x = kwargs['x']
	y = kwargs['y']

	log(INFO, 'Executing create_nexus operation in position %s - %s' %(x, y))

	# FIXME add logic !

	isOk = True
	messageToOtherPlayer = 'Un Nexus adverse a ete cree'

	return(isOk, messageToOtherPlayer)

####################
# TESTS

class UtilsTests(unittest.TestCase):

	def test_chooseRandomPosition(self):
		n = 20
		m = 20
		positionArray = chooseRandomPosition(n,m)
		print(positionArray)
		self.assertTrue(0 <= positionArray[0] <= n and 0 <= positionArray[0] <= m)

	def test_weightedChoice(self):
		c = weightedChoice( {'Land' : 50, 'Rock': 40, 'Resource' : 10} )
		print( c )
		self.assertTrue(True)

	def test_kwargs(self):
		self.f('yo', test='super')


	def f(say, *args, **kwargs):
		print ('%s!' %kwargs['test'] )

if __name__ == '__main__':
	unittest.main()
