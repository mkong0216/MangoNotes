const mongoose = require('mongoose')

let SettingSchema = new mongoose.Schema({
    username: {type: String, required: true},
    option: {type: String, required: true},
    modified: {type: Boolean, default: false}
})

module.exports = {
    Setting: mongoose.model('Setting', SettingSchema)
}