function drawLorenzAttractor(addOrNew) {
    var sigma = parseFloat(document.getElementById("sigma").value);
    var beta = parseFloat(document.getElementById("beta").value);
    var rho = parseFloat(document.getElementById("rho").value);
    var startTime = parseFloat(document.getElementById("startTime").value);
    var endTime = parseFloat(document.getElementById("endTime").value);
    var x0 = parseFloat(document.getElementById("x0").value);
    var y0 = parseFloat(document.getElementById("y0").value);
    var z0 = parseFloat(document.getElementById("z0").value);
    if (isNaN(sigma)) {
        sigma = 10;
    }
    if (isNaN(beta)) {
        beta = 2.667;
    }
    if (isNaN(rho)) {
        rho = 28;
    }
    if (isNaN(startTime)) {
        startTime = 0;
    }
    if (isNaN(endTime)) {
        endTime = 4;
    }
    if (isNaN(x0)) {
        x0 = 1;
    }
    if (isNaN(y0)) {
        y0 = 1;
    }
    if (isNaN(z0)) {
        z0 = 1;
    }

    f = function(t, x) {
        return [sigma * (x[1] - x[0]),
                x[0] * (rho - x[2]) - x[1],
                x[0] * x[1] - beta * x[2]];
    }
    
    var dopri = numeric.dopri(startTime, endTime, [x0, y0, z0], f, 1e-6, 20000);
    var solution = dopri.y;
    var x = [];
    var y = [];
    var z = [];
    var c = [];
    for (i = 0; i < solution.length; i++) {
        x[i] = solution[i][0];
        y[i] = solution[i][1];
        z[i] = solution[i][2];
        c[i] = i;
    }
    if (addOrNew == 'NEW') {
        Plotly.newPlot("graph", [{
            type : "scatter3d",
            mode : "lines",
            name : "Plot 1",
            x : x,
            y : y,
            z : z,
            opacity : 1,
            line: {
                width : 2,
                color : c,
                colorscale : "YlGnBu"
            }
        }], {
            autosize : true,
            margin : {
                l: 0,
                r: 0,
                t: 0,
                b: 0
            }
        });
    } else {
        var c = "yellow";
        var plotNo = 2;
        if (document.getElementById("graph").data.length == 1) {
            var update = {
                color : "blue",
                showlegend : "true"
            };
            Plotly.restyle("graph", update);
        } else if (document.getElementById("graph").data.length == 2) {
            c = "red";
            plotNo = 3;
        } else if (document.getElementById("graph").data.length == 3) {
            c = "green";
            plotNo = 4;
        }
        Plotly.plot("graph", [{
            type : "scatter3d",
            mode : "lines",
            name : "Plot " + plotNo,
            x : x,
            y : y,
            z : z,
            opacity : 1,
            line: {
                width : 2,
                color : c
            }
        }], {
            autosize : true,
            margin : {
                l: 0,
                r: 0,
                t: 0,
                b: 0
            }
        });
    }
}