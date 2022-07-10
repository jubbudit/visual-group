/* ##### App Variables ##### */
var mainCanvas;
var xBorder = $(window).width()*0.8;
var yBorder = $(window).height()*0.9;
var polyPoints = 20;
var polyRadius = minimum(xBorder, yBorder)*0.4;
var curveStrength = 2.5;
var labelDist = 1.08;
var power = 1;
var cycleCount = 1;
var cycleType = [20];
var textGenerator = "";
var randomPerm;
var cyclePerm;
var cycleNums = {};
//var color1 = color("red");
//var color2 = color("blue");

/* ##### jQuery Controllers ##### */

$(document).ready(function() {
    $("#generatorSelector").change(function(){
        if ($("#generatorSelector").val() === "custom") {
            $("#customGenerator").removeClass("options-hidden");
            $("#randomButton").addClass("options-hidden");
            
        } else if ($("#generatorSelector").val() === "random") {
            $("#customGenerator").addClass("options-hidden");
            $("#randomButton").removeClass("options-hidden");
        } else {
            $("#customGenerator").addClass("options-hidden");
            $("#randomButton").addClass("options-hidden");
        }
    });
    
    $("#randomize").click(function() {
        randomPerm = randomPermutation(polyPoints);
    });
    
});

function updateRange() {
    var order = calculateLCM(genCycleType());
    $("#permPowerRange").attr('max', order);
}

function aboutModal() {
  $('#aboutModal').modal('show');
}

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

function createDot(x,y,r,c) {
    noStroke();
    fill(0);
    circle(x, y, r);
    fill(c);
    circle(x, y, r*0.8);
}

function polygon(radius, npoints) {
    var angle = TWO_PI / npoints;
    var i = 0;
    for (let a = 0; a < TWO_PI; a += angle) {
        var sx = 0.5*xBorder + (cos(a) * radius);
        var sy = 0.5*yBorder + (sin(a) * radius);
        createDot(sx, sy, minimum(xBorder, yBorder)*0.02, lerpColor(color(0,0,0), color(255,255,255), cycleNums[i]/cycleType.length));
        i++;
    }
}

