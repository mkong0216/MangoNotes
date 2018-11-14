const np = require('../models/NotePage')
const {UserDoc} = require('../models/User')


//createNote takes in request and response as paramater and extracts username from request to instantiate new note 
exports.createNote = function(req, res){
  var username = req.body.username;
  var filename = req.body.username;
  //check if username exists in post-request body
  if(username){
    var note = {
      owner: username,
    }
    var newNote = new np(note);
    //saving note and handling error
    newNote.save(function(SaveError, object){
      //error when saving the notepage
      if(SaveError){
        console.log(updateError);
      }
      else{
        //first is the search criteria, second is the update criteria (in this case it's a push to array)
        UserDoc.findOneAndUpdate({username: username}, {$push:{documents:object._id}}, function(updateError){
          //error when pushing new note _id to the user's document array
          if(updateError){
            console.log(updateError)
          }
        })
      }
    })
    res.status(200).end("Successfully created new note page!")
  }
  else{
    res.status(500).end("Error: Missing username in required field");
  } 
}

exports.fetchNote = function(req, res){
  var id = req.query['_id'];
  //check if an id is passed in
  if(id){
    np.findById(id, function(findError, result){
      if(result.length>=1){
        res.status(200).send([result]);
      }
      else{
        res.status(500).send("Unable to find document")
      }
    })
  }
  else{
    res.status(500).send("parameter: _id is missing")
  }
}

exports.deleteNote = function(req, res){
  var id = req.body._id;
  var confirm = req.body.confirm;
  if(id && confirm == "true"){
    np.findByIdAndDelete({_id:id}, function(err, result){
      if(err){
        console.log(err);
      }
      //remove item id from user's storage
      target = result.owner;
      id = result._id;
      UserDoc.findOneAndUpdate({username:target},{$pull:{documents:id}}, function(err, result){
        if(err){
          console.log(err);
        }
      })
    })
  }
}
