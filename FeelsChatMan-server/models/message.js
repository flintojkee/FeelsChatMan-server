var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var MessageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
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

MessageSchema.plugin(autoIncrement.plugin, 'Message');
mongoose.model('Message', MessageSchema);