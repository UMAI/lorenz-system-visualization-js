function drawLorenzAttractor() {
    var sigma = document.getElementById("sigma").value;
    var beta = document.getElementById("beta").value;
    var rho = document.getElementById("rho").value;
    var startTime = document.getElementById("startTime").value;
    var endTime = document.getElementById("endTime").value;

    f = function(t, x) {
        return [sigma * (x[1] - x[0]),
                x[0] * (rho - x[2]) - x[1],
                x[0] * x[1] - beta * x[2]];
    }
    var dopri = numeric.dopri(startTime, endTime, [1,1,1], f, 1e-6, 10000);
    var solution = dopri.y;
    var x = [];
    var y = [];
    var z = [];
    for (i = 0; i < solution.length; i++) {
        x[i] = solution[i][0];
        y[i] = solution[i][1];
        z[i] = solution[i][2];
    }
    Plotly.newPlot("graph", [{
        type : "scatter3d",
        mode : "lines",
        x : x,
        y : y,
        z : z,
        opacity : 1,
        line: {
            width : 1,
            reversescale : false
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