/*==========
DEPENDENCIES
==========*/

//MIDDLEWARE
var cloudinary = require('cloudinary'),
    fs = require('fs'),
    Promise = require('bluebird'),
    request = require('ajax-request'),

    //CUSTOM MODULES
    crawlerOne = require('./crawler/vtt_crawler'),
    scrapperOne = require('./scrapper/vtt_scrapper'),
    crawlerTwo = require('./crawler/athle_crawler'),
    scrapperTwo = require('./scrapper/athle_scrapper'),
    crawlerThree = require('./crawler/tri_crawler');


//MODULES CONFIG 
require('dotenv').config() //import key

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret:  process.env.API_SECRET 
  })

/*==========
SOME VARIABLES
==========*/
var indexOne = [],
    indexTwo = [],
    vttIndexUrl,
    vttDetailsUrl

/*==========
GLOBALS FUNCTIONS
==========*/
var json = (file)=>{
  var contents = fs.readFileSync(file)
  var jsonContent = JSON.parse(contents)
  return jsonContent
}

var jsonExternal = (fileAjax)=>{
  return new Promise((resolve,reject)=>{
    var file
    request(fileAjax, (err, res, body)=> {
      file = (JSON.parse(body))
      //console.log(file)
      resolve(file)
    })
  })
}

var validateEmail = (email) => {
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

/*==========
VTT TO CDN
==========*/
exports.vttCrawler = ()=>{
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

          // Backup to Cloudinary
          cloudinary.v2.uploader.upload( './exports_files/index/vtt_index.json',
          {public_id: 'exports_files/index/vtt_index.json', resource_type: "raw"},
          (err, res) => {
            if(err){console.log(err)}
            else{
              vttIndexUrl = res.secure_url
              console.log('The file vtt_index.json has been saved : ' + vttIndexUrl);
              setTimeout(() => {
                resolve(res)
              }, 5000);
            }
          }) 
        })
      })     
  })
}

exports.vttScrapper = ()=>{
  Promise
    .map(jsonExternal(vttIndexUrl),(res)=>{
      return scrapperOne.scrapperInit(res)
    },{concurrency: 3})
    .then((res)=>{
      fs.writeFile('./exports_files/details/vtt_details.json', JSON.stringify(res), (err) => {
        if (err) throw err;
        // Backup to Cloudinary
        cloudinary.v2.uploader.upload( './exports_files/details/vtt_details.json',
        {public_id: 'exports_files/details/vtt_details.json', resource_type: "raw"},
        (err, res) => {})

        console.log('The file vtt_details.json has been saved!')
        contacts('vtt_details.json', 'vtt_contacts.json')

        // Backup to Cloudinary
        cloudinary.v2.uploader.upload( './exports_files/details/vtt_details.json',
        {public_id: 'exports_files/details/vtt_details.json', resource_type: "raw"},
        (err, res) => {
          if(err){console.log(err)}
          else{
            vttDetailsUrl = res.secure_url
            console.log('The file vtt_details.json has been saved : ' + vttDetailsUrl);
            setTimeout(() => {
              console.log('DONE !')
            }, 5000);
          }
        })
      })
    })
}

/*==========
ATHLE TO LOCAL FILE
==========*/

exports.athleCrawler = ()=>{
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

exports.athleScrapper = ()=>{
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

/*==========
TRI TO LOCAL FILE
==========*/

exports.triCrawler = ()=>{
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