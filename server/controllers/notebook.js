const Notebook = require('../models/Notebook')

exports.CreateNotebook = function (req, res) {
  const username = req.params.username

  const handleSaveNotebook = function (error, notebook) {
    if (error) {
      console.log(error)
      res.status(500).send("Error creating new notebook in database.")
    } else {
      res.status(200).json({
        id: notebook._id,
        title: notebook.title,
        timestamp: notebook.timestamp
      })
    }
  }

  if (username) {
    const newNotebook = new Notebook(req.body)
    newNotebook.save(handleSaveNotebook)
  } else {
    res.status(400).send("Notebook does not have a creator")
  }
}