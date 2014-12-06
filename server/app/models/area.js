
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AreaSchema = new Schema(
{
    "area":  String,
    "areas": [{
            "name": String,
            "courses": [String],
				 "include_level": [String],
            "excludes": [String]
        }]
});

module.exports = mongoose.model('Area', AreaSchema);


