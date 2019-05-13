const theme = "forest";
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

// Image paths set up

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

// Image sizing, original pixel sizes * adjusted scale
const circusscale = 1.5;
const imgsizes = {
    forest: {
        bottomleft: [2144, 3219],
        bottomleftalt: [1957, 1387],
        bottom: [1206, 2547],
        bottomalt: [990, 1471],
        bottomright: [2193, 1738],
        bottomrightalt: [1114, 1362],
        topright: [1479, 2224],
        walker: [552, 513],
        walkeralt: [947, 746],
        fly: [467, 379]
    },
    autumn: {
        bottomleft: [1649, 1569],
        bottomleftalt: [1327, 1238],
        bottom: [812, 797],
        bottomalt: [749, 1228],
        bottomright: [1360, 1209],
        bottomrightalt: [1071, 994],
        topright: [797, 1336],
        walker: [811, 641],
        walkeralt: [868, 1193],
        fly: [610, 755]
    },
    circus: {
        bottomleft: [1238 * circusscale, 1615 * circusscale],
        bottomleftalt: [1890, 2247],
        bottom: [831 * circusscale, 1269 * circusscale],
        bottomalt: [993 * circusscale, 1482 * circusscale],
        bottomright: [947 * circusscale, 1532 * circusscale],
        bottomrightalt: [1944, 2065],
        topright: [1289 * circusscale, 987 * circusscale],
        walker: [487, 569],
        walkeralt: [596, 505],
        fly: [518, 425]
    }
};

// Image sizing / 10

bottomleft.width = imgsizes[theme].bottomleft[0] / 10;
bottomleftalt.width = imgsizes[theme].bottomleftalt[0] / 10;
bottom.width = imgsizes[theme].bottom[0] / 10;
bottomalt.width = imgsizes[theme].bottomalt[0] / 10;
bottomright.width = imgsizes[theme].bottomright[0] / 10;
bottomrightalt.width = imgsizes[theme].bottomrightalt[0] / 10;
topright.width = imgsizes[theme].topright[0] / 10;
walker.width = imgsizes[theme].walker[0] / 10;
walkeralt.width = imgsizes[theme].walkeralt[0] / 10;
fly.width = imgsizes[theme].fly[0] / 10;

// audio

var music = document.getElementById("music");

if (theme != "circus") {
    music.src = "/sounds/music_david_gwyn_jones_singing_away_instrumental.mp3";
} else {
    music.src = "/sounds/audio_hero_Merry-Go-Round_SIPML_Q-0145.mp3";
}
window.addEventListener("click", function() {
    if (music.paused) {
        music.play();
    }
});
