const axios = require('axios');

/*need to create better testing code, this is too messy but works for now*/
const testUser = "Testing"

axios.post('http://localhost:3000/register', {username: testUser, password: testUser})
.then(res=>{
    console.log(res['data'])
}).then(()=>{
    axios.post('http://localhost:3000/createnote', {username: testUser})
    .then(res=>{
        console.log(res['data']);
    })
    .catch(err =>{
        console.log(err);
    })
})
.catch(userExists=>{
    if(userExists){
        console.log(`Test user: ${testUser} already exists, proceed testing`)
        axios.post('http://localhost:3000/createnote', {username: testUser})
        .then(res=>{
            console.log(res['data']);
        })
        .catch(err =>{
            console.log(err);
        })
    }})


