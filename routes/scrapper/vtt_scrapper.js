var promise = require('bluebird'),
    Nightmare = require('nightmare')

exports.scrapperInit = (data) => {
  var data = data

  return new Promise((resolve, reject)=>{
    var scrapper = Nightmare({ show: false })

    scrapper
    .goto("https://www.nafix.fr/sorties/vtt-"+ data.year + "/" + data.link)
    .inject('js', './assets/jquery-3.2.1.min.js' )
    .wait('body')
    .evaluate(() => {

      var event = {
        date : $('#txt_ref_int_date_2').text(),
        departement : $('#txt_ref_int_dpt_2').text(),
        lieu : $('#txt_ref_int_lieu_2').text(),
        eventName : $('#txt_ref_int_nom_2').text(),
        organisateur : $('#txt_ref_int_organisateur_2').text(),
        lieuRdv : $('#txt_ref_int_ldrdv_2').text(),
        horaire : $('#txt_ref_int_horaires_2').text(),
        site : $('#txt_ref_int_site_2').text(),
        prixPublic : $('#txt_ref_int_prix2 > textarea').text(),
        prixClub : $('#txt_ref_int_prix4 > textarea').text(),
        contact : $('#txt_ref_int_contacttxt > textarea').text(),
        description : $('#txt_ref_int_decription > textarea').text(),
        tract : $('#tract > a').attr('href')
      }

      return event
    })
    .end()
    .then((scrapper) => {
      resolve(scrapper)
    })
    .catch((error)=>{
      console.error(error)
    })     
  })
}