var mongoose = require('mongoose');

var ChannelSchema = new mongoose.Schema({
	_id: {
		type: String,
		required: true,
		unique: true
	},
	desc: {
		// TODO restriction
		type: String
	},
	password: {
		// TODO mb hash
		type: String,
		required: false
	},
	admin: {
		type: String,
		ref: 'User'
	},
	participants: [{
		type: String,
		ref: 'User'
	}] 
}, {
    toJSON: {
        virtuals: true
    }
}, {
    toObject: {
        virtuals: true
    }
})

ChannelSchema.virtual('name').get(function(){
    return this._id;
});

mongoose.model('Channel', ChannelSchema);