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
        res.status(200).json({ settings: defaultSettings, default: true })
      } else {
        res.status(200).json({ settings: settings.options, default: false });
      }
    }
  
    Settings.findOne({ username: username }, handleFindUserSettings);
  }
  
exports.UpdateUserSettings = function (req, res) {
  const username = req.params.username
  const userSettings = req.body.userSettings

  if (!username) {
    res.status(401).send("Failed to provide a username")
  }

  const handleSaveSettings = function (err, settings) {
    if (err) {
      console.log(err)
      res.status(500).send("Error occurred when saving user's settings")
    } else {
      res.sendStatus(200)
    }
  }

  const handleFindSettings = function (err, settings) {
    if (err) {
      console.log(err)
      res.status(500).send("Problem occurred when trying to find user's settings")
    } else if (!settings) {
      const newSettings = new Settings({ username: username, options: userSettings })
      newSettings.save(handleSaveSettings)
    } else {
      settings.options = userSettings
      settings.save(handleSaveSettings)
    }
  }

  Settings.findOne({ username: username }, handleFindSettings)
}