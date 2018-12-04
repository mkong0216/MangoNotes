const mongoose = require('mongoose')

let SettingSchema = new mongoose.Schema({
    username: { type: String, required: true },
    options: { type: String, required: true }
})

module.exports = mongoose.model('Settings', SettingSchema)
