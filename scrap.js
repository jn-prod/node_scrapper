//App init
var $ = require('jquery'),
    Nightmare = require('nightmare'),
    nightmare = Nightmare({ show: true });

var annee = 2018,
    links =  [
    "https://www.nafix.fr/sorties/vtt-2018/janvier-56-29-22-35-44-0-0-0.html",
    "https://www.nafix.fr/sorties/vtt-2018/fevrier-56-29-22-35-44-0-0-0.html",
    "https://www.nafix.fr/sorties/vtt-2018/mars-56-29-22-35-44-0-0-0.html",
    "https://www.nafix.fr/sorties/vtt-2018/avril-56-29-22-35-44-0-0-0.html",
    "https://www.nafix.fr/sorties/vtt-2018/mai-56-29-22-35-44-0-0-0.html",
    "https://www.nafix.fr/sorties/vtt-2018/juin-56-29-22-35-44-0-0-0.html",
    "https://www.nafix.fr/sorties/vtt-2018/juillet-56-29-22-35-44-0-0-0.html",
    "https://www.nafix.fr/sorties/vtt-2018/aout-56-29-22-35-44-0-0-0.html",
    "https://www.nafix.fr/sorties/vtt-2018/septembre-56-29-22-35-44-0-0-0.html",
    "https://www.nafix.fr/sorties/vtt-2018/octobre-56-29-22-35-44-0-0-0.html",
    "https://www.nafix.fr/sorties/vtt-2018/novembre-56-29-22-35-44-0-0-0.html",
    "https://www.nafix.fr/sorties/vtt-2018/decembre-56-29-22-35-44-0-0-0.html",
  ],
  link = links[0],
  eventLinks = []

nightmare
  .goto(link)
  .wait('body')
  .evaluate(() => {
    var items = Array.from(document.querySelectorAll('tr > td > table > tbody > tr > td > a')).map(element => element.href)
    return items
  })
  .then((res) => {
    eventLinks = res
  })
  .then(() => {
    //console.log(eventLinks)
    eventLinks.forEach(function (item) {
      nightmare
        .goto(item)
        .wait('body')
        .evaluate(() => {

          var date = document.querySelector('#txt_ref_int_date_2'),
            departement = document.querySelector('#txt_ref_int_dpt_2'),
            lieu = document.querySelector('#txt_ref_int_lieu_2'),
            nomRando = document.querySelector('#txt_ref_int_nom_2'),
            organisateur = document.querySelector('#txt_ref_int_organisateur_2'),
            lieuRdv = document.querySelector('#txt_ref_int_ldrdv_2'),
            horaire = document.querySelector('#txt_ref_int_horaires_2'),
            site = document.querySelector('#txt_ref_int_site_2'),
            prixPublic = document.querySelector('#txt_ref_int_prix2 > textarea'),
            prixClub = document.querySelector('#txt_ref_int_prix4 > textarea'),
            contact = document.querySelector('#txt_ref_int_contacttxt > textarea'),
            description = document.querySelector('#txt_ref_int_decription > textarea'),
            tract = document.querySelector('#tract > a')    

          return {
            date : date.textContent ,
            departement : departement.textContent ,
            lieu : lieu.textContent ,
            nomRando : nomRando.textContent ,
            organisateur : organisateur.textContent ,
            lieuRdv : lieuRdv.textContent ,
            horaire : horaire.textContent ,
            site : site.textContent ,
            prixPublic : prixPublic.textContent ,
            prixClub : prixClub.textContent ,
            contact : contact.textContent ,
            description : description.textContent ,
            tract : tract.textContent ,
          }
        })
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          console.error('Search failed:', error);
        });
    }) 
  })

console.log('server run')