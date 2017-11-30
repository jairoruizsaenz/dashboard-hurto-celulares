/* global d3, barChart, genderChart, scatterPlot*/

var myBarChart = barChart()
    .width(500)
    .height(300)
    .x(function (d) { return d.Barrio2; })
    .y(function (d) { return +d["2016"]; });

var myGenderChart = genderChart()
    .width(600)
    .height(300)
    .xLeft(function (d) { return +d.FEMENINO; })
    .xRight(function (d) { return +d.MASCULINO; })
    .y(function (d) { return d.EDAD; });

var myScatterPlot = scatterPlot()
    .width(500)
    .height(300)
    .x(function (d) { return d.Barrio2; })
    .y(function (d) { return +d["2016"]; });

d3.tsv("data/Hurto celulares - Barrio2.tsv",
    function (d) {
        d["2016"] = +d["2016"];
        return d;
    },
    function (err, data) {
        if (err) throw err;
        data.sort(function (a, b) { return b["2016"] - a["2016"]; })

        d3.select("#barchart")
            .datum(data.slice(0, 200))
            .call(myBarChart);

        d3.select("#chart2")
            .datum(data.slice(0, 200))
            .call(myScatterPlot);

        setTimeout(function () {
            d3.select("#chart")
                .datum(data.slice(0, 20))
                .call(myBarChart);
        }, 8000);
    });

d3.tsv("data/Hurto celulares - Edad.tsv",
    function (d) {
        d.FEMENINO = +d.FEMENINO;
        d.MASCULINO = +d.MASCULINO;
        return d;
    },
    function (err, data) {
        if (err) throw err;

        d3.select("#gender")
            .datum(data)
            .call(myGenderChart);
    });
