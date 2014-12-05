// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var routes = require('./router')(app);


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; 		// set our port

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

router.param('programid',function(req,res,next,programid){
	Program.find({code:programid},function(err,program){
		if (err || program.length==0){
			
			next(new Error("no program found"));
		}
		console.log(program)
		req.program = program[0];
		next();
	});


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

	levels.forEach(function(level){
		if (leveldb[level])
			results = results.concat(leveldb[level]);
	})
	console.log(results);
	return results

}
var getFundCoursesForProgram = function(program){


	dep_codes = new Array();
	
	if(program.department){
		program.department.forEach(function(dep){
			dep_codes.push(new RegExp("^"+dep));
		})
	}

	return Promise(function(resolve,reject){
		Course.find({
			'course_code': {'$in' : dep_codes},
			'Level':{'$in':getLevelKey([100,200])},
		},function(err,courses){
			resolve(courses);
		});
	});
	/*Promise(function(resolve,reject){
		Requirement.find({
			"program": program.code,


		})


	})

	]);*/

}


router.route('/program/:programid/fundcourses')
	//
	.get(function(req,res){
		
		//get all courses from department

		getFundCoursesForProgram(req.program)
		.then(function(courses){
			res.json(courses);

		})


        /*
		Course.aggregate([
				{$project:{

					dep:{$substr:["$course_code",0,3]}
				}},
				{$group:{
					_id:"$dep"
				}}
			],
			function(err,deps){
				deps_array = new Array();
				deps.forEach(function(dep){
					if(dep._id=="") return;
					deps_array.push(dep._id);
				});
				res.json(deps_array);
			}
		);*/
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








// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
//app.post('/api', routes.message);

// app.get('/1', function(req, res) {
// 	  	res.render('contact.ejs');
// 	});
 app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);














