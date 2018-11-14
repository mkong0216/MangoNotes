const axios = require('axios');

const testUser = "Testing"

axios.get(`http://localhost:3000/notes?username=${testUser}`)
  .then(function (res) {
    console.log(res.data);
  })
  .catch(function (error) {
      console.log(error)
  });