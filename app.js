/*

//write jsonFile
fs.writeFile('nafix.json', JSON.stringify(events), (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});

*/

//Package dependencies
var fs = require('fs'),
    promise = require('bluebird'),
    Nightmare = require('nightmare')

//Custom Modules  
    crawler = require('./crawler/nafix_crawler');
    scrapper = require('./scrapper/nafix_scrapper');

var startUrls = ["https://www.nafix.fr/sorties/vtt-2018/janvier-56-29-22-35-44-0-0-0.html",
          "https://www.nafix.fr/sorties/vtt-2018/fevrier-56-29-22-35-44-0-0-0.html",
          "https://www.nafix.fr/sorties/vtt-2018/mars-56-29-22-35-44-0-0-0.html",
          "https://www.nafix.fr/sorties/vtt-2018/avril-56-29-22-35-44-0-0-0.html",
          "https://www.nafix.fr/sorties/vtt-2018/mai-56-29-22-35-44-0-0-0.html",
          "https://www.nafix.fr/sorties/vtt-2018/juin-56-29-22-35-44-0-0-0.html",
          "https://www.nafix.fr/sorties/vtt-2018/juillet-56-29-22-35-44-0-0-0.html",
          "https://www.nafix.fr/sorties/vtt-2018/aout-56-29-22-35-44-0-0-0.html",
          "https://www.nafix.fr/sorties/vtt-2018/septembre-56-29-22-35-44-0-0-0.html",
          "https://www.nafix.fr/sorties/vtt-2018/octobre-56-29-22-35-44-0-0-0.html",
          "https://www.nafix.fr/sorties/vtt-2018/novembre-56-29-22-35-44-0-0-0.html",
          "https://www.nafix.fr/sorties/vtt-2018/decembre-56-29-22-35-44-0-0-0.html"
        ]

startUrls.forEach((val)=>{
  crawler.crawlerInit(val)
    .then((urls)=>{
      console.log(urls)
      //scrapperInit("https://www.nafix.fr/sorties/vtt-2018/" + urls)
    })
    .then((results)=>{
      console.log(results)
    })
})


