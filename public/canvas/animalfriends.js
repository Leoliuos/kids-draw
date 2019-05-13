const theme = "circus";
console.log(theme);

const bg = document.getElementById("bg");
bg.src = "/images/background_" + theme + ".jpg";

const bottomleft = document.getElementById("bottomleft");
const bottomleftalt = document.getElementById("bottomleft_alt");
const bottom = document.getElementById("bottom");
const bottomalt = document.getElementById("bottom_alt");
const bottomright = document.getElementById("bottomright");
const bottomrightalt = document.getElementById("bottomright_alt");
const topright = document.getElementById("topright");
const walker = document.getElementById("walker");
const walkeralt = document.getElementById("walker_alt");
const fly = document.getElementById("fly");

const imagepath = "/images/animals/" + theme + "_";
const format = ".png";

bottomleft.src = imagepath + bottomleft.id + format;
bottomleftalt.src = imagepath + bottomleftalt.id + format;
bottom.src = imagepath + bottom.id + format;
bottomalt.src = imagepath + bottomalt.id + format;
bottomright.src = imagepath + bottomright.id + format;
bottomrightalt.src = imagepath + bottomrightalt.id + format;
topright.src = imagepath + topright.id + format;
walker.src = imagepath + walker.id + format;
walkeralt.src = imagepath + walkeralt.id + format;
fly.src = imagepath + fly.id + format;

// Image paths set up

const audio = document.getElementById("music");
if (theme != "circus") {
    audio.src = "/sounds/music_david_gwyn_jones_singing_away_instrumental.mp3";
}
// start music with delay perhaps ?
audio.play();
