const mongoose = require('mongoose')

var schema = new mongoose.model({
    owner: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    package: {
        type: [String],
        required: true
    }
})

module.exports = mongoose.model('Note', schema);