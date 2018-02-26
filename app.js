var express = require('express'),
    //CRON
    cron = require('./routes/cron'),
    //CUSTOM MIDDLEWARE
    builder = require('./routes/builder');

var app = express();

/*==========
APP INIT
==========*/

app.set('port', 3000);

app.get('/', (req, res) => {
  res.send('<a href="/scrapper-vtt">launch scrapper vtt</a> • <a href="/scrapper-run">launch scrapper run</a> • <a href="/scrapper-tri">launch scrapper tri</a>')
})

app.get('/scrapper-vtt', (req, res) => {
  //console.log('scrapper vtt open !')
  res.send('scrapper vtt launch!')
  builder.vttCrawler()
    .then((go)=>{
      return builder.vttScrapper()
    })
})

app.get('/scrapper-run', (req, res) => {
  res.send('scrapper run launch!')
  builder.athleCrawler()
  .then((go)=>{
    return builder.athleScrapper()
  })
})

app.get('/scrapper-tri', (req, res) => {
  res.send('scrapper tri launch!')
  builder.triCrawler()
})

app.listen((process.env.PORT || 3000), () => {
  console.log("Node app is running at localhost:" + app.get('port'))
});