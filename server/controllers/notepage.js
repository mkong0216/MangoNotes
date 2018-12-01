const Notepage = require('../models/Notepage')
const Notebook = require('../models/Notebook')

exports.CreateNotepage = function (req, res) {
  const userId = req.body.creator
  const notepage = req.body

  let details

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
      details = notepage.details()

      if (!details) {
        res.status(500).send("Error getting notepage details.")
      } else {
        if (notepage.parentNotebook) {
          notepage.updateParentNotebook({ details, created: true }, handleUpdateNotebook)
        } else {
          res.status(200).json(details)
        }
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

  Notepage.countDocuments(notepage, handleCheckDuplicates)
}

exports.GetNotepage = function (req, res) {
  const notepageId = req.params.notepageId
  const userId = req.params.userId

  if (!userId) {
    res.status(401).send("Failed to provide a user id")
  } else if (!notepageId) {
    res.status(401).send("Failed to provide a notepage id")
  }

  const handleFindNotepage = function (error, notepage) {
    if (error) {
      console.log(error)
      res.status(500).send("Error finding notepage")
    } else if (!notepage) {
      res.status(500).send("Error finding a notepage with the provided notepage id")
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
  const data = req.body

  let details

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
      res.status(200).json(details)
    }
  }

  const handleSaveNotepage = function (error, notepage) {
    if (error) {
      console.log(error)
      res.status(500).send("Error updating notepage")
    } else {
      details = notepage.details()
      if (notepage.parentNotebook) {
        notepage.updateParentNotebook({ details, created: false }, handleUpdateNotebook)
      } else {
        res.status(200).json(details)
      }
    }
  }

  const handleFindNotepage = function (error, notepage) {
    if (error) {
      console.log(error)
      res.status(500).send("Error finding notepage in database")
    } else if (!notepage) {
      res.status(500).send("Error finding notepage with provided notepage id")
    } else {
      notepage.title = data.title
      notepage.parentNotebook = data.parentNotebook
      notepage.content = data.content || notepage.content
      
      notepage.save(handleSaveNotepage)
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
      Notepage.findById(notepageId, handleFindNotepage)
    }
  }

  Notepage.countDocuments({
    title: req.body.title,
    parentNotebook: req.body.parentNotebook,
    _id: { $ne: notepageId }
  }, handleCheckDuplicates)
}

exports.GetRecentNotepages = function (req, res) {
  const userId = req.params.userId

  if (!userId) {
    res.status(401).send("Failed to provide a user id")
  }

  const handleGetRecentNotepages = function (error, notepages) {
    if (error) {
      console.log(error)
      res.status(500).send("Error getting most recent notepages of user")
    } else {
      const noteDetails = notepages.map((notepage) => {
        return {
          id: notepage._id,
          title: notepage.title,
          updatedAt: notepage.updatedAt
        }
      })

      res.status(200).send(noteDetails)
    }
  }

  const query = Notepage.find({ creator: userId }).select('-content -createdAt').sort({ updatedAt: -1 }).limit(10)
  query.exec(handleGetRecentNotepages)
}