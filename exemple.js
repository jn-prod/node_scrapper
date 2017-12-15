import Nightmare from 'nightmare';
import cheerio from 'cheerio';


let nightmare2 = Nightmare({show: false});
let nightmare3 = Nightmare({show: false});

const urlObject = {
  site1: 'http://www.site1.com',
  site2: 'http://www.site2.com',
  site3: 'http://www.site3.com'
};

export function getScrap(req, res){
  let result = {};

  result.site1 = {
    topList: []
  };
  result.site2 = {
    topList: []
  };
  result.site3 = {
    topList: []
  };

  const pro1 = Promise.resolve(
    nightmare
      .goto(urlObject.site1)
      .wait(200)
      .evaluate(() => {
        console.log('site1 into evaluate');
        return document.querySelector('.ninenine').innerHTML;
      })
      .end()
  )
  .then((html) => {
    let $ = cheerio.load(html);
    let tt = $('.horizontal-li');
    let sections = $(".section-board-title");

    sections.each((index, elm) => {
      if($(elm).text() === 'TopList'){
        $(elm).next('ul').find('li').each((index, elm_li) => {
          let title =$(elm_li).find('.cabinet-instruction').text();
          let price =$(elm_li).find('.cabinet-middle .price').text();
          let imgSrc = $(elm_li).find('.cabinet-img').attr('data-temp-src');
          if(title !== '' && price !==''){
            result.site1.topList.push({
              title,
              price,
              imgSrc
            });
          }
        });
      }
    });
  })
  .catch((err) => {
    console.log('site1 scrap err:', err);
    return res.status(400).send({reason:'site1 scrap err'});
  });

  const pro2 = Promise.resolve(
    nightmare2
      .goto(urlObject.site2)
      .wait(200)
      .evaluate(() => {
        return document.querySelector('.ninenine').innerHTML;
      })
      .end()
  )
  .then((html) => {
    let $ = cheerio.load(html);
    let tt = $('.horizontal-li');
    let sections = $(".section-board-title");

    sections.each((index, elm) => {
      if($(elm).text() === 'TopList'){
        $(elm).next('ul').find('li').each((index, elm_li) => {
          let title =$(elm_li).find('.cabinet-instruction').text();
          let price =$(elm_li).find('.cabinet-middle .price').text();
          let imgSrc = $(elm_li).find('.cabinet-img').attr('data-temp-src');
          if(title !== '' && price !==''){
            result.site2.topList.push({
              title,
              price,
              imgSrc
            });
          }
        });
      }
    });
  })
  .catch((err) => {
    console.log('site2 scrap err:', err);
    return res.status(400).send({reason:'site2 scrap err'});
  });

  const pro3 = Promise.resolve(
    nightmare3
      .goto(urlObject.site3)
      .wait(200)
      .evaluate(() => {
        return document.querySelector('#layout').innerHTML;
      })
      .end()
  )
  .then((html) => {
    let $ = cheerio.load(html);
    let sections = $(".pditem");

    sections.each((index, elm) => {

      let title = $(elm).find('.name').text();
      let price = $(elm).find('.price').find('span').eq(1).text();
      let imgSrc = ['www.site3.com',$(elm).find('li').eq(1).find('img').attr('src')].join('');

      result.site3.topList.push({
        title,
        price,
        imgSrc
      });
    });
  })
  .catch((err) => {
    console.log('site3 scrap err:', err);
    return res.status(400).send({reason:'site3 scrap err'});
  });


  Promise.all([pro1, pro2, pro3])
  .then(values => {
    res.json(result);
  })
  .catch((err) => {
    return res.status(500).send({reason:err.toString()});
  });
}