(function() {
    var c = document.getElementById("drawboard");

    var dingsound = document.getElementById("ding");

    var userkey = document.location.pathname.split("/")[2];
    var imageindex = document.location.pathname.split("/")[3];
    var storagekey = userkey + imageindex;

    var ctx = c.getContext("2d");
    ctx.canvas.width = Math.min(document.body.clientWidth * 0.8, 1754);
    ctx.canvas.height = Math.min(document.body.clientWidth * 0.8 * 0.7, 1240);
    c.style.marginLeft = document.body.clientWidth * 0.1 + "px";
    c.style.marginTop = document.body.clientWidth * 0.025 + "px";

    ctx.beginPath();
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "white";
    ctx.fill();

    checkversions = localStorage.getItem(userkey + imageindex);

    if (checkversions) {
        var image = new Image();
        image.onload = function() {
            ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);
        };
        image.src = checkversions;
    }

    var toggle = false;

    var coordlastframe = [0, 0];

    var lastbigwidth = 0;
    var lastsmallwidth = 0;
    // Kids Draw canvas by Leo Lipasti

    // these are shades from royalblue to white for ballpoint pen
    var ballpointshadesblue = [
        "#4169e1",
        "#5276e3",
        "#6384e6",
        "#7491e9",
        "#869feb",
        "#97adee",
        "#b9c8f4",
        "#dce3f9"
    ];
    // brush
    var brushshadesblue = [
        "rgba(65,105,225,0.2)",
        "rgba(82,118,227,0.19)",
        "rgba(99,132,230,0.18)",
        "rgba(116,145,233,0.17)",
        "rgba(134,159,235,0.15)",
        "rgba(151,173,238,0.12)",
        "rgba(185,200,244,0.10)",
        "rgba(220,227,249,0.09)"
    ];

    // these are shades for black ballpoint pen
    var ballpointshadesblack = [
        "#000000",
        "#181818",
        "#303030",
        "#404040",
        "#505050",
        "#606060",
        "#888888",
        "#B0B0B0"
    ];
    // brush
    var brushpointshadesblack = [
        "rgba(0,0,0,0.2)",
        "rgba(24,24,24,0.19)",
        "rgba(48,48,48,0.18)",
        "rgba(64,64,64,0.17)",
        "rgba(80,80,80,0.15)",
        "rgba(96,96,96,0.12)",
        "rgba(136,136,136,0.10)",
        "rgba(176,176,176,0.09)"
    ];

    // these are shades for red ballpoint pen
    var ballpointshadesred = [
        "#ff2819",
        "#f22a1d",
        "#f23326",
        "#f2453a",
        "#f25248",
        "#ef5f56",
        "#ed7068",
        "#ef837c"
    ];

    var brushshadesred = [
        "rgba(255,40,25,0.2)",
        "rgba(242,42,29,0.19)",
        "rgba(242,51,38,0.18)",
        "rgba(242,69,58,0.17)",
        "rgba(242,82,72,0.15)",
        "rgba(239,95,86,0.12)",
        "rgba(237,112,104,0.10)",
        "rgba(239,131,124,0.09)"
    ];

    // these are shades for green ballpoint pen
    var ballpointshadesgreen = [
        "#00d60d",
        "#06d813",
        "#0ddd1a",
        "#16e223",
        "#24e531",
        "#34e540",
        "#4ce857",
        "#61ed6b"
    ];
    // brush
    var brushshadesgreen = [
        "rgba(0,241,13,0.2)",
        "rgba(6,216,19,0.19)",
        "rgba(13,221,26,0.18)",
        "rgba(22,226,35,0.17)",
        "rgba(36,229,49,0.15)",
        "rgba(52,229,64,0.13)",
        "rgba(76,232,87,0.10)",
        "rgba(97,237,107,0.09)"
    ];

    // these are shades for white ballpoint pen
    var ballpointshadeswhite = [
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF"
    ];
    // brush
    var brushpointshadeswhite = [
        "rgba(255,255,255,0.2)",
        "rgba(255,255,255,0.19)",
        "rgba(255,255,255,0.18)",
        "rgba(255,255,255,0.17)",
        "rgba(255,255,255,0.15)",
        "rgba(255,255,255,0.13)",
        "rgba(255,255,255,0.10)",
        "rgba(255,255,255,0.09)"
    ];

    var ballpointshades = ballpointshadesblack;

    var mousecoordMoved = [0, 0];

    // TOOLS // TOOLS // TOOLS

    var pen1 = document.getElementById("tool-pen1");
    var pen2 = document.getElementById("tool-pen2");
    var pen3 = document.getElementById("tool-pen3");
    var pen4 = document.getElementById("tool-pen4");
    var pen5 = document.getElementById("tool-pen5");
    var brush1 = document.getElementById("tool-brush1");
    var brush2 = document.getElementById("tool-brush2");
    var brush3 = document.getElementById("tool-brush3");
    var brush4 = document.getElementById("tool-brush4");
    var brush5 = document.getElementById("tool-brush5");
    var pastel1 = document.getElementById("tool-pastel1");
    var pastel2 = document.getElementById("tool-pastel2");
    var pastel3 = document.getElementById("tool-pastel3");
    var pastel4 = document.getElementById("tool-pastel4");
    var pastel5 = document.getElementById("tool-pastel5");
    var pastel6 = document.getElementById("tool-pastel6");
    var pastel7 = document.getElementById("tool-pastel7");
    var pastel8 = document.getElementById("tool-pastel8");
    var eraser1 = document.getElementById("tool-eraser1");
    var eraser2 = document.getElementById("tool-eraser2");
    var bell = document.getElementById("tool-bell");

    var size1 = document.getElementById("tool-paintsize1");
    var size2 = document.getElementById("tool-paintsize2");
    var size3 = document.getElementById("tool-paintsize3");

    var toolbox = document.getElementById("tools");

    var brush = 1;
    var blocksize = 0;
    var cap = "round";
    var paintsize = 1;

    pen1.addEventListener("click", function(event) {
        pens();
        ballpointshades = ballpointshadesblack;
    });

    pen2.addEventListener("click", function(event) {
        pens();
        ballpointshades = ballpointshadesred;
    });

    pen3.addEventListener("click", function(event) {
        pens();
        ballpointshades = ballpointshadesgreen;
    });

    pen4.addEventListener("click", function(event) {
        pens();
        ballpointshades = ballpointshadesblue;
    });

    pen5.addEventListener("click", function(event) {
        pens();
        ballpointshades = ballpointshadeswhite;
    });

    brush1.addEventListener("click", function(event) {
        brushes();
        ballpointshades = brushpointshadesblack;
    });

    brush2.addEventListener("click", function(event) {
        brushes();
        ballpointshades = brushshadesred;
    });

    brush3.addEventListener("click", function(event) {
        brushes();
        ballpointshades = brushshadesgreen;
    });

    brush4.addEventListener("click", function(event) {
        brushes();
        ballpointshades = brushshadesblue;
    });

    brush5.addEventListener("click", function(event) {
        brushes();
        ballpointshades = brushshadeswhite;
    });

    pastel1.addEventListener("click", function(event) {
        pastels();
        ballpointshades = ballpointshadesblack;
    });

    pastel2.addEventListener("click", function(event) {
        pastels();
        ballpointshades = ballpointshadesred;
    });

    pastel3.addEventListener("click", function(event) {
        pastels();
        ballpointshades = ballpointshadesgreen;
    });

    pastel4.addEventListener("click", function(event) {
        pastels();
        ballpointshades = ballpointshadesblue;
    });

    pastel5.addEventListener("click", function(event) {
        pastels();
        ballpointshades = ballpointshadeswhite;
    });

    pastel6.addEventListener("click", function(event) {
        pastels();
        ballpointshades = ballpointshadeswhite;
    });

    pastel7.addEventListener("click", function(event) {
        pastels();
        ballpointshades = ballpointshadeswhite;
    });

    pastel8.addEventListener("click", function(event) {
        pastels();
        ballpointshades = ballpointshadeswhite;
    });

    size1.addEventListener("click", function(event) {
        paintsize = 1;
        toolbox.classList.remove("showtools");
    });

    size2.addEventListener("click", function(event) {
        paintsize = 2;
        toolbox.classList.remove("showtools");
    });

    size3.addEventListener("click", function(event) {
        paintsize = 3;
        toolbox.classList.remove("showtools");
    });

    function pastels() {
        brush = 4;
        blocksize = 2;
        toolbox.classList.remove("showtools");
        cap = "butt";
    }

    function brushes() {
        brush = 3;
        blocksize = 0;
        toolbox.classList.remove("showtools");
        cap = "round";
    }

    function pens() {
        brush = 1;
        blocksize = 0;
        toolbox.classList.remove("showtools");
        cap = "round";
    }

    eraser1.addEventListener("click", function(event) {
        brush = 4;
        blocksize = 3;
        ballpointshades = ballpointshadeswhite;
        toolbox.classList.remove("showtools");
        cap = "butt";
    });

    eraser2.addEventListener("click", function(event) {
        brush = 5;
        blocksize = 6;
        ballpointshades = ballpointshadeswhite;
        toolbox.classList.remove("showtools");
        cap = "butt";
    });

    var dingclicks = 0;
    bell.addEventListener("click", function(event) {
        ding.play();
        dingclicks++;
        var endtimeout = setTimeout(endNow, 2500);
    });

    function endNow() {
        // load page
        if (dingclicks > 1) {
            window.location.href = "/view";
        } else {
            dingclicks = 0;
        }
    }

    // TOOLS // TOOLS // TOOLS

    document.addEventListener("mousedown", function(event) {
        if (event.target.id == "") {
            toolbox.classList.add("showtools");
        }
    });

    document.addEventListener("touchstart", function(event) {
        event.preventDefault();
        if (event.target.id == "") {
            toolbox.classList.add("showtools");
        }
    });

    c.addEventListener("mousedown", function(event) {
        touchFunction(event, event);
    });
    c.addEventListener("touchstart", function(event) {
        // preventing mouse event
        event.preventDefault();
        touchFunction(event.changedTouches[0], event);
    });

    var touchFunction = function(touchevent, event) {
        //var event = ;
        mousecoordMoved = [
            touchevent.clientX - event.currentTarget.offsetLeft,
            touchevent.clientY - event.currentTarget.offsetTop
        ];
        toggle = true;
        // clamping the pressure value to half to reduce too think lines in the middle :
        penpressure = 6;
    };

    c.addEventListener("mouseup", function(event) {
        releaseFunction(event, event);
    });
    c.addEventListener("touchend", function(event) {
        // preventing mouse event
        event.preventDefault();
        releaseFunction(event.changedTouches[0], event);
    });

    var releaseFunction = function(touchevent, event) {
        if (
            Math.abs(
                Math.hypot(
                    Math.abs(
                        touchevent.clientX -
                            event.currentTarget.offsetLeft -
                            mousecoordMoved[0]
                    ),
                    Math.abs(
                        touchevent.clientY -
                            event.currentTarget.offsetTop -
                            mousecoordMoved[1]
                    )
                ) < 0.1
            )
        ) {
            // mouse did not move much, therefore creating a dot .
            ctx.beginPath();
            ctx.moveTo(mousecoordMoved[0], mousecoordMoved[1]);
            ctx.lineTo(mousecoordMoved[0] + 1, mousecoordMoved[1] + 1);
            ctx.strokeStyle = ballpointshades[0];
            ctx.lineCap = cap;
            ctx.lineWidth = 3.5;
            ctx.stroke();
        }
        toggle = false;
        coordlastframe = [0, 0];
        var dataURL = c.toDataURL();
        localStorage.setItem(storagekey, dataURL);
    };

    c.addEventListener("mouseleave", function(event) {
        toggle = false;
        coordlastframe = [0, 0];
        var dataURL = c.toDataURL();
        localStorage.setItem(storagekey, dataURL);
    });
    c.addEventListener("touchcancel", function(event) {
        // preventing mouse event
        event.preventDefault();
        toggle = false;
        coordlastframe = [0, 0];
        var dataURL = c.toDataURL();
        localStorage.setItem(storagekey, dataURL);
    });

    c.addEventListener("mousemove", function(event) {
        moveFunction(event, event);
    });
    c.addEventListener("touchmove", function(event) {
        // preventing mouse event
        event.preventDefault();
        moveFunction(event.changedTouches[0], event);
    });

    var moveFunction = function(touchevent, event) {
        if (toggle) {
            mousecoord = [
                touchevent.clientX - event.currentTarget.offsetLeft,
                touchevent.clientY - event.currentTarget.offsetTop
            ];
            ctx.beginPath();
            if (coordlastframe[0] === 0 && coordlastframe[1] === 0) {
                ctx.moveTo(mousecoord[0], mousecoord[1]);
            } else {
                ctx.moveTo(coordlastframe[0], coordlastframe[1]);
            }
            ctx.lineTo(mousecoord[0], mousecoord[1]);

            // START OF // LINE WIDTHS // LINE WIDTHS // LINE WIDTHS
            // pen pressure drops or ink runs down, either way, pressure falls each frame, Min value 1.5
            penpressure = Math.max(penpressure - 0.05, 1.5);
            // mouse movement vector length per frame. Using it to determine line size. Faster = thinner line
            var vectorlen = Math.hypot(
                Math.abs(mousecoord[0] - coordlastframe[0]),
                Math.abs(mousecoord[1] - coordlastframe[1])
            );
            // 1.4142... is just a number that came up often while moving really slow with my mouse
            // seemed like a good zero state in this case but could be anything, just a value to clamp lowest values to
            var bigwidth =
                (3 -
                    (Math.min(Math.max(vectorlen - 1.4142135623730951, 0), 6) /
                        2) *
                        brush +
                    blocksize) *
                paintsize;
            // smooths size change per frame 1/4 on the new pressure & penpressure :
            bigwidth =
                Math.min(
                    ((bigwidth + lastbigwidth * 3) / 4) * brush,
                    penpressure * brush + blocksize
                ) * paintsize;
            var smallwidth =
                (1.75 -
                    (Math.min(Math.max(vectorlen - 1.4142135623730951, 0), 2) /
                        2) *
                        brush +
                    blocksize) *
                paintsize;
            // smooths size change per frame 1/3 on the new pressure & penpressure :
            smallwidth =
                Math.min(
                    ((smallwidth + lastsmallwidth * 2) / 3) * brush,
                    penpressure * brush + blocksize
                ) * paintsize;
            lastbigwidth = bigwidth;
            lastsmallwidth = smallwidth;
            // END OF // LINE WIDTHS // LINE WIDTHS // LINE WIDTHS

            // shades by vector length
            var shadeselect = Math.min(
                Math.round(vectorlen - 2),
                ballpointshades.length - 1
            );

            ctx.strokeStyle = ballpointshades[shadeselect];
            ctx.lineCap = cap;
            ctx.lineWidth = bigwidth;
            ctx.stroke();
            ctx.beginPath();
            if (coordlastframe[0] === 0 && coordlastframe[1] === 0) {
                ctx.moveTo(mousecoord[0], mousecoord[1]);
            } else {
                ctx.moveTo(coordlastframe[0], coordlastframe[1]);
            }
            ctx.lineTo(mousecoord[0], mousecoord[1]);
            ctx.lineWidth = smallwidth;
            ctx.strokeStyle = ballpointshades[Math.max(shadeselect - 2, 0)];
            ctx.lineCap = cap;
            ctx.stroke();
            coordlastframe = [mousecoord[0], mousecoord[1]];
        } else {
            toggle = false;
        }
    };
})();
