const Notebook = require('../models/Notebook')

exports.CreateNotebook = function (req, res) {
  const userId = req.body.creator
  const notebook = req.body

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

  const handleSaveNotebook = function (error, notebook) {
    if (error) {
      console.log(error)
      res.status(500).send("Error creating new notebook in database.")
    } else {
      details = notebook.details()

      if (!details) {
        res.status(500).send("Error getting notebook details.")
      } else {
        if (notebook.parentNotebook) {
          notebook.updateParentNotebook({ details, created: true }, handleUpdateNotebook)
        } else {
          res.status(200).json(details)
        }
      }
    }
  }

  const handleCheckDuplicates = function (error, count) {
    if (error) {
      console.log(error)
      res.status(500).send("Error checking for duplicate notebook")
    } else if (count > 0) {
      res.status(401).json({
        error: "There already exists a notebook with this name. Please rename the notebook."
      })
    } else {
      const newNotebook = new Notebook(notebook)
      newNotebook.save(handleSaveNotebook)
    }
  }

  Notebook.countDocuments(notebook, handleCheckDuplicates)
}

exports.GetNotebook = function (req, res) {
  const notebookId = req.params.notebookId
  const userId = req.params.userId

  if (!notebookId) {
    res.status(401).send("Failed to provide a notebook id")
  }

  const handleFindNotebook = function (error, notebook) {
    if (error) {
      console.log(error)
      res.status(500).send("Error finding notebook in database")
    } else if (!notebook) {
      res.status(401).send("Error finding notebook with provided notebook id")
    } else {
      if (userId && notebook.creator === userId) {
        if (notebook.parentNotebook) {
          notebook.getParentNotebook(function (err, parentNotebook) {
            res.status(200).json({
              contents: notebook.content,
              parentNotebook: parentNotebook && parentNotebook._id
            })
          })
        } else {
          res.status(200).json({
            contents: notebook.content,
            parentNotebook: null
          })
        }
      } else {
        res.status(401).json({
          error: "Looks like you don't have the right permissions to view the notebook."
        })
      }
    }
  }

  Notebook.findById(notebookId, handleFindNotebook)
}

exports.UpdateNotebook = function (req, res) {
  const userId = req.params.userId
  const notebookId = req.params.notebookId
  const notebookDetails = req.body.notebook
  const moved = req.body.moved

  if (!userId) {
    res.status(401).send("Failed to provide a user id")
  } else if (!notebookId) {
    res.status(401).send("failed to provide a notebook id")
  }

  const handleUpdateNotebook = function (error, parentNotebook) {
    if (error) {
      console.log(error)
      res.status(500).send("Error updating parent notebook.")
    } else {
      res.sendStatus(200)
    }
  }

  const handleSaveNotebook = function (err, notebook) {
    if (err) {
      console.log(err)
      res.status(500).send("Error saving notebook")
    } else {
      const details = notebook.details()
      if (notebook.parentNotebook) {
        notebook.updateParentNotebook({ details, created: moved }, handleUpdateNotebook)
      } else {
        res.status(200).send(details)
      }
    }
  }

  const handleFindNotebook = function (err, notebook) {
    if (err) {
      console.log(err)
      res.status(500).send("Error finding notebook in database")
    } else if (!notebook) {
      res.status(401).send("Error finding notebook with the provided notebook id")
    } else {
      notebook.title = notebookDetails.title
      notebook.parentNotebook = notebookDetails.parentNotebook
      notebook.save(handleSaveNotebook)
    }
  }

  Notebook.findById(notebookId, handleFindNotebook)
}

exports.MoveNotebook = function (req, res) {
  const notebookId = req.params.notebookId
  const userId = req.params.userId
  const newParentNotebook = req.body

  if (!notebookId) {
    res.status(401).send("Failed to provide a notebook id")
  } else if (!userId) {
    res.status(401).send("Failed to provide a user id")
  }

  const handleUpdateNotebook = function (err, notebook) {
    if (err || !notebook) {
      console.log(err)
      res.status(500).send("Error updating parent notebook")
    } else {
      res.sendStatus(200)
    }
  }

  const handleSaveNotebook = function (err, notebook) {
    if (err || !notebook) {
      console.log(err)
      res.status(500).send("Error updating notebook")
    } else {
      // Add notebook details to new parent notebook's contents
      const details = notebook.details()
      notebook.updateParentNotebook({ details, created: true }, handleUpdateNotebook)
    }
  }

  const handleFindNotebook = function (err, notebook) {
    if (err || !notebook) {
      console.log(err)
      res.status(500).send("Error finding notebook in database")
    } else {
      if (notebook.parentNotebook) {
        // Remove note details from notebook's original parentNotebook
        notebook.removeNoteDetails(notebookId)
      }

      // Update notebook's parentNotebook to be newParentNotebook's title
      notebook.parentNotebook = newParentNotebook.title
      notebook.save(handleSaveNotebook)
    }
  }

  // TODO: refactor to use findOneAndUpdate
  Notebook.findById(notebookId, handleFindNotebook)
}
