
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AndPair  = new Schema([String])

var RuleSchema = new Schema({   
            "level": String,
            "FCE": Number,
            "rules": [
                {
                    "department":String,
                    "rule":String 
                }
            ],
            "rules_statements": {
                "includes": [
                        AndPair
                    
                ]
                ,
                "excludes": [String],
                "include_level": [{
                    "department" :String,
                    "level":Number
                }]
            }
        });

var RequirementSchema   = new Schema(
{
    "program": String,
    "set":  [
        RuleSchema    
    ]
});

module.exports = mongoose.model('Requirement', RequirementSchema);


