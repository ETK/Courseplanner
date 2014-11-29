from pymongo import MongoClient
import re
#log in, select db and collections
client = MongoClient('mongodb://russ:Li199310112@ds045077.mongolab.com:45077/courseplanner')
db = client['courseplanner']
courses = db['coursedata']


for course in courses.find():
	if 'prerequisite' in course:
		print course['prerequisite']


class Extractor:
	def __init__(self,prerequisite):
		self.pre = prerequisite


	def find_course_code(code):

		return 

