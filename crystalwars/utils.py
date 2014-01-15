# UTILS babe !

from random import randint

import unittest

def generateGrid(N,M):
	"""
	"""
	grid = []

	types = ['Land', 'Rock']

	maxNexus = 2

	for i in range(N):
		
		# add a row in grid
		grid.append([])

		for j in range(M):

			if maxNexus > 0:
				type = chooseType(types)
			else:
				typesWithoutNexus = filter(lambda item : item != 'Nexus',types)
				type = chooseType( typesWithoutNexus )

			if type == 'Nexus' : maxNexus -= 1

			# add a type in current row
			grid[i].append(type)

	nexus1Position = chooseRandomPosition(N, M)
	nexus2Position = chooseRandomPosition(N, M)

	grid [nexus1Position[0]] [nexus1Position[1]] = 'Nexus'
	grid [nexus2Position[0]] [nexus2Position[1]] = 'Nexus'

	return grid

def chooseType(listOfTypes):
	"""
	Return a type chosen from 
	"""
	maxIndex = len(listOfTypes) - 1
	randomIndex = randint(0, maxIndex)
	return listOfTypes[randomIndex]

def chooseRandomPosition(N, M):
	n = randint(0, N - 1)
	m = randint(0, M - 1)
	return [n,m]



# TESTS

class UtilsTests(unittest.TestCase):

	def test_chooseRandomPosition(self):
		n = 20
		m = 20
		positionArray = chooseRandomPosition(n,m)
		print(positionArray)
		self.assertTrue(0 <= positionArray[0] <= n and 0 <= positionArray[0] <= m)

if __name__ == '__main__':
	unittest.main()
