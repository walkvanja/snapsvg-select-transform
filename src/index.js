import "./styles.css";
import snap from "snapsvg";
import * as opentype from "opentype.js";

const paper = snap("#app");

//image as SVG
snap.load("https://rough-spoonbill.glitch.me/ringing-phone.svg", function (phone) {
  const svg = phone.select("svg");
  paper.append(svg);
  svg.attr({
    x: 10,
    y: 100,
    xmlns: ""
  });
});

//load external images
//svg
paper.image(
  "https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/w3c.svg",
  400,
  210,
  100,
  75
);
//jpg
paper
  .image("https://live.staticflickr.com/5088/5369007341_5c6312d3b8.jpg")
  .transform("t340,260s0.3r30");

//legacy geometric figure
const gradient = paper.gradient("r()#f00-#f80");
paper.circle(300, 60, 50).attr({
  fill: gradient,
  stroke: "#000",
  strokeWidth: 5
});

//add ttf font from Google Fonts as vector font
//api key : AIzaSyBx_hIU8hXKgoZnZolw7sxKcn9P87gqhzE
const getFontUrl = async (fontName) => {
  return await fetch(
    "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBx_hIU8hXKgoZnZolw7sxKcn9P87gqhzE"
  )
    .then(res => res.json())
    .then(res => res.items.find(font => font.family === fontName))
    .then(res => res.files.regular)
    .then(res => res.replace("http:", "https:")); //remove `http:`
};

const getPath = async (text, url) => {
  return new Promise((resolve, reject) => {
    opentype.load(url, (err, font) => {
      if (err) {
        console.log(err, font);
        reject(err);
        return;
      }
      resolve(font.getPath(text).toSVG());
    });
  });
};

const drawVectorFont = async (text, fontName) => {
  const vectorText = await getPath(text, await getFontUrl(fontName));
  const vectorTextEl = snap.parse(vectorText).select("path");
  paper.append(vectorTextEl);
  vectorTextEl.transform("t310,200");
};

drawVectorFont("Sofia", "Sofia");

//legacy <text> (woff font)
paper.text(300, 220, "Baloo Bhai").attr({
  "font-family": "Baloo Bhai"
});
