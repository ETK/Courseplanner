
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AndPair  = new Schema({

    "andpair" :[String]
})

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
                "include_level": [String]
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


