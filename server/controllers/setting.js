const {Setting} = require('../models/Setting')

exports.GetUserSetting = function(req, res){
    const username = req.params.username
  
    if (!username) {
      res.status(401).send("Failed to provide a username")
    }
  
    const handleFindUserSetting = function (err, setting){
      if (err) {
        console.log(err)
        res.status(500).send("Problem occurred when getting user setting!");
      } else if (!setting) {
        res.status(200).json(defaultSettings)
      } else {
        res.status(200).json(setting);
      }
    }
  
    Setting.findOne({ username: username }, handleFindUserSetting);
  }
  
  exports.UpdateUserSetting = function(req, res){
    //use callback to modify setting
    function updateOption(err, result){
      if(err){
        res.status(500).send("Problem occurred when updating user setting!");
      }
      else{
        res.status(200).send("User setting has been updated");
      }
    }
    Setting.findOneAndUpdate({username: req.body.username},{$set: {option: req.body.option}}, updateOption);
  }