function labelPolygon(radius, npoints) {
    var angle = TWO_PI / npoints;
    for (let i = 0; i < npoints; i += 1) {
        var sx = 0.5*xBorder + (cos(angle*i) * (radius*labelDist));
        var sy = 0.5*yBorder + (sin(angle*i) * (radius*labelDist));
        
        textStyle(NORMAL);
        stroke(0);
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
    var cycles = [];
    textGenerator = "";
    var cycNum = 0;
    cycleNums = {};
    while (points.length > 0) {
        var cycle = [];
        var cycStart = points.shift();
        cycle.push(cycStart);
        var cycCurrent = perm[cycStart];
        cycleNums[cycStart] = cycNum;
        textGenerator = textGenerator.concat("(", cycStart+1);
        while (cycCurrent != cycStart) {
            cycleNums[cycCurrent] = cycNum;
            textGenerator = textGenerator.concat(", ", cycCurrent+1);
            cycle.push(cycCurrent);
            points.splice(points.indexOf(cycCurrent), 1);
            cycCurrent = perm[cycCurrent];
        }
        textGenerator = textGenerator.concat(")");
        cycles.push(cycle);
        cycNum++;
    }
    cycleCount = cycles.length;
    cycleType = [];
    for (let i = 0; i < cycles.length; i++) {
        cycleType.push(cycles[i].length);
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

function getCycleType() {
    cycleType = cycleType.sort();
    cycleType = cycleType.reverse();
    ret = "(";
    for (let i = 0; i < cycleType.length-1; i++) {
        ret = ret.concat(cycleType[i], ", ");
    }
    return ret.concat(cycleType[cycleType.length-1], ")");
}

function genCycleType() {
    var perm = cyclePerm;
    var points = pointList(polyPoints);
    var cycles = [];
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
    }
    cycType = [];
    for (let i = 0; i < cycles.length; i++) {
        cycType.push(cycles[i].length);
    }
    return cycType;
}

function singleCycle(npoints) {
    perm = {};
    for(let i = 0; i < npoints-1; i++) {
        perm[i] = i+1;
    }
    perm[npoints-1] = 0;
    return perm;
}

function randomElement(li) {
    if (li.length <= 0) {
        return -1
    }
    return li[Math.floor(Math.random()*li.length)];
}

function randomPermutation(npoints) {
    var points = pointList(npoints);
    var perm = {};
    while (points.length > 0) {
        var cycleLength = Math.floor(Math.random()*points.length);
        var cycStart = randomElement(points);
        points.splice(points.indexOf(cycStart), 1);
        if (cycleLength > 1) {
            var cycPrev = cycStart;
            for (let i = 0; i < cycleLength; i++) {
                var cycCurrent = randomElement(points);
                points.splice(points.indexOf(cycCurrent), 1);
                perm[cycPrev] = cycCurrent;
                cycPrev = cycCurrent;
            }
            perm[cycCurrent] = cycStart;
            //points.splice(points.indexOf(cycCurrent), 1);
        } else {
            perm[cycStart] = cycStart;
        }
    }
    
    return perm;
}

function parseGenerator(genVal) {
    if (!genVal) {
        return singleCycle(polyPoints);
    }
    
    var genCycles = genVal.split(/\(([^()]+)\)/);
    if (genCycles.length < 3) {
        return singleCycle(polyPoints);
    }
    
    var points = pointList(polyPoints);
    var perm = singleCycle(polyPoints);
    for (let i = 0; i < genCycles.length; i++) {
        var cycle = genCycles[i].split(",");
        if (cycle.length > 1 && cycle[0] && cycle[1]) {
            var startIndex = parseInt(cycle[0])-1;
            if (points.indexOf(startIndex) < 0) {
                return singleCycle(polyPoints);
            }
            points.splice(points.indexOf(startIndex), 1);
            for (let j = 0; j < cycle.length-1; j++) {
                var fromIndex = parseInt(cycle[j])-1;
                var toIndex = parseInt(cycle[j+1])-1;
                perm[fromIndex] = toIndex;
                if (toIndex < 0) {
                    return singleCycle(polyPoints);
                }
                if (points.indexOf(toIndex) < 0) {
                    return singleCycle(polyPoints);
                }
                points.splice(points.indexOf(toIndex), 1);
            }
            perm[parseInt(cycle[cycle.length-1])-1] = startIndex;
        }
    }
    if (points.length > 0) {
        for (let i = 0; i < points.length; i++) {
            perm[points[i]] = points[i];
        }
    }
    
    return perm;
}

function updateVars() {
    $('#cycles').html(cycleCount);
    $('#cycleType').html(getCycleType());
    $('#order').html(calculateLCM(cycleType));
    $("#groupGen").html(textGenerator);
    polyPoints = $("#polyPoints").html();
    curveStrength = $("#curveStrength").html();
    power = $("#permPower").html();
    xBorder = $(window).width()*0.8;
    yBorder = $(window).height()*0.9;
    polyRadius = minimum(xBorder, yBorder)*0.4;
    labelDist = 1.08;
}

/* ##### p5 Functions ##### */
function windowResized() {
  xBorder = $(window).width()*0.8;
  yBorder = $(window).height()*0.9;
  resizeCanvas(xBorder, yBorder);
}

function setup() {
    mainCanvas = createCanvas(xBorder, yBorder);
    mainCanvas.parent("appScreen");
    randomPerm = randomPermutation(polyPoints);
}

function draw() {
    background(255);
    updateVars();
    
    if ($("#generatorSelector").val() === "single-cycle") {
        cyclePerm = singleCycle(polyPoints);
    } else if ($("#generatorSelector").val() === "random") {
        if (Object.keys(randomPerm).length == polyPoints) {
            cyclePerm = randomPerm;
        } else {
            randomPerm = randomPermutation(polyPoints);
            cyclePerm = randomPerm;
        }
    } else {
        cyclePerm = parseGenerator($('#generator').val());       
    }
    drawPermutation(permPower(cyclePerm, power));
    updateRange();
    
    labelPolygon(polyRadius, polyPoints);
    polygon(polyRadius, polyPoints);
}