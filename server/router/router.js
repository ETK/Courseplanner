var UserSchema = require('../schemas/user');
var PostsSchema = require('../schemas/posts');
var ContactSchema = require('../schemas/contact');
var ReportSchema = require('../schemas/report');

module.exports = function(){

	var functions = {};//contains the functions to be exported

	functions.logout = function(req, res) {
	//this function simply removes the login session and renders the homepage
		req.logout();
		res.render('index.ejs');
		
	};
	functions.message = function('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });	
	});

	return functions;
};