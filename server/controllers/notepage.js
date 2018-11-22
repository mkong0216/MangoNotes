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
      details.updatedAt = notepage.updatedAt

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

exports.GetNotepage = function (req, res) {
  const notepageId = req.params.notepageId
  const userId = req.params.userId

  if (!userId) {
    res.status(401).send("Failed to provide a userId")
  } else if (!notepageId) {
    res.status(401).send("Failed to provide a notepageId")
  }

  const handleFindNotepage = function (error, notepage) {
    if (error) {
      console.log(error)
      res.status(500).send("Error finding notepage")
    } else {
      if (notepage.creator === userId) {
        res.status(200).send(notepage)
      } else {
        res.status(401).json({
          error: "Looks like you don't have the right permissions to view the notebook."
        })
      }
    }
  }

  Notepage.findById(notepageId, handleFindNotepage)
}

exports.UpdateNotepage = function (req, res) {
  const notepageId = req.params.notepageId
  const userId = req.params.userId

  const details = {
    title: req.body.title,
    creator: userId,
    parentNotebook: req.body.parentNotebook,
    type: 'notepage'
  }

  if (!userId) {
    res.status(401).send("Failed to provide a userId")
  } else if (!notepageId) {
    res.status(401).send("Failed to provide a notepageId")
  }

  const handleUpdateNotebook = function (error, parentNotebook) {
    if (error) {
      console.log(error)
      res.status(500).send("Error finding and updating parent notebook in database")
    } else {
      res.sendStatus(200)
    }
  }

  const handleUpdateNotepage = function (error, notepage) {
    if (error) {
      console.log(error)
      res.status(500).send("Error updating notepage")
    } else {
      if (notepage.parentNotebook) {
        Notebook.findOneAndUpdate({ title: notepage.parentNotebook, creator: notepage.creator }, { $push: { content: details }}, handleUpdateNotebook)
      } else {
        res.status(200).send(details)
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
      Notepage.findOneAndUpdate({ _id: notepageId }, { $set: { title: req.body.title, content: req.body.content }}, handleUpdateNotepage)
    }
  }

  Notepage.countDocuments({
    title: req.body.title,
    parentNotebook: req.body.parentNotebook,
    _id: { $ne: notepageId }
  }, handleCheckDuplicates)
}
