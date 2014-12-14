// server.js

// BASE SETUP


// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var routes = require('./router')(app);
var path = require('path');
var _ = require('underscore');
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
// router.get('/', function(req, res) {
// 	res.json({ message: 'hooray! welcome to our api!' });	
// });

// more routes for our API will happen here

//OUR CODE
//=================================================================================
//connect to mongodb
var mongoose   = require('mongoose');
var Q = require("q");
mongoose.connect('mongodb://russ:Li199310112@ds045077.mongolab.com:45077/courseplanner');

//import course schema
var Course = require("./app/models/course");
var Program = require("./app/models/program");
var Requirement = require("./app/models/requirement")
var Areas = require("./app/models/areas")


router.param('programid',function(req,res,next,programid){
	Program.find({code:programid},function(err,program){
		if (err || program.length==0){
			
			next(new Error("no program found"));
		}
		//console.log(program)
		req.program = program[0];
		next();
	});
});
router.param('level',function(req,res,next,level){
	if (!isNaN(level)){
		req.level = parseInt(level);
		next();
	}else{
		next(new Error("level should be integer"));
	}

});

router.param('areaname',function(req,res,next,areaname){
	req.areaname = areaname.trim().toLowerCase();
	next();

});

router.use(function(err,req,res,next){
	res.status(500);
	res.send(err).end();

})

var Promise = function(func){
	var deferred = Q.defer();
	func(deferred.resolve,deferred.reject);
	return deferred.promise;

}


var getLevelKey = function (levels){
	var leveldb ={
		100 :["100","100/A"],
		200 :["200","200/B"],
		300 :["300","300/C"],
		400 :["400","400/D"]
	}

	var results = new Array();
	if (Array.isArray(levels)){
		levels.forEach(function(level){
			if (leveldb[level])
				results = results.concat(leveldb[level]);
		});
		//console.log(results);
		return results;
	}else{
		if (leveldb[levels])
			return leveldb[levels];
		else
			return results;
	}
	
}


var getFundCoursesForProgram = function(program){
	dep_codes = new Array();
	//create a regex selector for each department code.
	//CSC is department code, ^CSC is the regex
	if(program.department){
		program.department.forEach(function(dep){
			dep_codes.push(new RegExp("^"+dep));
		})
	}

	return Q.spread([Promise(function(resolve,reject){
		//by department

		Course.find({
			'course_code': {'$in' : dep_codes},
			'Level':{'$in':getLevelKey([100,200])},
		},Course.Project.Summary,function(err,courses){
			console.log("got course by department: "+courses+ " found");
			//console.log("got course by department: "+courses.length+ " found");
			resolve(courses);
		});
	}),
		//by program requirement
		Promise(function(resolve,reject){
			
			Requirement.aggregate(
				[{"$match" : {"program":program.code}},
				{"$unwind" : "$set"},
				{"$project" :{"level":"$set.level","rules":"$set.rules_statements"}}],
				function(err,rulesets){
					resolve(rulesets);

			});

		}).then(function(rulesets){
			
			var coursenames =  Array();
			rulesets.forEach(function(rule){
				if (rule["rules"]["includes"]==null) return;
				rule["rules"]["includes"].forEach(function(AndSet){
					 AndSet.forEach(function(courseToAdd){
					 	
					 	if (_.find(coursenames,function(course){
					 		return course.trim().toLowerCase() == courseToAdd.trim().toLowerCase();
					 	})==undefined) {
					 		coursenames.push(courseToAdd);
						}

					 });
				});

			});
			
			//console.log("got coursename from this program requirement: "+coursenames.length+" found");
			return coursenames;
		}).then(function(coursenames){
			return Promise(function(resolve,reject){
				//create a regex search for each coursename
				var coursenameRegex = Array(); 
				coursenames.forEach(function(coursename){
					coursenameRegex.push(new RegExp("^"+coursename));
				});
			
				Course.find({
					'course_code':{"$in":coursenameRegex},
				},Course.Project.Summary,function(err,courses){
					//console.log("got courses for these coursenames: "+courses.length+" found");
					resolve(courses);

				});
			});
		})],
		function(courseFromDepartment,courseFromRequirement){
			return courseFromRequirement.concat(courseFromDepartment);
	});
}


