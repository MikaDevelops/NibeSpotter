require('dotenv').config();

const express = require("express");
const app     = express();
const fs      = require('fs');
const path    = require('path');
const https   = require('node:https');
const axios   = require('axios');

const states  = {};

// Middleware
app.use(express.json()); // parse json bodies in the request object

// Redirect requests to endpoint starting with /posts to postRoutes.js
//app.use("/posts", require("./routes/postRoutes"));

/**
 * Redirect from Nibe with parameters.
 */
app.get('/nibe', (req, res)=>{
  const authorizationCode = req.query.code;
  const responseState = req.query.state;

  // Something is wrong if the API doesn't include state.
  if (responseState != states.state) {
    console.error("State parameter not same as in response from API! Exiting program.");
    process.exit(1);
  }

  console.log("code: "+authorizationCode + "\nstate: " + responseState);

  const options = {
    grant_type: 'authorization_code',
    client_id: process.env.NIBE_CLIENT_ID,
    client_secret: process.env.NIBE_CLIENT_SECRET,
    code: authorizationCode,
    redirect_uri: 'http://localhost:3000/nibe/',
    scope: 'READSYSTEM'
  }
  

  // const axiosInstance = axios.create({
  //   baseURL:  'https://api.nibeuplink.com/oauth/token?grant_type=authorization_code&client_id='+process.env.NIBE_CLIENT_ID+'&client_secret='+process.env.NIBE_CLIENT_SECRET+'&code='+authorizationCode+'&redirect_uri=http://localhost:3000/nibe/&scope=READSYSTEM',
  //   method: 'post',
  //   headers: {'Content-Type':'application/x-www-form-urlencoded'}
  // });

  axios.post(
    'https://api.nibeuplink.com/oauth/token', options,
    {headers: {'content-type':'application/x-www-form-urlencoded'}},
  )
    .then(res=>{
      console.log('status: ', res.status);
      console.log(res.data);
    })
    .catch(err=>{console.log('Error message: ' + err.message + " ")});
  
    // fetch('https://'+options.hostname+options.path,{
    //   method: options.method,
    //   headers: options.headers
    // }).then(response=>{
    //   console.log(response.body);
    // }).catch(err=>{console.log(err.message)});


  // const request = https.request(options, (res)=>{

  //   console.log('Status code:  ' + res.statusCode);
  //   console.log('Headers:  ' + res.headers);

  //   //let dataArray = [];
  //   res.on('data', (data)=>{
  //     process.stdout.write(data);
  //   })

  //   res.on('end', ()=>{ console.log('end of res');})
    
  // });

  // request.on('error', (error)=>{
  //   console.error(error);
  // });
  // request.end();

});

app.get('/', (req, res)=>{
  states.state = Math.floor(Math.random()*10000000000);
  res.redirect('https://api.nibeuplink.com/oauth/authorize?response_type=code&client_id=' + process.env.NIBE_CLIENT_ID + '&scope=READSYSTEM&redirect_uri=http://localhost:3000/nibe/&state=' + states.state);

});

// Global Error Handler. IMPORTANT function params MUST start with err
app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  res.status(500).json({
    message: "Something went really wrong",
  });
});

// Listen on pc port
const PORT = process.env.PORT || 3000;

/* const options = {
  key:  fs.readFileSync( path.join(__dirname, './cert/key.pem') ),
  cert: fs.readFileSync( path.join(__dirname, './cert/cert.pem') )
}; 
https.createServer( options, app ).listen( PORT );*/

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));