const Notebook = require('../models/Notebook')

exports.CreateNotebook = function (req, res) {
  const userId = req.body.creator
  let details = { ...req.body, type: 'notebook' }

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
      details.id = notebook._id
      details.updatedAt = notebook.updatedAt

      if (notebook.parentNotebook) {
        Notebook.updateOne({ title: notebook.parentNotebook, creator: userId }, { $push: { content: details }}, handleUpdateNotebook)
      } else {
        res.status(200).json(details)
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
      const newNotebook = new Notebook(req.body)
      newNotebook.save(handleSaveNotebook)
    }
  }

  Notebook.countDocuments(req.body, handleCheckDuplicates)
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
    } else {
      if (userId && notebook.creator === userId) {
        res.status(200).send(notebook.content)
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
  const contents = req.body.contents

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
      notebook.details(function (details) {
        if (notebook.parentNotebook) {
          Notebook.updateOne({ title: notebook.parentNotebook, creator: notebook.creator, "content.id": notebookId }, { $set: { "content.$": details }}, handleUpdateNotebook)
        } else {
          res.status(200).send(details)
        }
      })
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

      if (contents) {
        notebook.contents = contents
      }

      notebook.save(handleSaveNotebook)
    }
  }

  Notebook.findById(notebookId, handleFindNotebook)
}