// server.js

// BASE SETUP


// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var routes = require('./router')(app);
var path = require('path');

app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));


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
mongoose.connect('mongodb://russ:Li199310112@ds045077.mongolab.com:45077/courseplanner');

//import course schema
var Course = require("./app/models/course")

router.route('/areas')
	//
	.get(function(req,res){
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
		);
	});

router.route('/areas')

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














