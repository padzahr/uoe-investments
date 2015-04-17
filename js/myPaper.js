/* 
 * Ported from original Metaball script by SATO Hiroyuki
 * http://park12.wakwak.com/~shp/lc/et/en_aics_script.html
 * 
 * 
 * Copyright (C) 2015 Hadi Mehrpouya
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


function onFrame(event) {

}
project.currentStyle = {
    fillColor: 'black'
};

window.onresize = resize;


function resize() {
    console.log("haa! resized");
    clearPaper();
    drawCompanies();
};

function clearPaper(){
    for (var i = circlePaths.length-1; i >=0 ; i--) {
        var ball = circlePaths[i];
        ball.remove();
        circlePaths.pop(ball);
    }
    
}

var ballPositions = new Array();
var g_companyNames = new Array();
$.get("data/investments.json", function(data) {
    var am = Math.sqrt((g_w * g_h / data.investments.length)) / 1.3;
    var x_am = Math.sqrt((g_w * g_h / data.investments.length)) / 1.3;
    var x = x_am, y = am;
    var maxAmount = data.investments[0].amount, minAmount = data.investments[0].amount;
    data.investments.forEach(function(row) {
        maxAmount = Math.max(row.amount, maxAmount);
        minAmount = Math.min(row.amount, minAmount);
    });
    data.investments.forEach(function(row) {
        var comp = new Company(row.name, row.amount, [x, y], 1 + row.amount / maxAmount * 50);
        ballPositions.push(comp);
        g_companyNames.push(data.investments[0]);
        x += x_am;
        if (x >= g_w - 50) {
            x = x_am;
            y += am;
        }
    });

//    test();
    drawCompanies();
    generateConnections(circlePaths);
});

//var ddd;
//function test() {
//    var remoteUrlWithOrigin = "http://en.wikipedia.org/w/api.php";
//      $.ajax({
//        type: "GET",
//        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=Jimi_Hendrix&callback=?",
//        contentType: "application/json; charset=utf-8",
//        async: false,
//        dataType: "json",
//        success: function (data, textStatus, jqXHR) {
// console.log(data.parse.text);
// ddd=data;
////            var markup = data.parse.text["*"];
////            var blurb = $('<div></div>').html(markup);
// 
//            // remove links as they will not work
////            blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
// 
//            // remove any references
////            blurb.find('sup').remove();
// 
//            // remove cite error
////            blurb.find('.mw-ext-cite-error').remove();
////            $('#article').html($(blurb).find('p'));
// 
//        },
//        error: function (errorMessage) {
//        }
//    });
//}

var handle_len_rate = 2.4;
var circlePaths = [];
var radius = 50;

function drawCompanies() {
    for (var i = 0, l = ballPositions.length; i < l; i++) {
        var ball = ballPositions[i];
        var circlePath = new Path.Circle({
            center: ball.position,
            radius: ball.size
        });
        ball.path = circlePath;
        circlePaths.push(circlePath);
    }
}
var largeCircle = new Raster("edUni");
largeCircle.position = [500, 500];
//circlePaths.push(largeCircle);
var left = true;
function onMouseMove(event) {
    if (event) {
        largeCircle.position = event.point;
        console.log(g_w + " " +event.point.x);
        if (event.point.x >= (g_w -450)) {
            if (!left) {
                $("#info").animate({top: 30, left: 30, position: 'absolute'}, 1000);
                left = true;
            }
        }
        else if (event.point.x <= 450) {
            if (left) {
                $("#info").animate({top: 30, left: g_w - 430, position: 'absolute'}, 1000);
                left = false;
            }
        }
        generateConnections(circlePaths);
    }
}
var connections = new Group();
function generateConnections(paths) {
    // Remove the last connection paths:
    connections.children = [];
    $("#info .detail").html("");
    for (var i = 0; i < paths.length; i++) {
//        for (var j = i - 1; j >= 0; j--) {
        if (largeCircle === paths[i])
            continue;
        var path = metaball(paths[i], largeCircle, 0.5, handle_len_rate, 100);
        if (path) {

            var ball = ballPositions[i];
            var unit = " Millions";
            var value = ball.amount/1000000;
            value = value.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            if (ball.amount >= 1000000)
                unit = " Millions";
            else
                unit = " Thousands";
            $("#info .detail").append("<h4 class='organisation'>" + ball.name + " : " + "</h4><h4 class = 'amount'> £" + value + " Millions</h4>");
            var s = g_companyNames[i].extra_info;
            if (s) {
                console.log(s[1]);
                $("#companyInfo").text(s[1]);
            }
            else
                $("#companyInfo").text("aa");

            connections.appendTop(path);
            path.removeOnMove();
        }
//        }
    }
}

generateConnections(circlePaths);

// ---------------------------------------------
function metaball(ball1, ball2, v, handle_len_rate, maxDistance) {
    var center1 = ball1.position;
    var center2 = ball2.position;
    var radius1 = ball1.bounds.width / 2;
    var radius2 = ball2.bounds.width / 2;
    var pi2 = Math.PI / 2;
    var d = center1.getDistance(center2);
    var u1, u2;

    if (radius1 == 0 || radius2 == 0)
        return;

    if (d > maxDistance || d <= Math.abs(radius1 - radius2)) {
        return;
    } else if (d < radius1 + radius2) { // case circles are overlapping
        u1 = Math.acos((radius1 * radius1 + d * d - radius2 * radius2) /
                (2 * radius1 * d));
        u2 = Math.acos((radius2 * radius2 + d * d - radius1 * radius1) /
                (2 * radius2 * d));
    } else {
        u1 = 0;
        u2 = 0;
    }

    var angle1 = (center2 - center1).getAngleInRadians();
    var angle2 = Math.acos((radius1 - radius2) / d);
    var angle1a = angle1 + u1 + (angle2 - u1) * v;
    var angle1b = angle1 - u1 - (angle2 - u1) * v;
    var angle2a = angle1 + Math.PI - u2 - (Math.PI - u2 - angle2) * v;
    var angle2b = angle1 - Math.PI + u2 + (Math.PI - u2 - angle2) * v;
    var p1a = center1 + getVector(angle1a, radius1);
    var p1b = center1 + getVector(angle1b, radius1);
    var p2a = center2 + getVector(angle2a, radius2);
    var p2b = center2 + getVector(angle2b, radius2);

    // define handle length by the distance between
    // both ends of the curve to draw
    var totalRadius = (radius1 + radius2);
    var d2 = Math.min(v * handle_len_rate, (p1a - p2a).length / totalRadius);

    // case circles are overlapping:
    d2 *= Math.min(1, d * 2 / (radius1 + radius2));

    radius1 *= d2;
    radius2 *= d2;

    var path = new Path({
        segments: [p1a, p2a, p2b, p1b],
        style: ball1.style,
        closed: true
    });
    var segments = path.segments;
    segments[0].handleOut = getVector(angle1a - pi2, radius1);
    segments[1].handleIn = getVector(angle2a + pi2, radius2);
    segments[2].handleOut = getVector(angle2b - pi2, radius2);
    segments[3].handleIn = getVector(angle1b + pi2, radius1);
    return path;
}

// ------------------------------------------------
function getVector(radians, length) {
    return new Point({
        // Convert radians to degrees:
        angle: radians * 180 / Math.PI,
        length: length
    });
}



