
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ProgramSchema   = new Schema({
	code:String,
    title:String,
    department:[String],
    type:String

    
});

module.exports = mongoose.model('Program', ProgramSchema);

