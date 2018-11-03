const mongoose = require('mongoose')

var NotePageSchema = new mongoose.model({
    creator: {
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

module.exports = mongoose.model('NotePage', NotePageSchema);