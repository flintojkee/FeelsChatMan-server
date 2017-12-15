var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var mongoosePaginate = require('mongoose-paginate');

var MessageSchema = new mongoose.Schema({
    msg: {
        type: String,
        required: true
    },
    date: {
        type: String
    },
    username: {
        type: String,
        ref: 'User'
    },
    colour: {
        type: String
    },
    channel: {
        type: String,
        ref: 'Channel'
    },
    pinned: {
        type: Boolean,
        required: false,
        default: false
    }
}, {
    toJSON: {
        virtuals: true
    }
}, {
    toObject: {
        virtuals: true
    }
}, {
    usePushEach: true
})

MessageSchema.plugin(mongoosePaginate);
MessageSchema.plugin(autoIncrement.plugin, 'Message');
mongoose.model('Message', MessageSchema);