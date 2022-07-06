const https = require("node:https");
const http = require("http");
const fs = require("fs");
let data = "";
///Function to fload html paga data
function getdataonrequest(cb) {
  https
    .get("https://time.com", (res) => {
      res.on("data", (d) => {
        data += d;
      });
      res.on("end", () => {
        let htmldown = data.split(
          `<div class="partial latest-stories" data-module_name="Latest Stories">`
        ); //Spliting HTML page at Latest News div container
        let maincontent = htmldown[1].toString().split("</section>");
        let maincontentData = maincontent[0]; //This is  only latest news container data container data
        //Processing for news title
        let maindataremovedh3 = maincontentData
          .toString()
          .split(`<h3 class="latest-stories__item-headline">`);
        let backh3 = maindataremovedh3.toString().split(`</h3>`);
        //processing for news link
        let mainDataRemoveaHref = maincontentData.toString().split(`/">`);
        let latestnewsarray = [];
        for (let i = 0; i < backh3.length - 1; i++) {
          let singleNewsObject = {};
          let siglenews = backh3[i].toString().split(`/">`);
          let siglelink = mainDataRemoveaHref[i].toString().split(`<a href="/`);
          let timesplussinglelink = "https://time.com/" + siglelink[1];
          let everynews = siglenews[1].toString().trim();
          singleNewsObject.title = everynews.slice(1);
          singleNewsObject.link = timesplussinglelink;
          latestnewsarray.push(singleNewsObject);
        }
        console.log("data fetching completed");
        fs.writeFile(
          "TIME_LATESTNEWS_HTML.txt",
          maincontentData.toString(),
          function (err) {
            if (err) throw err;
          }
        );
        console.log("data sending to call back function");
        cb(latestnewsarray); //sending data to callback function
      });
    })
    .on("error", (e) => {
      console.error(e);
    });
}
////////////////////////////////////////SERVER///////////////////////////////////////
http
  .createServer(async function (request, response) {
    if (request.url === "/") {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(`<h1>WELCOME TO TIME LATEST NEWS API</h1>`);
      response.end();
    } else if (request.url === "/getTimeStories") {
      console.log("Received request" + " " + request.url);
      ///calling function
      getdataonrequest(function (latestnews) {
        console.log("data received to call back function");
        response.writeHead(200, { "Content-Type": "application/json" });
        response.write(JSON.stringify(latestnews));
        /////
        console.log(latestnews);
        response.end();
      });
    } //else block
  })
  .listen(5000, () => {
    console.log("server started on 5000");
  });
