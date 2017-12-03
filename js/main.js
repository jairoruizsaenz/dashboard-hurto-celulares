/* global d3, barChart, genderChart, scatterPlot, csData*/

// http://bl.ocks.org/boeric/7d11226f5e1235cbe645
// https://bl.ocks.org/micahstubbs/66db7c01723983ff028584b6f304a54a

d3.tsv("data/Hurto celulares - Bogota_4.tsv",
    function (err, data) {
        if (err) throw err;

var sorterWeekDay = {
    // "sunday": 0, // << if sunday is first day of week
    "lunes": 1,
    "martes": 2,
    "miércoles": 3,
    "jueves": 4,
    "viernes": 5,
    "sábado": 6,
    "domingo": 7
}

var myButtonControl = buttonControl()
    .width(400)
    .height(50)
    .x(function (d) { return d.key; });

var barrioBarChart = barChart()
    .width(400)
    .height(300)
    .x(function (d) { return d.key; })
    .y(function (d) { return +d.value; });

var armaBarChart = barChart()
    .width(300)
    .height(300)
    .x(function (d) { return d.key; })
    .y(function (d) { return +d.value; });

var myGenderChart = genderChart()
    .width(400)
    .height(300)
    //.xLeft(function (d) { return +d.value; })
    .xLeft(function (d) {
        var string = d.key;
        return (string.includes("FEMENINO")) ? +d.value : 0;
        //return o.source.Nombre == d.Nombre || o.target.Nombre == d.Nombre ? highlight_stroke_opacity : highlight_trans;});
    })
    //.xRight(function (d) { return +d.value; })
    .xRight(function (d) {
        var string = d.key;
        return (string.includes("MASCULINO")) ? +d.value : 0;
    })
    .y(function (d) { return d.key.slice(0, 8); });

/* var myScatterPlot = scatterPlot()
    .width(500)
    .height(300)
    .x(function (d) { return d.Barrio2; })
    .y(function (d) { return +d["2016"]; }); */

function sortByDay(a, b) {
    var day1 = a.key.toLowerCase();
    var day2 = b.key.toLowerCase();
    return sorterWeekDay[day1] > sorterWeekDay[day2];
}



        csData = crossfilter(data);
        all = csData.groupAll();

        csData.dimBarrio = csData.dimension(function (d) { return d["BARRIO_2"]; });
        csData.dimArma = csData.dimension(function (d) { return d["ARMA EMPLEADA"]; });
        csData.dimMovilVictima = csData.dimension(function (d) { return d["MOVIL VICTIMA"]; });
        csData.dimMovilAgresor = csData.dimension(function (d) { return d["MOVIL AGRESOR"]; });
        csData.dimRangoEtario = csData.dimension(function (d) { return d["RANGO_ETARIO"] + ' | ' + d["GENERO"]; });
        csData.dimGenero = csData.dimension(function (d) { return d["GENERO"]; });
        // csData.dimTimestamp = csData.dimension(function (d) { return d["TIMESTAMP"]; });
        csData.dimDia = csData.dimension(function (d) { return d["DIA"]; });

        // GENERO: [MASCULINO|FEMENINO]
        // bisectByFoo = crossfilter.bisect.by(function (d) { return d["GENERO"]; });

        csData.barrio = csData.dimBarrio.group();
        csData.arma = csData.dimArma.group();
        csData.movilVictima = csData.dimMovilVictima.group();
        csData.movilAgresor = csData.dimMovilAgresor.group();
        csData.rangoEtario = csData.dimRangoEtario.group();
        //csData.genero = csData.dimGenero.group();
        // csData.timestamp = csData.dimTimestamp.group();
        csData.dia = csData.dimDia.group().order(function (d) {
            console.log(d);
            return d.key;
        });

        //:::::::::::::::::::::::::::::::::::::::::::::::::::::
        //:::::::::::::::::::::::::::::::::::::::::::::::::::::

        barrioBarChart.onMouseOver(function (d) {
            csData.dimBarrio.filter(d.key);
            update();
        });
        barrioBarChart.onMouseOut(function (d) {
            csData.dimBarrio.filterAll();
            update();
        });

        //:::::::::::::::::::::::::::::::::::::::::::::::::::::
        //:::::::::::::::::::::::::::::::::::::::::::::::::::::

        armaBarChart.onMouseOver(function (d) {
            //csData.dimArma.filter(d.key);
            console.log(d3.select(this).attr("class"));
            //update();
        });
        armaBarChart.onMouseOut(function (d) {
            //csData.dimArma.filterAll();
            //update();
        });

        armaBarChart.onMouseClick(function (d) {
            
            if (d3.select(this).attr("class") === "clicked"){
                d3.select(this).attr("class", "bar");
                //d3.select(this).style("fill", "green");
            }else{            
                d3.select(this).attr("class", "clicked");
                csData.dimArma.filter(d.key);
            }            
            console.log(d3.select(this).attr("class"));
            
            //csData.dimArma.filter(d.key);
            //console.log(csData.dimArma.top(1));
            update();
        });
    
        //:::::::::::::::::::::::::::::::::::::::::::::::::::::
        //:::::::::::::::::::::::::::::::::::::::::::::::::::::

        myGenderChart.onMouseOver(function (d) {
            csData.dimRangoEtario.filter(d.key);
            update();
        });
        myGenderChart.onMouseOut(function (d) {
            csData.dimRangoEtario.filterAll();
            update();
        });
    
        //:::::::::::::::::::::::::::::::::::::::::::::::::::::
        //:::::::::::::::::::::::::::::::::::::::::::::::::::::

        myButtonControl.onMouseOver(function (d) {
            csData.dimDia.filter(d.key);
            update();
        });
        myButtonControl.onMouseOut(function (d) {
            csData.dimDia.filterAll();
            update();
        });

        // data.sort(function (a, b) { return b["2016"] - a["2016"]; })

        // csData.dimBarrio.fiter();
        function update() {
            d3.select("#buttons")
                // .datum(csData.dia.all())
                .datum(csData.dia.all().sort(function (a, b) { return sortByDay(a, b); }))
                .call(myButtonControl);

            d3.select("#barrioBarChart")
                .datum(csData.barrio.top(20))
                .call(barrioBarChart)
                .select(".x.axis")
                .selectAll(".tick text")
                .attr("transform", "rotate(-90) translate(-10, -13)");

            d3.select("#armaBarChart")
                .datum(csData.arma.top(Infinity))
                .call(armaBarChart)
                .select(".x.axis")
                .selectAll(".tick text")
                .attr("transform", "rotate(-90) translate(-10, -13)");

            d3.select("#gender")
                .datum(csData.rangoEtario.all())
                .call(myGenderChart);
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
