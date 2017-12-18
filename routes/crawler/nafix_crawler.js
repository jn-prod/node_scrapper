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
      
      for(var i = 0; i < links.length; i++){
        results.push($($(links)[i]).attr('href'))
      }

      return results
    })
    .end()
    .then((crawler) => {
      resolve(crawler)
    })
    .catch((error)=>{
      console.error(error)
    })   
  })
}