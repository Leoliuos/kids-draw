console.log("ready to go");

const c = document.getElementById("drawboard");
const but = document.getElementById("btnsend");

const ctx = c.getContext("2d");

let toggle = false;

let coordlastframe = [0, 0];

let lastbigwidth = 0;
let lastsmallwidth = 0;
// Kids Draw canvas by Leo Lipasti

// these are shades from royalblue to white for ballpoint pen
const ballpointshadesblue = [
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
const ballpointshadesblack = [
    "#000000",
    "#181818",
    "#303030",
    "#404040",
    "#505050",
    "#606060",
    "#888888",
    "#B0B0B0"
];

let ballpointshades = ballpointshadesblack;

var mousecoordMoved = [0, 0];

c.addEventListener("mousedown", function(event) {
    mousecoordMoved = [
        event.clientX - event.currentTarget.offsetLeft,
        event.clientY - event.currentTarget.offsetTop
    ];
    toggle = true;
    // clamping the pressure value to half to reduce too think lines in the middle :
    penpressure = 6;
});

c.addEventListener("mouseup", function(event) {
    if (
        Math.abs(
            Math.hypot(
                Math.abs(
                    event.clientX -
                        event.currentTarget.offsetLeft -
                        mousecoordMoved[0]
                ),
                Math.abs(
                    event.clientY -
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
        ctx.strokeStyle = "royalblue";
        ctx.lineCap = "round";
        ctx.lineWidth = 3.5;
        ctx.stroke();
    }
    toggle = false;
    coordlastframe = [0, 0];
});

c.addEventListener("mouseleave", function(event) {
    toggle = false;
    coordlastframe = [0, 0];
});

c.addEventListener("mousemove", function(event) {
    if (toggle) {
        mousecoord = [
            event.clientX - event.currentTarget.offsetLeft,
            event.clientY - event.currentTarget.offsetTop
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
        let vectorlen = Math.hypot(
            Math.abs(mousecoord[0] - coordlastframe[0]),
            Math.abs(mousecoord[1] - coordlastframe[1])
        );
        // 1.4142... is just a number that came up often while moving really slow with my mouse
        // seemed like a good zero state in this case but could be anything, just a value to clamp lowest values to
        let bigwidth =
            3 - Math.min(Math.max(vectorlen - 1.4142135623730951, 0), 6) / 2;
        // smooths size change per frame 1/4 on the new pressure & penpressure :
        bigwidth = Math.min((bigwidth + lastbigwidth * 3) / 4, penpressure);
        let smallwidth =
            1.75 - Math.min(Math.max(vectorlen - 1.4142135623730951, 0), 2) / 2;
        // smooths size change per frame 1/3 on the new pressure & penpressure :
        smallwidth = Math.min(
            (smallwidth + lastsmallwidth * 2) / 3,
            penpressure
        );
        lastbigwidth = bigwidth;
        lastsmallwidth = smallwidth;
        // END OF // LINE WIDTHS // LINE WIDTHS // LINE WIDTHS

        // Royal blue shades by vector length
        let shadeselect = Math.min(
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
});
