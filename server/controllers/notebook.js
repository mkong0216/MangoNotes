const Notebook = require('../models/Notebook')

exports.CreateNotebook = function (req, res) {
  const userId = req.body.creator

  if (!userId) {
    res.status(401).send("Failed to provide a userId")
  }

  const handleSaveNotebook = function (error, notebook) {
    if (error) {
      console.log(error)
      res.status(500).send("Error creating new notebook in database.")
    } else {
      res.status(200).json({
        id: notebook._id,
        title: notebook.title
      })
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

  Notebook.estimatedDocumentCount(req.body, handleCheckDuplicates)
}