var get_area = function (program){
	dep_areas = new Array();
	//search for the all departments of certain program
	if(program.department){
		program.department.forEach(function(dep){
			dep_areas.push(dep);
		});
	};

	//creating a big Promise object returing back
	return Promise(function(resolve,reject){
		Areas.find({'area': {'$in' : dep_areas}}).exec(function(err,results){
				if(err){
					reject(new Error(error));
				}
				else{
					//find the specific areas and returing back
					specific_areas = new Array();
					//console.log(results[0].areas.name);
					results[0].areas.forEach(function(areas){
						specific_areas.push(areas.name)
					});
					resolve(specific_areas);
				}
		});
	});
}

//for advanced table
var excluded_courses = function(final_courses, ex_courses){
	return Promise(function(resolve,reject){
		var selected = _.filter(final_courses, function(a){
				//console.log(" a.course_code" + a.course_code);
			    return _.find(ex_courses, function(b){
			    	//console.log("b is " + b + " a.course_code" + a.course_code.substring(0, 6));
			        return b == a.course_code.substring(0, 6);
			    })==undefined;
		});
		//console.log(final_courses);
		resolve(selected);
	});
}

//for advanced table
var get_level_course = function(level, dep_area){
	dep_area = new RegExp("^"+dep_area);

	console.log(level + " " + dep_area);
	return Promise(function(resolve,reject){
		Course.find({
			//'course_code': {'$in': dep_area},
			'course_code':  dep_area,
			//make sure you are passing an array of string 
			'Level':{'$in': getLevelKey(level)},
		},Course.Project.Summary,function(err,courses){
			console.log("got course by department: " + courses);
			//console.log("got course by department: "+courses.length+ " found");
			resolve(courses);
		});
	});
}


//for advanced table
var get_individual_course = function(course_code){
	course_code = new RegExp("^"+course_code);

	return Promise(function(resolve,reject){
		Course.find({
			'course_code':  course_code
		},Course.Project.Summary,function(err,courses){
			//console.log("got course by department: " + courses);
			//console.log("got course by department: "+courses.length+ " found");
			resolve(courses);
		});
	});
}


var get_area_courses = function (program, area_name){
	//find the program -> area_name (calling the get_area funtion)
	//if area inside array, 
		//then print the courses, 
			//check include courses
			//call get level courses function, input level and course code
				//-> output the projection
			//delete the exclude courses
	//or give the errors

	return Promise(function(resolve,reject){
		//this is a first 
		get_area(program).then(function(areas_array){
			if(areas_array.indexOf(area_name) == -1)
			{
				// We only get here if "matching" fails
				reject("no mathing areas");
			}
		},function (error) {
			// We only get here if "get_areas" fails
			reject(new Error(error));
		});

		dep_areas = new Array();
		//search for the all departments of certain program
		if(program.department){
			program.department.forEach(function(dep){
				dep_areas.push(dep);
			});
		};

		Areas.find( { area: {'$in' : dep_areas}},
                 { areas: { $elemMatch: { name: area_name } } } ).exec(function(err,results){
				if(err){
					reject(new Error(error));
				}
				else{
					//find the specific areas and returing back
					var area_courses = new Array();
					var index = 0
					results[0].areas[0].courses.forEach(function(course_code){
						get_individual_course(course_code)
						.then(function(course_info){

							area_courses.push(course_info[0]);
							index++;
							if(results[0].areas[0].courses.length  == index){
								//resolve(area_courses); 
								if(typeof results[0].areas[0].include_level !== 'undefined' && results[0].areas[0].include_level.length > 0){
									//console.log("The levels are " + results[0].areas[0].include_level + " The program are " + results[0].areas[0].name.substr(0, results[0].areas[0].name.indexOf(' ')));
									get_level_course(results[0].areas[0].include_level, results[0].areas[0].name.substr(0, results[0].areas[0].name.indexOf(' ')))
									.then(function(courses){
										var final_courses = courses.concat(area_courses);
										if(typeof results[0].areas[0].excludes !== 'undefined' && results[0].areas[0].excludes.length > 0){
											excluded_courses(final_courses, results[0].areas[0].excludes)
											.then(function(courses){
												resolve(courses);
											},function (error) {
												// We only get here if "foo" fails
												reject(new Error(error));
											}).done();
										}
										else{
											resolve(final_courses);
										}
										//if delete coures is empty -> return
										//if not, delete the value and then return -> write one more delete function 
									},function (error) {
										reject(new Error(error));
									}).done();
									//call get all the level courses
									//and then delete exclude courses
								}
							}
						},function (error) {
							// We only get here if "foo" fails
							reject(new Error(error));
						});	
					});
					
				}
		});
		//adding the courses in the given areas
	});

	
}



