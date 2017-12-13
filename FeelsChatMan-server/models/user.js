var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var uniqueValidator = require('mongoose-unique-validator');

var UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    colour: {
        type: String,
        enum: ['Blue', 'Coral', 'DodgerBlue', 'SpringGreen', 'YellowGreen', 'Green', 'OrangeRed', 'Red', 'GoldenRod', 'HotPink', 'CadetBlue', 'SeaGreen', 'Chocolate', 'BlueViolet', 'Firebrick']
    },
    channels: [{
        type: String,
        ref: 'Channel'
    }]
}, {
    toJSON: {
        virtuals: true
    }
}, {
    toObject: {
        virtuals: true
    }
});


UserSchema.virtual('username').get(function() {
    return this._id;
});


UserSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        })
    })
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

//UserSchema.plugin(uniqueValidator);
mongoose.model('User', UserSchema);