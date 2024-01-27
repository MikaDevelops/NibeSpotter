require('dotenv').config();

const express = require("express");
const app     = express();
const fs      = require('fs');
const path    = require('path');
const https   = require('node:https');
const axios   = require('axios');
const cors    = require('cors');

const states  = {
  token: {
      access_token: null,
      refresh_token: null,
      token_type: null,
      expires_in: null,
      scope: null,
      timestamp: null,
  }


};

// Advance seconds setting for token refressing.
const refreshAdvanceSeconds = 20;
const systemStatusUpdateIntervalSeconds = 180;
const timeOfPriceUpdateUTC = [12,0];

// Middleware
app.use(cors());
app.use(express.json()); // parse json bodies in the request object

// Redirect requests to endpoint starting with /posts to postRoutes.js
//app.use("/posts", require("./routes/postRoutes"));

/**
 * Redirected from Nibeuplink with authorization code.
 */
app.get('/nibe', (req, res2)=>{
  const authorizationCode = req.query.code;
  const responseState = req.query.state;

  // Something is wrong if the Nibe API doesn't include state.
  if (responseState != states.state) {
    console.error("State parameter not same as in response from API! Exiting program.");
    process.exit(1);
  }

  const options = {
    grant_type: 'authorization_code',
    client_id: process.env.NIBE_CLIENT_ID,
    client_secret: process.env.NIBE_CLIENT_SECRET,
    code: authorizationCode,
    redirect_uri: 'http://localhost:'+process.env.PORT+'/nibe/',
    scope: 'READSYSTEM'
  }

  axios.post(
    'https://api.nibeuplink.com/oauth/token', options,
    {headers: {'content-type':'application/x-www-form-urlencoded'}},
  )
    .then(res=>{

      console.log('post to token status: ', res.status);
    
      let token = {
        access_token:  res.data.access_token,
        refresh_token: res.data.refresh_token,
        token_type:    res.data.token_type,
        expires_in:    res.data.expires_in,
        scope:         res.data.scope,
        timestamp:     new Date()
      }

      setStatePropertyWithName("token", token);
      refreshTokenInterval(parseInt(token.expires_in, 10));
      getSystemInformation();
      res2.redirect(process.env.FRONT_END_ADDRESS);
      
    })
    .catch(err=>{console.log('Error message: ' + err.message + " ");});

    
});

/**
 * Redirect browser to Nibeuplink login page.
 */
app.get('/', (req, res)=>{
  states.state = Math.floor(Math.random()*10000000000);
  res.redirect('https://api.nibeuplink.com/oauth/authorize?response_type=code&client_id=' + process.env.NIBE_CLIENT_ID 
  + '&scope=READSYSTEM&redirect_uri=http://localhost:'+process.env.PORT+'/nibe/&state=' + states.state);
});

app.get('/checktokenstatus', (req,res)=>{
  let tokenValid = checkTokenValid();
  res.json({tokenIsValid: tokenValid});
});

app.get('/getsystemstatus', (req, res)=>{
  res.json({
    systemStatus: states.systemStatus ? states.systemStatus:'no info available',
    parameters: states.parameters ? states.parameters: 'no info available'
  });
});

// Global Error Handler. IMPORTANT function params MUST start with err
app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  res.status(500).json({
    message: "Something went really wrong: " + err.message,
  });
});

// Listen on pc port
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

/**
 * Sets name:key value pair to states object.
 * @param {string} name key or name for the property
 * @param {*} value to be given to property
 */
function setStatePropertyWithName(name, value){
  states[name] = value;
}

function refreshToken(){

  const options = {
    grant_type: 'refresh_token',
    client_id: process.env.NIBE_CLIENT_ID,
    client_secret: process.env.NIBE_CLIENT_SECRET,
    refresh_token: states.token.refresh_token
  }

  axios.post(
    'https://api.nibeuplink.com/oauth/token', options,
    {headers: {'content-type':'application/x-www-form-urlencoded'}},
  )
    .then(res=>{
      console.log('response for refresh: ', res.status);
      
      states.token.access_token   = res.data.access_token;
      states.token.refresh_token  = res.data.refresh_token;
      states.token.expires_in     = res.data.expires_in;
      states.token.timestamp      = new Date();

      refreshTokenInterval(parseInt(states.token.expires_in, 10));

      console.log("refreshed token \n" + states.token.timestamp +"\n");

    })
    .catch(err=>{console.log('Error message: ' + err.message + " ")});

  
}

function refreshTokenInterval(expirationTime){

  if (!Number.isInteger(expirationTime)) throw new Error ("refreshToken: Given parameter is not an integer.");
  else {

    let milliseconds = (expirationTime-refreshAdvanceSeconds)*1000;
    setTimeout(()=>refreshToken(),milliseconds);
  
  }
}

function checkTokenValid(){
  if (states.token.access_token != null ) {

    if (
      states.token.timestamp.valueOf()+(states.token.expires_in*1000-refreshAdvanceSeconds*1000)
      > Date.now()
    ) 
      {
        return true;
      } 
      else {
        return false;
      }

  }
  else {
    return false;
  }
}

function getSystemInformation(){

    getToApi('')
    .then((res)=>{
      // Only system object [0]. If multiple systems needs to be refactored.
      setStatePropertyWithName("systemInfo", res.data.objects[0]);
    }).then (()=>{
      updateSystemStatus();
    })
    .catch(err=>{
      console.log('Error message (getSystemInformation function): ' + err.message);
    });
}

function getToApi(endOfUrl){
  if (endOfUrl==undefined || endOfUrl == null) endOfUrl='';
  if (endOfUrl[0] != '/') endOfUrl = '/' + endOfUrl;
  return axios.get(`https://api.nibeuplink.com/api/v1/systems${endOfUrl}`, {
    headers:{'Authorization': `Bearer ${states.token.access_token}`}
    });
}

function updateSystemInterval(){
  setTimeout(()=>{updateSystemStatus()}, systemStatusUpdateIntervalSeconds*1000);
}

function updateSystemStatus(){

  getToApi(`/${states.systemInfo.systemId}/status/system`)

  .then((res)=>{
    setStatePropertyWithName('systemStatus', res.data);
  })

  .then(()=>{

    getToApi(`/${states.systemInfo.systemId}/parameters?parameterIds=40004&parameterIds=47398&parameterIds=47388`)
      .then((res)=>{
        setStatePropertyWithName('parameters', res.data);
        //getAllParameters();
        updateSystemInterval();
      }
    );

  })

  .catch((err)=>{
    console.log('Error message (updateSystemStatus): ' + err.message);
  });

}

function getAllParameters(){
  getToApi(`/${states.systemInfo.systemId}/serviceinfo/categories?parameters=true`)
  .then((res)=>{
    console.log("get service info" + res.data);
  })
}