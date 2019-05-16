(function() {
    var c = document.getElementById("drawboard");

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

    var ballpointshades = ballpointshadesgreen;

    var mousecoordMoved = [0, 0];

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
            ctx.lineCap = "round";
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
                3 -
                Math.min(Math.max(vectorlen - 1.4142135623730951, 0), 6) / 2;
            // smooths size change per frame 1/4 on the new pressure & penpressure :
            bigwidth = Math.min((bigwidth + lastbigwidth * 3) / 4, penpressure);
            var smallwidth =
                1.75 -
                Math.min(Math.max(vectorlen - 1.4142135623730951, 0), 2) / 2;
            // smooths size change per frame 1/3 on the new pressure & penpressure :
            smallwidth = Math.min(
                (smallwidth + lastsmallwidth * 2) / 3,
                penpressure
            );
            lastbigwidth = bigwidth;
            lastsmallwidth = smallwidth;
            // END OF // LINE WIDTHS // LINE WIDTHS // LINE WIDTHS

            // Royal blue shades by vector length
            var shadeselect = Math.min(
                Math.round(vectorlen - 2),
                ballpointshades.length - 1
            );

            ctx.strokeStyle = ballpointshades[shadeselect];
            ctx.lineCap = "round";
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
            ctx.lineCap = "round";
            ctx.stroke();
            coordlastframe = [mousecoord[0], mousecoord[1]];
        } else {
            toggle = false;
        }
    };
})();
