var promise = require('bluebird'),
    Nightmare = require('nightmare')

exports.scrapperInit = (data) => {
  var data = data

  return new Promise((resolve, reject)=>{ 
    var scrapper = Nightmare({ show: false })

    scrapper
    .goto(data.url)
    .inject('js', './assets/jquery-3.2.1.min.js' )
    .wait('body')
    .evaluate(() => {

      var event = {
        organisateur : $($($('table.linedRed')[0]).find('td')[3]).text(),
        lieuRdv : $($($('table.linedRed')[0]).find('td')[9]).text() + ' ' + $($($('table.linedRed')[0]).find('td')[12]).text() + ' ' + $($($('table.linedRed')[0]).find('td')[15]).text(),
        horaire : null ,
        site : $($($('table.linedRed')[0]).find('td')[6]).text(),
        prixPublic : null,
        prixClub : null ,
        contact : $($($('table.linedRed')[0]).find('td')[26]).text(),
        description : null ,
        tract : null 
      }

      return event
    })
    .end()
    .then((scrapper) => {
      scrapper.date = data.date + '/2018'
      scrapper.departement = data.departement
      scrapper.lieu = data.lieu
      scrapper.eventName = data.eventName
      resolve(scrapper)
    })
    .catch((error)=>{
      console.error(error)
    })     
  })
}