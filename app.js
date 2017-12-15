    //Packagse dependencies
var fs = require('fs'),
    Promise = require('bluebird'),
    Nightmare = require('nightmare'),

    //Custom Modules NAFIX
    crawlerOne = require('./routes/crawler/nafix_crawler'),
    scrapperOne = require('./routes/scrapper/nafix_scrapper'),
    //Custom Modules KLIKEGO
    crawlerTwo = require('./routes/crawler/klikego_crawler'),
    scrapperTwo = require('./routes/scrapper/klikego_scrapper');

var indexOne = [],
    indexTwo = []

var json = (file)=>{
  var contents = fs.readFileSync(file)
  var jsonContent = JSON.parse(contents)
  return jsonContent
}

//NAFIX WORKS !!

var nafixCrawler = ()=>{
  return new Promise((resolve,reject)=>{
    Promise
      .map(json('./init_crawler/nafix_urls.json'),(urls)=>{
        return crawlerOne.crawlerInit(urls)
      },{concurrency: 3})
      .then((val)=>{
        val.forEach((val)=>{
          val.forEach((val)=>{
            indexOne.push("https://www.nafix.fr/sorties/vtt-2018/" + val)
          })
        })
        return indexOne
      })
      .then((res)=>{
        fs.writeFile('./exports_files/nafix_index.json', JSON.stringify(res), (err) => {
          if (err) throw err;
          var crawlerEnd = 'OK'
          resolve(crawlerEnd) 
          console.log('The file nafix_index.json has been saved!');
        })

      })     
  })
}

var nafixScrapper = ()=>{
  Promise
    .map(json('./exports_files/nafix_index.json'),(urls)=>{
      return scrapperOne.scrapperInit(urls)
    },{concurrency: 3})
    .then((res)=>{
      fs.writeFile('./exports_files/nafix_details.json', JSON.stringify(res), (err) => {
        if (err) throw err;
        console.log('The file nafix_details.json has been saved!');
      })
    })  
}

nafixCrawler()
  .then((go)=>{
    return nafixScrapper()
  })

  //KLIKEGO WORKS !!