from pymongo import MongoClient
import re

class Extractor:
	def __init__(self,prerequisite):
		self.pre = prerequisite


	def toCourseCodeArray(self):
		courseCode=[]
		for pre in re.finditer("\w\w\w\d\d\d(\w\d)?",self.pre,0):
			courseCode.append(pre.group(0))
		return courseCode

	




#log in, select db and collections
client = MongoClient('mongodb://russ:Li199310112@ds045077.mongolab.com:45077/courseplanner')
db = client['courseplanner']
courses = db['coursedata']

#from prerequisite, for each course code found in prerequisite string, output to an array
#and put in prerequiste_codes
'''for course in courses.find():
	if 'prerequisite' in course:
		ex = Extractor(course['prerequisite'])
		preCourseCode = ex.toCourseCodeArray()
		courses.update({"_id":course["_id"]},{"prerequisite_codes":preCourseCode},True)
'''

#read out prerequisite_codes
for course in courses.find():
		if 'prerequisite_codes' in course:
			print course
			


