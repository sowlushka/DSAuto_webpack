const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const puppeteer = require('puppeteer');

// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = express.urlencoded({extended: false});

const PORT = 3000;

const app = express();
const config = require("./webpack/webpack.dev.js");
const compiler = webpack(config);

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

app.use(
  webpackHotMiddleware(compiler, {
    path: "/__what",
    heartbeat: 10 * 1000,
  })
);

app.listen(PORT, function () {
  console.log(`App listening on port ${PORT}\n`);
});

// POST method route
  app.post('/', urlencodedParser, async function(req, res) {
    
    const urls = JSON.parse(req.body.urls);
    let mass=await getSiteDSAutoData(urls);

    console.log(mass);
    res.send(JSON.stringify ({mass:mass}));
});

async function getSiteDSAutoData(urls){
  const browser=await puppeteer.launch({headless: true});

  //Подгружаем информацию по нашему массиву ссылок
  const page = await browser.newPage();
  await page.goto(urls[0]);
  await page.waitForSelector('.catal-descr_descr');
  let mass=await page.evaluate(
      ()=>document.querySelector('main').innerHTML.match(/(?<=weight.*?>)\d+\.?\d*(?=\skg<)/si)[0]);

  await browser.close();
  return mass;
}