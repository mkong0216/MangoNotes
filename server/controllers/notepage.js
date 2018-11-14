const Notepage = require('../models/Notepage')

exports.CreateNotepage = function (req, res) {
  const username = req.params.username

  const handleSaveNotepage = function (error, notepage) {
    if (error) {
      console.log(error)
      res.status(500).send("Error creating new notepage in database.")
    } else {
      res.status(200).json({
        id: notepage._id,
        title: notepage.title,
        timestamp: notepage.timestamp
      })
    }
  }

  if (username) {
    const newNotepage = new Notepage(req.body)
    newNotepage.save(handleSaveNotepage)
  } else {
    res.status(400).send("Notepage does not have a creator")
  }
}