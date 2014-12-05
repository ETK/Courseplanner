from pymongo import MongoClient
import json


#log in, select db and collections
client = MongoClient('mongodb://russ:Li199310112@ds045077.mongolab.com:45077/courseplanner')
db = client['courseplanner']

collectionName = raw_input("enter collection name:  ")

col = db[collectionName]

fileName = raw_input("enter json file name:  ")
	
with open(fileName) as json_file:
	data = json.load(json_file)
	if isinstance(data,list):
		col.remove()
		for d in data:
			col.save(d)
	else:
		print "json data not array"


