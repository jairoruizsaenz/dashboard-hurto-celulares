/* global d3, barChart, genderChart, scatterPlot*/

var barrioBarChart = barChart()
    .width(500)
    .height(300)
    .x(function (d) { return d.key; })
    .y(function (d) { return +d.value; });

var armaBarChart = barChart()
    .width(500)
    .height(300)
    .x(function (d) { return d.key; })
    .y(function (d) { return +d.value; });

var myGenderChart = genderChart()
    .width(600)
    .height(300)
    .xLeft(function (d) { return +d.value; })
    .xRight(function (d) { return +d.value; })
    .y(function (d) { return d.key; });

var myScatterPlot = scatterPlot()
    .width(500)
    .height(300)
    .x(function (d) { return d.Barrio2; })
    .y(function (d) { return +d["2016"]; });

d3.tsv("data/Hurto celulares - Bogota_4.tsv",
    function (err, data) {
        if (err) throw err;

        var csData = crossfilter(data);
        var all = csData.groupAll();

        csData.dimBarrio = csData.dimension(function (d) { return d["BARRIO_2"]; });
        csData.dimArma = csData.dimension(function (d) { return d["ARMA EMPLEADA"]; });
        csData.dimMovilVictima = csData.dimension(function (d) { return d["MOVIL VICTIMA"]; });
        csData.dimMovilAgresor = csData.dimension(function (d) { return d["MOVIL AGRESOR"]; });
        csData.dimRangoEtario = csData.dimension(function (d) { return d["RANGO_ETARIO"]; });
        csData.dimAnho = csData.dimension(function (d) { return d["ANHO"]; });

        csData.barrio = csData.dimBarrio.group();
        csData.arma = csData.dimArma.group();
        csData.movilVictima = csData.dimMovilVictima.group();
        csData.movilAgresor = csData.dimMovilAgresor.group();
        csData.rangoEtario = csData.dimRangoEtario.group();
        csData.anho = csData.dimAnho.group();

        barrioBarChart.onMouseOver(function (d) {
            console.log("barrioBarChart.onMouseOver");
            console.log(d);
            csData.dimBarrio.filter(d.key);
            update();
        });
        barrioBarChart.onMouseOut(function (d) {
            console.log("barrioBarChart.onMouseOut");
            csData.dimBarrio.filterAll();
            update();
        });

        armaBarChart.onMouseOver(function (d) {
            console.log("armaBarChart.onMouseOver");
            console.log(d);
            csData.dimArma.filter(d.key);
            update();
        });
        armaBarChart.onMouseOut(function (d) {
            console.log("armaBarChart.onMouseOut");
            csData.dimArma.filterAll();
            update();
        });

        // myGenderChart
        //     .onMouseOver(function (d) {
        //         csData.dimRangoEtario.filter(d);
        //         update();
        //     })
        //     .onMouseOut(function (d) {
        //         csData.dimRangoEtario.filterAll();
        //         update();
        //     });

        // data.sort(function (a, b) { return b["2016"] - a["2016"]; })

        // csData.dimBarrio.fiter();
        function update() {
            d3.select("#barrioBarChart")
                .datum(csData.barrio.top(20))
                .call(barrioBarChart)
                .select(".x.axis")
                .selectAll(".tick text")
                .attr("transform", "rotate(-90) translate(-10, -13)");

            d3.select("#armaBarChart")
                .datum(csData.arma.all())
                .call(armaBarChart)
                .select(".x.axis")
                .selectAll(".tick text")
                .attr("transform", "rotate(-90) translate(-10, -13)");

            d3.select("#gender")
                .datum(csData.rangoEtario.all())
                .call(myGenderChart);

            // d3.select("#gender")
            //     .datum(csData.rangoEtario.top(3))
            //     .call(myGenderChart);

            setTimeout(function () {
                d3.select("#gender")
                    .datum(csData.rangoEtario.all())
                    .call(myGenderChart);
            }, 4000);
        }

        update();
        // d3.select("#chart2")
        //     .datum(data.slice(0, 200))
        //     .call(myScatterPlot);

        // setTimeout(function () {
        //     d3.select("#chart")
        //         .datum(data.slice(0, 20))
        //         .call(barrioBarChart);
        // }, 8000);
    });

// d3.tsv("data/Hurto celulares - Edad.tsv",
//     function (d) {
//         d.FEMENINO = +d.FEMENINO;
//         d.MASCULINO = +d.MASCULINO;
//         return d;
//     },
//     function (err, data) {
//         if (err) throw err;

//         d3.select("#gender")
//             .datum(data)
//             .call(myGenderChart);
//     });
