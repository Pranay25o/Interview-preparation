const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref: 'user'},
    experience:{type:String},
    role:{type:String,required: true},
    topicsToFocus:{type:String, required: true},
    description:{type:String},
    questions:[{type:mongoose.Schema.Types.ObjectId, ref: 'question'}],
},{timestamps: true});  

module.exports = mongoose.model('session', sessionSchema);  