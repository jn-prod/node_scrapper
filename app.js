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
        fs.writeFile('./exports_files/vtt_index.json', JSON.stringify(res), (err) => {
          if (err) throw err;
          var crawlerEnd = 'OK'
          resolve(crawlerEnd) 
          console.log('The file vtt_index.json has been saved!');
        })

      })     
  })
}

var nafixScrapper = ()=>{
  Promise
    .map(json('./exports_files/vtt_index.json'),(urls)=>{
      return scrapperOne.scrapperInit(urls)
    },{concurrency: 3})
    .then((res)=>{
      fs.writeFile('./exports_files/vtt_details.json', JSON.stringify(res), (err) => {
        if (err) throw err;
        console.log('The file nafix_details.json has been saved!');
      })
    })  
}

nafixCrawler()
  .then((go)=>{
    return nafixScrapper()
  })
/*

  //KLIKEGO WORKS !!
  var crawler = Nightmare({ show: true })

    crawler
    .goto('http://klikego.com/inscriptions-course/?sport-selected=0')
    .inject('js', './assets/jquery-3.2.1.min.js' )
    .wait('body')
    .evaluate(()=>{
      var results = []
      var toCalendar = $('div > div > div > div > div > div > a')

      for(var i = 0; i < toCalendar.length; i++){
        results.push($($(toCalendar)[i]))
      }

      $(results[9]).addClass('followLink')
    })
    .click('.followLink')
    .wait('body')
    .click('button[type=submit].ml-5')
    .wait('div > h4')
    .inject('js', './assets/jquery-3.2.1.min.js' )
    .evaluate(() => {
      var results = []

      var events = $('div > h4')

      for(var i = 0 ; i < events.length ; i++){
        var link = events[i].querySelectorAll('a')[2].href
        results.push(link)         
      }

      return results
    })
    //.end()
    .then((crawler) => {
      console.log(crawler)
    })
    .catch((error)=>{
      console.error(error)
    }) 


var klikegoCrawler = ()=>{
  return new Promise((resolve,reject)=>{
    Promise
      .map(json('./init_crawler/klikego_urls.json'),(urls)=>{
        return crawlerTwo.crawlerInit(urls)
      },{concurrency: 3})
      .then((val)=>{
        val.forEach((val)=>{
          val.forEach((val)=>{
            indexOne.push(val)
          })
        })
        return indexOne
      })
      .then((res)=>{
        fs.writeFile('./exports_files/klikego_index.json', JSON.stringify(res), (err) => {
          if (err) throw err;
          var crawlerEnd = 'OK'
          resolve(crawlerEnd) 
          console.log('The file klikego_index.json has been saved!');
        })

      })     
  })
}


klikegoCrawler()
*/