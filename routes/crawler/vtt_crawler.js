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

      var links = $('tr > td > table > tbody > tr > td > a')

      for(var i = 0; i < (links.length); i++){
        var j = i+1
        var year = $($($('div#Position_Resultat > table > tbody > tr')[j]).find('td > div > div')[0]).text().split('/')[2]

        results.push({
          year : year,
          link : $($(links)[i]).attr('href')
        })
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