router.route('/program/:programid/fundcourses')
	//
	.get(function(req,res){
		
		//get all courses from department

		getFundCoursesForProgram(req.program)
		.then(function(courses){
			res.json(courses);

		}).done();
	});

router.route('/program/:programid/fundcourses/areanames')
	//
	.get(function(req,res){
		//get all courses for this program
		getFundCoursesForProgram(req.program)
		.then(function(courses){
			 var areas = _.uniq(courses,function(course){
		        return course["course_code"].substr(0,3);
		     }).map(function(course){return course["course_code"].substr(0,3)});
		     res.json(areas);

		}).done();
	});

router.route('/program/:programid/fundcourses/areanames/:areaname/levels')
	//
	.get(function(req,res){
		//get all courses for this program

		getFundCoursesForProgram(req.program)
		.then(function(courses){
			var levels = _.uniq(courses.filter(function(course){
					        return course["course_code"].substr(0,3) == req.params.areaname;
					    }),function(course){return course["Level"]})
					    .map(function(course){return course["Level"]});
			res.json(levels);

		}).done();
	});


router.route('/program/:programid/fundcourses/areanames/:areaname/levels/:level/courses')
	//
	.get(function(req,res){
		//get all courses for this program

		getFundCoursesForProgram(req.program)
		.then(function(courses){
			 var courses = courses.filter(function(course){
		          return (course["course_code"].substr(0,3).toLowerCase() ==req.areaname)
		          && (_.find(getLevelKey(req.level),function(level){
		          		return level == course["Level"];
		          	})!=undefined);
		      });
			res.json(courses);
		}).done();
	});


router.route("/course")
.get(function(req,res){
	Course.find(function(err,data){
		if (err)
				res.send(err);
		res.json(data);
	});

}).post(function(req, res) {	
	var course = new Course(); 		// create a new instance of the Bear model
	course.course_code = req.body.code;  // set the bears name (comes from the request)

	// save the bear and check for errors
	course.save(function(err) {
		if (err)
			res.send(err);

		res.json({ message: 'Course created!' });
	});
	
});



///programs/:programid/areacourses/areanames
//[name:string]
router.route('/program/:programid/areacourses/areanames')
.get(function(req,res){	
	//get all areas from department
	get_area(req.program)
	.then(function(courses){
		res.json(courses);
	}).done();
});


///program/:programid/areacourses/areanames/:area_name/courses?all = true
//[course]
router.route('/program/:programid/areacourses/areanames/:area_name/courses')
.get(function(req,res){	
	//get all areas courses from department
	get_area_courses(req.program, req.params.area_name)
	.then(function(courses){
		res.json(courses);
	},function (error) {
		// We only get here if "foo" fails
		res.json(error);
	}).done();
});

//==================================================================== testing area
router.route('/program/1')
.get(function(req,res){	
	//get all areas courses from department
	get_level_course(100, 'CSC')
	.then(function(courses){
		res.json(courses);
	},function (error) {
		// We only get here if "foo" fails
		res.json(error);
	}).done();
});


