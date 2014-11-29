

module.exports = function(){

	var functions = {};//contains the functions to be exported


	functions.message = function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });	
	};

	return functions;
};