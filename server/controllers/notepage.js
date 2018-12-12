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
      if (notepage.creator === userId || notepage.permissions.indexOf(userId) !== -1) {
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
      if (notepage.creator !== userId && !userId[0]) {
        res.status(401).json({
          error: "User does not have permission to edit notepage."
        })
      } else {
        notepage.title = data.title || notepage.title
        notepage.parentNotebook = data.parentNotebook || notepage.parentNotebook
        notepage.content = data.content || notepage.content
        notepage.starred = (typeof data.starred !== 'undefined') ? data.starred : notepage.starred
        notepage.removed = (typeof data.removed !== 'undefined')
        notepage.save(handleSaveNotepage)
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

exports.MoveNotepage = async function (req, res) {
  const userId = req.params.userId
  const notepageId = req.params.notepageId
  const { newParentNotebook, original } = req.body

  if (!userId) {
    res.status(401).send("Failed to provide a user id")
  } else if (!notepageId) {
    res.status(401).send("Failed to provide a note page id")
  }

  let notepage
  let originalParentNotebook

  try {
    if (original) {
      originalParentNotebook = await Notebook.findOne({ title: original, creator: userId })
    }

    notepage = await Notepage.findById(notepageId)
  } catch (error) {
    console.log(error)
    res.status(500).send("Error moving notepage to another notebook.")
  }

  if (!notepage) {
    res.status(500).send("Error finding notepage with provided notepage id")
  } else if (!originalParentNotebook && original) {
    res.status(500).send("Error finding original parent notebook")
  }

  // 1) Update notepage's parent notebook to new notebook title
  notepage.parentNotebook = newParentNotebook.title

  let updatedNotepage
  try {
    // 2) Remove note details from original parent notebook
    if (originalParentNotebook) {
      originalParentNotebook.content = originalParentNotebook.content.filter(detail => detail.id !== notepageId) || originalParentNotebook.content
      await originalParentNotebook.save()
    }

    updatedNotepage = await notepage.save()
  } catch (error) {
    console.log(error)
    res.status(500).send("Error moving notepage to another notebook.")
  }

  if (!updatedNotepage) {
    res.status(500).send("Error updating notepage")
  }

  const handleUpdateNotepage = function (err, notepage) {
    if (err || !notepage) {
      console.log(err)
      res.status(500).send("Error updating notepage")
    } else {
      res.sendStatus(200)
    }
  }

  // 3) Add notepage's details to new parent notebook
  const details = updatedNotepage.details()
  updatedNotepage.updateParentNotebook({ details, created: true }, handleUpdateNotepage)
}

exports.ShareNotepage = function (req, res) {
  const noteId = req.params.noteId
  const permissionCode = req.body.permissionCode

  if (!noteId) {
    res.status(400).send("Failed to provide a note id")
  } else if (!permissionCode) {
    res.status(400).send("Failed to provide a permission code")
  }

  const handleSaveNotepage = function (err, notepage) {
    if (err || !notepage) {
      console.log(err)
      res.status(500).send("Failed to update notepage")
    } else {
      res.sendStatus(200)
    }
  }

  const handleFindNotepage = function (err, notepage) {
    if (err || !notepage) {
      console.log(err)
      res.status(500).send("Error finding notepage in database")
    } else {
      notepage.permissions.push(permissionCode)
      notepage.save(handleSaveNotepage)
    }
  }

  Notepage.findById(noteId, handleFindNotepage)
}

exports.GetStarredNotepages = function (req, res) {
  const userId = req.params.userId

  if (!userId) {
    res.status(400).send("Failed to provide a user id")
  }

  const handleFindStarredNotepages = function (error, notepages) {
    if (error) {
      console.log(error)
      res.status(500).send("Error finding starred notepages")
    } else {
      const starredDetails = notepages.map(notepage => notepage.details())
      res.status(200).send(starredDetails)
    }
  }

  Notepage.find({ creator: userId, starred: true }, handleFindStarredNotepages)
}

exports.GetRemovedNotepages = function (req, res) {
  const userId = req.params.userId

  if (!userId) {
    res.status(500).send("Failed to provide user id")
  }

  const handleFindRemovedNotepages = function (err, notepages) {
    if (err) {
      console.log(err)
      res.status(500).send("Error finding removed notepages")
    } else {
      const removedDetails = notepages.map(notepage => notepage.details())
      res.status(200).send(removedDetails)
    }
  }

  Notepage.find({ creator: userId, removed: true }, handleFindRemovedNotepages)
}
