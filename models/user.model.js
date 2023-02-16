const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {type: String, minLenth: 3, trim: true},
    email: {
        type: String,
        trim: true, 
        required: true, 
        unique: true, 
        validate: {
            validator: function(v) {
              return /\S+@\S+\.\S+/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
          }
        },
    referralCode: {type: String, unique: true},
    referredBy: {type: String},
    referredUsers: [{type: String}]
});

const User = mongoose.model('User', userSchema);
module.exports = User