//get_individual_course
router.route('/program/2')
.get(function(req,res){	
	var list = new Array();
	var index = 0;
	var courses = ["CSC310",
                "CSC320",
                "CSC321",
                "CSC384",
                "CSC401",
                "CSC411",
                "CSC412",
                "CSC420",
                "CSC438",
                "CSC448",
                "CSC463",
                "CSC485",
                "CSC486"];

     var promises = Array();
    courses.forEach(function(result){
    console.log("Outer" + index);
    	//get all areas courses from department
		get_individual_course(result)
		.then(function(info){
			//console.log( courses.length + " inner " + index);
			list.push(info);
			index++;
			if(courses.length  == index){
				res.json(list);
			}	
		},function (error) {
			// We only get here if "foo" fails
			res.json(error);
		});
		
    });
});


router.route('/program/3')
.get(function(req,res){	


var final_courses = [
    {
        "_id": "53c5b145bf1ee3a1f232f340",
        "Level": "300/C",
        "Title": "STA302H1: Methods of Data Analysis I",
        "course_code": "STA302H1",
        "prerequisite": "STA248H1/STA255H1/STA261H1/ECO220Y1(70%)/ECO227Y1"
    },
    {
        "_id": "53c5b145bf1ee3a1f232f342",
        "Level": "300/C",
        "Title": "STA304H1: Surveys, Sampling and Observational Data (formerly STA322H1)",
        "course_code": "STA304H1",
        "prerequisite": "ECO220Y1/ECO227Y1/GGR270H1/PSY201H1/SOC300Y1/STA220H1/STA255H1/STA261H1(cr s_sta.htm#STA261H1)/STA248H1/EEB225H1"
    },
    {
        "_id": "53c5b145bf1ee3a1f232f344",
        "Level": "300/C",
        "Title": "STA347H1: Probability",
        "course_code": "STA347H1",
        "prerequisite": "STA247H1/STA255H1/STA257H1/ECO227;MAT223H1/MAT240H1; MAT235Y1/MAT237Y1/MAT257Y1 (Note: STA257H1 and MAT237Y1/MAT257Y1;(MAT223H1,MAT224H1)/MAT240H1 are very strongly recommended)"
    },
    {
        "_id": "53c5b145bf1ee3a1f232f350",
        "Level": "400/D",
        "Title": "STA457H1: Time Series Analysis",
        "course_code": "STA457H1",
        "prerequisite": "CO375H1/STA302H1; MAT235Y1/MAT237Y1/MAT257Y1"
    },
    {
        "_id": "53c5b145bf1ee3a1f232f351",
        "Level": "400/D",
        "Title": "STA490Y1: Statistical Consultation, Communication, and Collaboration (formerlySTA490H1)",
        "course_code": "STA490Y1",
        "prerequisite": "STA303H1"
    },
    {
        "_id": "53c5b145bf1ee3a1f232f353",
        "course_code": "STA497H1",
        "Level": "400/D",
        "Title": "STA497H1: Readings in Statistics"
    },
    {
        "_id": "53c5b145bf1ee3a1f232f354",
        "course_code": "STA498Y1",
        "Level": "400/D",
        "Title": "STA498Y1: Readings in Statistics"
    },
    {
        "_id": "53c5b145bf1ee3a1f232f355",
        "course_code": "STA499Y1",
        "Level": "400/D",
        "Title": "STA499Y1: Readings in Statistics"
    },
    {
        "_id": "53c5b145bf1ee3a1f232f0fe",
        "Level": "400/D",
        "course_code": "STA465H1",
        "prerequisite": "STA302H1"
    },
    {
        "_id": "53c5b145bf1ee3a1f232f33f",
        "Level": "200/B",
        "Title": "STA261H1: Probability and Statistics II",
        "course_code": "STA261H1",
        "prerequisite": "STA257H1"
    }
];

var ex_courses = [
                "STA261", 
                "STA465", 
            ];

	//get all areas courses from department
	excluded_courses(final_courses, ex_courses)
	.then(function(courses){
		res.json(courses);
	},function (error) {
		// We only get here if "foo" fails
		res.json(error);
	}).done();
});

//==================================================================== testing area


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
//app.post('/api', routes.message);


// app.get('/1', function(req, res) {
// 	  	res.json('working');
// });



// app.use('/api', router);

// app.get('/1', function(req, res) {
// 	  	res.render('contact.ejs');
// 	});
 app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);














