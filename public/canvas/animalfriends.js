(function() {
    var theme = "forest";

    var imageindex = document.location.pathname.split("/")[3];

    if (parseInt(imageindex) % 3 === 0) {
        theme = "circus";
    } else if (parseInt(imageindex) % 3 === 1) {
        theme = "autumn";
    }

    var bg = document.getElementById("bg");
    bg.classList.add(theme);

    var bottomleft = document.getElementById("bottomleft");
    var bottomleftalt = document.getElementById("bottomleft_alt");
    var bottom = document.getElementById("bottom");
    var bottomalt = document.getElementById("bottom_alt");
    var bottomright = document.getElementById("bottomright");
    var bottomrightalt = document.getElementById("bottomright_alt");
    var topright = document.getElementById("topright");
    var walker = document.getElementById("walker");
    var walkeralt = document.getElementById("walker_alt");
    var fly = document.getElementById("fly");

    var characters = [
        bottomleft,
        bottomleftalt,
        bottom,
        bottomalt,
        bottomright,
        bottomrightalt,
        topright,
        walker,
        walkeralt,
        fly
    ];

    // Image paths set up

    var imagepath = "/images/animals/" + theme + "_";
    var format = ".png";

    for (var i = 0; i < characters.length; i++) {
        characters[i].src = imagepath + characters[i].id + format;
    }

    // Image sizing, original pixel sizes * adjusted scale
    var circusscale = 1.5;
    var imgsizes = {
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
        music.src =
            "/sounds/music_david_gwyn_jones_singing_away_instrumental.mp3";
    } else {
        music.src = "/sounds/audio_hero_Merry-Go-Round_SIPML_Q-0145.mp3";
    }

    window.addEventListener("click", function musicPlay() {
        if (music.paused) {
            music.play();
            window.removeEventListener("click", musicPlay);
        }
    });

    var nexttimeout = setTimeout(movetoScreen, 9000);
    var i = 0;
    function movetoScreen() {
        characters[i].classList.add("destination");
        if (
            characters[i].id === "walker" ||
            characters[i].id === "walker_alt" ||
            characters[i].id === "fly"
        ) {
            nexttimeout = setTimeout(returnPosition, 13000);
        } else {
            nexttimeout = setTimeout(returnPosition, 3000);
        }

        i++;
        if (i > characters.length - 1) {
            i = 0;
        }
    }

    function returnPosition() {
        for (var i = 0; i < characters.length; i++) {
            characters[i].classList.remove("destination");
        }
        clearTimeout(nexttimeout);
        nexttimeout = setTimeout(movetoScreen, 19000);
    }
})();
