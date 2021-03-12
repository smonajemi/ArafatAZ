const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName:{
        type:String
    },
    lastName: {
        type:String
    },
    password:{
        type:String
    }
}, {timestamps: true});

const User = mongoose.model('User',userSchema);
module.exports = User;