#NodeJS NightmareJS Scrapper
Build for create JSON files API form différents calendar.

###Structure final API

event = {
        date : date ,
        departement : departement ,
        lieu : lieu ,
        eventName : eventName ,
        organisateur : organisateur ,
        lieuRdv : lieuRdv ,
        horaire : horaire ,
        site : site ,
        prixPublic : prixPublic ,
        prixClub : prixClub ,
        contact : contact ,
        description : description ,
        tract : tract 
      }

###VTT config
App.js id : crawlerOne & scrapperOne

- go to "./init_crawler" to add URL to crawl

###Athle config
App.js id : crawlerTwo & scrapperTwo
- go to "./init_crawler"  to add URL to crawl

####Athle Year Change
- go to "./routes/scrapper/athle_scrapper.js"
- change line 32 : scrapper.date = data.date + '/20##'

###Tri config
App.js id : crawlerThree
- go to "https://docs.google.com/spreadsheets/d/1YRpDHTWW4KRJWkz3FRkez_hE0lnxN4sb7y5ooHkNTMc/edit#gid=1046032878"  then change file "https://docs.google.com/spreadsheets/d/1WhHLr-yWunRheWVMUU2Dj567fUhQYgNkvopoB5DjlxQ/edit?usp=sharing" 

####Tri Year Change
- go to "./routes/crawler/tri_crawler.js"
- change line 20 : date : $($('tr')[i].children[1]).text() + "/20##",

