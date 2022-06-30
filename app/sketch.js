/* ##### App Variables ##### */
var mainCanvas;
var xBorder = $(window).width()*0.8;
var yBorder = $(window).height();
var polyPoints = 20;
var polyRadius = minimum(xBorder, yBorder)*0.4;
var curveStrength = 2.5;
var labelDist = 1.08;

/* ##### App Functions ##### */
function minimum(a, b) {
    if (a < b) {
        return a;
    } else {
        return b;
    }
}


function getDotX(d) {
    var angle = TWO_PI / polyPoints;
    return 0.5*xBorder + (cos(angle*d) * polyRadius);
}

function getDotY(d) {
    var angle = TWO_PI / polyPoints;
    return 0.5*yBorder + (sin(angle*d) * polyRadius);
}

function getCurveX(d) {
    var angle = TWO_PI / polyPoints;
    return 0.5*xBorder + (cos(angle*d) * (polyRadius*curveStrength));
}

function getCurveY(d) {
    var angle = TWO_PI / polyPoints;
    return 0.5*yBorder + (sin(angle*d) * (polyRadius*curveStrength));
}

function createDot(x,y,r) {
    noStroke();
    fill('rgba(200,169,169,0.5)');
    circle(x, y, r);
}

function polygon(radius, npoints) {
    var angle = TWO_PI / npoints;
    for (let a = 0; a < TWO_PI; a += angle) {
        var sx = 0.5*xBorder + (cos(a) * radius);
        var sy = 0.5*yBorder + (sin(a) * radius);
        createDot(sx, sy, 10);
    }
}

function labelPolygon(radius, npoints) {
    var angle = TWO_PI / npoints;
    for (let i = 0; i < npoints; i += 1) {
        var sx = 0.5*xBorder + (cos(angle*i) * (radius*labelDist));
        var sy = 0.5*yBorder + (sin(angle*i) * (radius*labelDist));
        text(i+1, sx, sy);;
    }
}

function drawCycle(cycle) {
    stroke(153);
    noFill();
    for (let i = 0; i < cycle.length - 1; i++) {
        curve(getCurveX(cycle[i]), getCurveY(cycle[i]), getDotX(cycle[i]), getDotY(cycle[i]), getDotX(cycle[i+1]), getDotY(cycle[i+1]), getCurveX(cycle[i+1]), getCurveY(cycle[i+1]));
    }
    curve(getCurveX(cycle[cycle.length - 1]), getCurveY(cycle[cycle.length - 1]), getDotX(cycle[cycle.length - 1]), getDotY(cycle[cycle.length - 1]), getDotX(cycle[0]), getDotY(cycle[0]), getCurveX(cycle[0]), getCurveY(cycle[0]));
}

function update() {
    polyPoints = $("#polyPoints").val();
    xBorder = $(window).width()*0.8;
    yBorder = $(window).height();
}

/* ##### p5 Functions ##### */
function setup() {
    mainCanvas = createCanvas(xBorder, yBorder);
    mainCanvas.parent("appScreen")
}

function draw() {
    background(255);
    update();

    push();
    labelPolygon(polyRadius, polyPoints)
    polygon(polyRadius, polyPoints);
    pop();
    
    cycle1 = [0,2,4,6,8,10,12,14,16,18];
    cycle2 = [1,3,5,7,9,11,13,15,17,19];
    
    drawCycle(cycle1);
    drawCycle(cycle2);
    

}