    //Packagse dependencies
var fs = require('fs'),
    Promise = require('bluebird'),
    Nightmare = require('nightmare'),
    express = require('express'),

    //Custom Modules VTT
    crawlerOne = require('./routes/crawler/vtt_crawler'),
    scrapperOne = require('./routes/scrapper/vtt_scrapper'),
    //Custom Modules ATHLE
    crawlerTwo = require('./routes/crawler/athle_crawler'),
    scrapperTwo = require('./routes/scrapper/athle_scrapper'),
    //Custom Modules TRI
    crawlerThree = require('./routes/crawler/tri_crawler');

var app = express();

var indexOne = [],
    indexTwo = []

var json = (file)=>{
  var contents = fs.readFileSync(file)
  var jsonContent = JSON.parse(contents)
  return jsonContent
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

var contacts = (start_file, end_file)=>{
  Promise
    .map(json('./exports_files/details/' + start_file),(res)=>{//vtt_details.json'
      var items = []
      var contacts = res.contact.split(' ')
      contacts.forEach((val)=>{
        if (validateEmail(val) === true) {
          items.push({
            event : res.eventName,
            organisateur : res.organisateur,
            lieu : res.lieu,
            departement : res.departement,
            divers : res.contact,
            email : val
          }) 
        }
      })

      return items
    },{concurrency: 3})
    .then((res)=>{
      var items = []
      res.forEach((val)=>{
        val.forEach((val)=>{
          items.push(val)
        })
      })
      fs.writeFile('./exports_files/contacts/' + end_file, JSON.stringify(items), (err) => {//vtt_contacts.json
        if (err) throw err;
        console.log('The file ' + end_file + ' has been saved!');
      })
    })  
}


//VTT WORKS !!

var vttCrawler = ()=>{
  return new Promise((resolve,reject)=>{
    Promise
      .map(json('./init_crawler/vtt_urls.json'),(urls)=>{
        return crawlerOne.crawlerInit(urls)
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
        fs.writeFile('./exports_files/index/vtt_index.json', JSON.stringify(res), (err) => {
          if (err) throw err;
          var crawlerEnd = 'OK'
          resolve(crawlerEnd) 
          console.log('The file vtt_index.json has been saved!');
        })
      })     
  })
}

var vttScrapper = ()=>{
  Promise
    .map(json('./exports_files/index/vtt_index.json'),(res)=>{
      return scrapperOne.scrapperInit(res)
    },{concurrency: 3})
    .then((res)=>{
      fs.writeFile('./exports_files/details/vtt_details.json', JSON.stringify(res), (err) => {
        if (err) throw err;
        console.log('The file vtt_details.json has been saved!')
        contacts('vtt_details.json', 'vtt_contacts.json')
      })
    })
}


app.set('port', 3000);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/scrapper-vtt', (req, res) => {
  vttCrawler()
    .then((go)=>{
      return vttScrapper()
    })
})

app.listen((process.env.PORT || 3000), () => {
  console.log("Node app is running at localhost:" + app.get('port'))
});

/*
  //RUN WORKS !!
var athleCrawler = ()=>{
  return new Promise((resolve,reject)=>{
    Promise
      .map(json('./init_crawler/athle_urls.json'),(urls)=>{
        return crawlerTwo.crawlerInit(urls)
      },{concurrency: 3})
      .then((val)=>{        
        val.forEach((val)=>{
          val.forEach((val)=>{
            indexTwo.push(val)
          })
        })
        return indexTwo
      })
      .then((res)=>{
        fs.writeFile('./exports_files/index/athle_index.json', JSON.stringify(res), (err) => {
          if (err) throw err;
          var crawlerEnd = 'OK'
          resolve(crawlerEnd) 
          console.log('The file athle_index.json has been saved!');
        })
      })     
  })
}

var athleScrapper = ()=>{
  Promise
    .map(json('./exports_files/index/athle_index.json'),(res)=>{
      return scrapperTwo.scrapperInit(res)
      
    },{concurrency: 3})
    .then((res)=>{
      fs.writeFile('./exports_files/details/athle_details.json', JSON.stringify(res), (err) => {
        if (err) throw err;
        console.log('The file athle_details.json has been saved!')
        contacts('athle_details.json', 'athle_contacts.json')
      })
    })
}

athleCrawler()
  .then((go)=>{
    return athleScrapper()
  })



//TRI WORKS !!

var triCrawler = ()=>{
  return new Promise((resolve,reject)=>{
    Promise
      .map(json('./init_crawler/tri_urls.json'),(urls)=>{
        return crawlerThree.crawlerInit(urls)
      },{concurrency: 3})
      .then((res)=>{
        fs.writeFile('./exports_files/details/tri_details.json', JSON.stringify(res[0]), (err) => {
          if (err) throw err;
          var crawlerEnd = 'OK'
          resolve(crawlerEnd) 
          console.log('The file tri_details.json has been saved!');
          contacts('tri_details.json', 'tri_contacts.json')
        })  
      }) 
  })
}

triCrawler()*/