var ANIMATION_PRESENT = false;

function drawLorenzAttractor(addOrNew) {
    ANIMATION_PRESENT = false;
    // obtain parameter values
    var sigma = parseFloat(document.getElementById('sigma').value);
    var b = parseFloat(document.getElementById('b').value);
    var r = parseFloat(document.getElementById('r').value);
    var startTime = parseFloat(document.getElementById('startTime').value);
    var endTime = parseFloat(document.getElementById('endTime').value);
    var x0 = parseFloat(document.getElementById('x0').value);
    var y0 = parseFloat(document.getElementById('y0').value);
    var z0 = parseFloat(document.getElementById('z0').value);
    if (isNaN(sigma)) {
        sigma = 10;
    }
    if (isNaN(b)) {
        b = 2.667;
    }
    if (isNaN(r)) {
        r = 28;
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

    // find solutions of Lorenz system
    f = function(t, x) {
        return [sigma * (x[1] - x[0]),
                x[0] * (r - x[2]) - x[1],
                x[0] * x[1] - b * x[2]];
    }
    
    var dopri = numeric.dopri(startTime, endTime, [x0, y0, z0], f, 1e-6, 10000);
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

    // draw plot for current solutions
    var graphDiv = document.getElementById('graph');
    graphDiv.style.visibility = 'visible';
    if (addOrNew == 'NEW') {
        var data = [{
            x : x,
            y : y,
            z : z,
            type : 'scatter3d',
            mode : 'lines',
            name : 'Plot 1',
            opacity : 1,
            line : {
                width : 2,
                color : c,
                colorscale : 'YlGnBu'
            }
        }];

        var layout = {
            autosize : true,
            margin : {
                l : 0,
                r : 0,
                t : 0,
                b : 0
            },
            showlegend : false
        }
        Plotly.newPlot(graphDiv, data, layout);
    } else {
        var color = ['blue', 'orange', 'red', 'green', 'pink', 'black'];
        if (graphDiv.data.length == 1) {
            var update = {
                'line.color' : color[0]
            };
            Plotly.restyle(graphDiv, update);
            update = {
                showlegend : true
            };
            Plotly.relayout(graphDiv, update);
        }

        // clear animations
        for (i = 0; i < graphDiv.data.length; i++) {
            if (graphDiv.data[i].name.startsWith('animation')) {
                Plotly.deleteTraces(graphDiv, i--);
            }
        }

        var data = [{
            x : x,
            y : y,
            z : z,
            type : "scatter3d",
            mode : "lines",
            name : "Plot " + (graphDiv.data.length + 1),
            opacity : 1,
            line: {
                width : 2,
                color : color[graphDiv.data.length]
            }
        }];
        Plotly.plot(graphDiv, data);
    }
}

function startAnimation() {
    ANIMATION_PRESENT = true;
    var graphDiv = document.getElementById('graph');
    var numberOfPlots = graphDiv.data.length;
    var x = [];
    var y = [];
    var z = [];
    var data = [];
    for (i = 0; i < numberOfPlots; i++) {
        x[i] = graphDiv.data[i].x;
        y[i] = graphDiv.data[i].y;
        z[i] = graphDiv.data[i].z;

        var color;
        if (numberOfPlots == 1) {
            color = 'black';
        } else {
            color = graphDiv.data[i].line.color;
        }

        data.push({
            x : [x[i][0]],
            y : [y[i][0]],
            z : [z[i][0]],
            type : 'scatter3d',
            mode : 'markers',
            name : 'animation for plot ' + i,
            opacity : 1,
            marker : {
                size : 5,
                color : color
            }
        });
    };

    Plotly.plot(graphDiv, data);

    for (i = 1; i < x[0].length; i++) {
        var dataUpdate = [];
        var traces = [];
        for (j = 0; j < numberOfPlots; j++) {
            dataUpdate.push({
                x : [x[j][i]],
                y : [y[j][i]],
                z : [z[j][i]]
            });
            traces.push(numberOfPlots + j);
        }
        Plotly.animate(graphDiv, {
            data : dataUpdate,
            traces : traces,
            layout : {}
        }, {
            transition : {
                duration : 0
            },
            frame : {
                duration : 0,
                redraw : false
            },
            mode : 'afterall'
        });
    }
}

function removeAll() {
    ANIMATION_PRESENT = false;
    var graphDiv = document.getElementById('graph');
    var numberOfPlots = graphDiv.data.length;
    var traces = [];
    for (i = 0; i < numberOfPlots; i++) {
        traces.push(i);
    }
    Plotly.deleteTraces(graphDiv, traces);
    graphDiv.style.visibility = 'hidden';
}

function stopAnimation() {
    var graphDiv = document.getElementById('graph');
    Plotly.animate(graphDiv, [], {mode : 'immediate'});
}

function restart() {
    var graphDiv = document.getElementById('graph');
    if (!ANIMATION_PRESENT) {
        startAnimation();
    } else {
        stopAnimation();
        var numberOfPlots = graphDiv.data.length;
        var traces = [];
        for (i = numberOfPlots/2; i < numberOfPlots; i++) {
            traces.push(i);
        }
        Plotly.deleteTraces(graphDiv, traces);
        ANIMATION_PRESENT = false;
        startAnimation();
    }
}