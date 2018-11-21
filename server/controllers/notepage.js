const Notepage = require('../models/Notepage')
const Notebook = require('../models/Notebook')

exports.CreateNotepage = function (req, res) {
  const userId = req.body.creator
  let details = { ...req.body, type: 'notepage' }

  if (!userId) {
    res.status(401).send("Failed to provide a userId")
  }

  const handleUpdateNotebook = function (error, parentNotebook) {
    if (error) {
      console.log(error)
      res.status(500).send("Error finding and updating parent notebook in database")
    } else {
      res.status(200).json(details)
    }
  }

  const handleSaveNotepage = function (error, notepage) {
    if (error) {
      console.log(error)
      res.status(500).send("Error creating new notepage in database.")
    } else {
      details.id = notepage._id
      if (notepage.parentNotebook) {
        Notebook.findOneAndUpdate({ title: notepage.parentNotebook, creator: userId }, { $push: { content: details }}, handleUpdateNotebook)
      } else {
        res.status(200).json(details)
      }
    }
  }

  const handleCheckDuplicates = function (error, count) {
    if (error) {
      console.log(error)
      res.status(500).send("Error checking for duplicate notepage")
    } else if (count > 0) {
      res.status(401).json({
        error: "There already exists a notepage with this name. Please rename the notepage."
      })
    } else {
      const newNotepage = new Notepage(req.body)
      newNotepage.save(handleSaveNotepage)
    }
  }

  Notepage.countDocuments(req.body, handleCheckDuplicates)
}