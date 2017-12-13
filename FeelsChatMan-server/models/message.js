var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var mongoosePaginate = require('mongoose-paginate');

var MessageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    date: {
        type: String
    },
    sender: {
        type: String,
        ref: 'User'
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
})

MessageSchema.plugin(mongoosePaginate);
MessageSchema.plugin(autoIncrement.plugin, 'Message');
mongoose.model('Message', MessageSchema);