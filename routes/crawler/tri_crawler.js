var promise = require('bluebird'),
    Nightmare = require('nightmare') 

exports.crawlerInit = (url)=>{
  return new Promise((resolve, reject)=>{
    var crawler = Nightmare({ show: false })

    crawler
    .goto(url)
    .inject('js', './assets/jquery-3.2.1.min.js' )
    .wait('body')
    .evaluate(() => {
      var results = []

      var links = $('tr')

      for(var i = 0; i < (links.length); i++){

        var event = {
        date : $($('tr')[i].children[1]).text() + "/2018",
        departement : $($('tr')[i].children[2]).text(),
        lieu : $($('tr')[i].children[3]).text(),
        eventName : $($('tr')[i].children[4]).text(),
        organisateur : null,
        lieuRdv : null,
        horaire : null,
        site : null,
        prixPublic : null,
        prixClub : null,
        contact : $($('tr')[i].children[6]).text(),
        description : null,
        tract : null
        }

        results.push(event)
      }

      return results
    })
    .end()
    .then((crawler) => {
      resolve(crawler)
    })
    .catch((error)=>{
      reject(error)
    })   
  })
}