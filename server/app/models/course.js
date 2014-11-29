
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CourseSchema   = new Schema({
	breadth: String,
    exclusion: String,
    long_description: String,
    short_description: String,
    distribution: String,
    course_code: String,
    Department: String,
    Division: String,
    Level: String,
    session_data: [
        {
            Term: String,
            session_type: String,
            "Last updated": Date,
            session_code: String,
            Session: String,
            Campus: String
        },
    ],
    Title: String,
    prerequisite : String,
    prerequisite_codes :[String]
});

module.exports = mongoose.model('Course', CourseSchema);

