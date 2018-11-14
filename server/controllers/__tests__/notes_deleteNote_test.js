const {deleteNote} = require('./notes');
const axios = require('axios');
var id = "5be450e397aefc037dcbacad"

axios.post('http://localhost:3000/deletenote',{_id:id, confirm: 'true'})
.then(res=>{
    console.log(res);
}).catch(err=>{
    console.log(err)
})


