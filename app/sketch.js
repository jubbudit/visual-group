/* ##### App Variables ##### */
var mainCanvas;
var xBorder = $(window).width()*0.8;
var yBorder = $(window).height()*0.9;
var polyPoints = 20;
var polyRadius = minimum(xBorder, yBorder)*0.4;
var curveStrength = 2.5;
var labelDist = 1.08;
var power = 1;
//var color1 = color("red");
//var color2 = color("blue");

/* ##### App Functions ##### */
function minimum(a, b) {
    if (a < b) {
        return a;
    } else {
        return b;
    }
}

function listRemove(val, ary) {
    if (ary.indexOf(val) > -1) {
        return 0;
    }
    return ary.splice(ary.indexOf(val), 1);
    return 1;
}

function getDotX(d) {
    var angle = TWO_PI / polyPoints;
    return 0.5*xBorder + (cos(angle*d) * polyRadius);
}

function getDotY(d) {
    var angle = TWO_PI / polyPoints;
    return 0.5*yBorder + (sin(angle*d) * polyRadius);
}

function getArrowX(d, offset, angle) {
    var angle = TWO_PI / polyPoints;
    return 0.5*xBorder + (cos(angle*(d+angle)) * polyRadius*(1+offset));
}

function getArrowY(d, offset, angle) {
    var angle = TWO_PI / polyPoints;
    return 0.5*yBorder + (sin(angle*(d+angle)) * polyRadius*(1+offset));
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
    stroke(0);
    var angle = TWO_PI / npoints;
    for (let i = 0; i < npoints; i += 1) {
        var sx = 0.5*xBorder + (cos(angle*i) * (radius*labelDist));
        var sy = 0.5*yBorder + (sin(angle*i) * (radius*labelDist));
        text(i+1, sx, sy);
    }
}

function pointList(npoints) {
    cycle = [];
    for (let i = 0; i < npoints; i++) {
        cycle.push(i);
    }
    return cycle;
}

function drawCycle(cycle, color) {
    stroke(color);
    noFill();
    for (let i = 0; i < cycle.length - 1; i++) {
        curve(getCurveX(cycle[i]), getCurveY(cycle[i]), getDotX(cycle[i]), getDotY(cycle[i]), getDotX(cycle[i+1]), getDotY(cycle[i+1]), getCurveX(cycle[i+1]), getCurveY(cycle[i+1]));
    }
    curve(getCurveX(cycle[cycle.length - 1]), getCurveY(cycle[cycle.length - 1]), getDotX(cycle[cycle.length - 1]), getDotY(cycle[cycle.length - 1]), getDotX(cycle[0]), getDotY(cycle[0]), getCurveX(cycle[0]), getCurveY(cycle[0]));
}

function drawPermutation(perm) {
    var points = pointList(polyPoints);
    var cycles = []
    while (points.length > 0) {
        var cycle = [];
        var cycStart = points.shift();
        cycle.push(cycStart);
        var cycCurrent = perm[cycStart];
        while (cycCurrent != cycStart) {
            cycle.push(cycCurrent);
            points.splice(points.indexOf(cycCurrent), 1);
            cycCurrent = perm[cycCurrent];
        }
        cycles.push(cycle);
        //console.log(cycle)
    }
    //console.log("hello")
    for (let i = 0; i < cycles.length; i++) {
        drawCycle(cycles[i], lerpColor(color(0,0,0), color(255,255,255), i/cycles.length))
    }
    
}

function permComp(perm1, perm2, npoints) {
    var points = pointList(polyPoints);
    var perm = {};
    while (points.length > 0) {
        var cycStart = points.shift();
        var cycPrev = cycStart;
        var cycCurrent = perm2[perm1[cycStart]];
        while (cycCurrent != cycStart) {
            perm[cycPrev] = cycCurrent;
            var temp = cycCurrent;
            points.splice(points.indexOf(cycCurrent), 1);
            cycCurrent = perm2[perm1[temp]];
            cycPrev = temp;
        }
        //console.log(perm);
        perm[cycPrev] = cycStart;
    }
    return perm;
}

function permPower(perm, power) {
    var newperm = perm;
    for (let i = 1; i < power; i++) {
        newperm = permComp(perm, newperm, polyPoints);
    }
    return newperm;
}

function singleCycle(npoints) {
    perm = {}
    for(let i = 0; i < npoints-1; i++) {
        perm[i] = i+1;
    }
    perm[npoints-1] = 0;
    return perm;
}

function updateVars() {
    polyPoints = $("#polyPoints").html();
    curveStrength = $("#curveStrength").html();
    power = $("#permPower").html();
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
    updateVars();

    push();
    labelPolygon(polyRadius, polyPoints);
    polygon(polyRadius, polyPoints);
    pop();
    
    cyclePerm = singleCycle(polyPoints);
    //drawPermutation(cyclePerm);
    drawPermutation(permPower(cyclePerm, power));
    

}