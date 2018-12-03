const Settings = require('../models/Settings')
const defaultSettings = require('../data/default_settings.json')

exports.GetUserSettings = function (req, res){
    const username = req.params.username
  
    if (!username) {
      res.status(401).send("Failed to provide a username")
    }
  
    const handleFindUserSettings = function (err, settings){
      if (err) {
        console.log(err)
        res.status(500).send("Problem occurred when getting user setting!");
      } else if (!settings) {
        res.status(200).json(defaultSettings)
      } else {
        res.status(200).json(settings);
      }
    }
  
    Settings.findOne({ username: username }, handleFindUserSettings);
  }
  
exports.UpdateUserSettings = function (req, res) {
  const username = req.params.username

  if (!username) {
    res.status(401).send("Failed to provide a username")
  }

  const handleUpdateSettings = function (err, settings) {
    if (err) {
      res.status(500).send("Problem occurred when updating user settings!");
    } else {
      res.status(200).send("User settings has been updated");
    }
  }

  Settings.findOneAndUpdate({ username: username }, { $set: { option: req.body.option } }, handleUpdateSettings);
}