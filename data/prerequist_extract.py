from pymongo import MongoClient
import re

class Extractor:
	def __init__(self,prerequisite):
		self.pre = prerequisite


	def toCourseCodeArray(self):
		courseCode=[]
		for pre in re.finditer("\D\D\D\d\d\d(\D\d)?",self.pre,0):
			courseCode.append(pre.group(0))
		return courseCode

	




#log in, select db and collections
client = MongoClient('mongodb://russ:Li199310112@ds045077.mongolab.com:45077/courseplanner')
db = client['courseplanner']
courses = db['courses']

#from prerequisite, for each course code found in prerequisite string, output to an array
#and put in prerequiste_codes
'''for course in courses.find():
	if 'prerequisite' in course:
		ex = Extractor(course['prerequisite'])
		preCourseCode = ex.toCourseCodeArray()
		course["prerequisite_codes"] = preCourseCode
		courses.update({"_id":course["_id"]},course,True)
	'''	


#read out prerequisite_codes
for course in courses.find():
		if 'prerequisite' in course:
			print course['prerequisite']
		#	print course['prerequisite_codes']

'''for course in courses.find():
	if re.match("\D\D\D\D",course['course_code']) != None:
		print course
'''

#rename collection to Courses
#courses.rename("courses")


