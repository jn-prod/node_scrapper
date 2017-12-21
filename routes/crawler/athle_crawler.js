var promise = require('bluebird'),
    Nightmare = require('nightmare') 

exports.crawlerInit = (url)=>{
  var crawler = Nightmare({ show: false })
    return new Promise((resolve, reject)=>{

      crawler
      .goto(url)
      .inject('js', './assets/jquery-3.2.1.min.js' )
      .wait('body')
      .evaluate(()=>{
        var results = []

        var row = $('tr')
        
        for(var i = 0; i < row.length; i++){
          var itemUrl = String($($($('tr')[i]).find('a')[3]).attr('href')).split("'")[1],
              itemDate = $($('tr')[i].children[2]).text(),
              itemEventName = $($('tr')[i].children[6]).text(),
              itemLieu = $($('tr')[i].children[8]).text(),
              itemDepartement = $($('tr')[i].children[12]).text();

          if(itemUrl !== undefined){
            results.push({
              date : itemDate,
              eventName : itemEventName,
              lieu : itemLieu,
              departement : itemDepartement,
              url : "http://bases.athle.com/asp.net/competitions.aspx?base=calendrier&id=" + itemUrl
            })
          }
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