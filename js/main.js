/* global crossfilter */

import { barChart } from './models/barChart.js'
import { radialLineChart } from './models/radialLinechart.js'
import { heatMap } from './models/heatMap.js'
import { genderChart } from './models/genderModule.js'
import { buttonControl } from './models/buttonControl.js'
// import { d3scaleradial } from "./models/d3-scale-radial.js";

// http://bl.ocks.org/boeric/7d11226f5e1235cbe645
// https://bl.ocks.org/micahstubbs/66db7c01723983ff028584b6f304a54a

document.body.style.zoom = 0.95

let justOnce = true

const sorterKey = {
  // "sunday": 0, // << if sunday is first day of week
  'lunes': '01',
  'martes': '02',
  'miércoles': '03',
  'jueves': '04',
  'viernes': '05',
  'sábado': '06',
  'domingo': '07',
  'enero': '08',
  'febrero': '09',
  'marzo': '10',
  'abril': '11',
  'mayo': '12',
  'junio': '13',
  'julio': '14',
  'agosto': '15',
  'septiembre': '16',
  'octubre': '17',
  'noviembre': '18',
  'diciembre': '19'
}

const dateFmt = d3.timeParse('%Y/%m/%d %I:%M:%S %p')

const rawDS = d3.tsv('data/Hurto celulares - Bogota_5.tsv',
  d => {
    // This function is applied to each row of the dataset
    d['TIMESTAMP'] = dateFmt(d['TIMESTAMP'])
    return d
  }
);

(async function read () {
  const d = await rawDS

  let filtroDinamico = true

  const oncheckBox01 = () => {
    if (filtroDinamico) {
      filtroDinamico = false
      reload()
    } else {
      filtroDinamico = true
      reload()
    }
    // console.log('filtroDinamico: ' + filtroDinamico)
  }

  d3.select('#checkBox01').property('checked', filtroDinamico)
  d3.select('#checkBox01').on('change', oncheckBox01)

  // let armaSelected = []
  let barrioSelected = []
  let genderSelected = []
  let armaMovilSelected = []
  let diaSelected = []
  let yearSelected = []

  let sortByKey = (a, b) => {
    const key1 = a.key.toLowerCase()
    const key2 = b.key.toLowerCase()
    return sorterKey[key1] > sorterKey[key2]
  }

  let reload = () => {
    let weekButtonControl = buttonControl()
      .width(800)
      .height(23)
      .x(d => d.key)

    let yearButtonControl = buttonControl()
      .width(800)
      .height(20)
      .x(d => d.key)

    let barrioBarChart = barChart()
      .width(440)
      .height(300)
      .x(d => d.key)
      .y(d => +d.value)

    /*
        let armaBarChart = barChart()
            .width(300)
            .height(300)
            .x(function (d) { return d.key; })
            .y(function (d) { return +d.value; });
        */
    let myGenderChart = genderChart()
      .width(440)
      .height(300)
    // .xLeft(function (d) { return +d.value; })
      .xLeft(d => {
        const string = d.key
        return (string.includes('FEMENINO')) ? +d.value : 0
        // return o.source.Nombre == d.Nombre || o.target.Nombre == d.Nombre ? highlight_stroke_opacity : highlight_trans;});
      })
    // .xRight(function (d) { return +d.value; })
      .xRight(d => {
        const string = d.key
        return (string.includes('MASCULINO')) ? +d.value : 0
      })
      .y(d => d.key.slice(0, 10))

    let myRadialLineChart = radialLineChart()
      .width(350)
      .height(350)
      .x(d => d.key)
      .y(d => d.value)
      .modo(0)

    /*
        var myScatterPlot = scatterPlot()
            .width(500)
            .height(300)
            .x(function (d) { return d.Barrio2; })
            .y(function (d) { return +d["2016"]; });
        */
    let myHeatMap = heatMap()

    let csData = crossfilter(d)
    // let all =
    csData.groupAll()

    csData.dimBarrio = csData.dimension(d => d['BARRIO_2'])
    csData.dimArma = csData.dimension(d => d['ARMA EMPLEADA'])
    // csData.dimMovilVictima = csData.dimension(function (d) { return d["MOVIL VICTIMA"]; });
    // csData.dimMovilAgresor = csData.dimension(function (d) { return d["MOVIL AGRESOR"]; });
    csData.dimArmaMovil = csData.dimension(d => d['ID_ARMA'] + '|' + d['ID_MOVIL'])
    csData.dimRangoEtario = csData.dimension(d => d['RANGO_ETARIO'] + '   | ' + d['GENERO'])
    // csData.dimGenero = csData.dimension(function (d) { return d["GENERO"]; });
    csData.dimTimestamp = csData.dimension(d => d['TIMESTAMP'])
    csData.dimYear = csData.dimension(d => d['TIMESTAMP'].getFullYear())
    csData.dimDia = csData.dimension(d => d['DIA'])

    // GENERO: [MASCULINO|FEMENINO]
    // bisectByFoo = crossfilter.bisect.by(function (d) { return d["GENERO"]; });

    csData.barrio = csData.dimBarrio.group()
    csData.arma = csData.dimArma.group()
    // csData.movilVictima = csData.dimMovilVictima.group();
    // csData.movilAgresor = csData.dimMovilAgresor.group();
    csData.ArmaMovil = csData.dimArmaMovil.group()
    csData.rangoEtario = csData.dimRangoEtario.group()
    csData.timestampMonth = csData.dimTimestamp.group(d3.timeMonth)
    csData.timestampWeek = csData.dimTimestamp.group(d3.timeWeek)
    csData.timestampDay = csData.dimTimestamp.group(d3.timeDay)
    csData.year = csData.dimYear.group()
    csData.dia = csData.dimDia.group()

    // :::::::::::::::::::::::::::::::::::::::::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::

    if (filtroDinamico) {
      // armaSelected = [];
      barrioSelected = []
      genderSelected = []
      armaMovilSelected = []
      diaSelected = []
      yearSelected = []

      // csData.dimArma.filterAll();
      csData.dimBarrio.filterAll()
      csData.dimRangoEtario.filterAll()
      csData.dimArmaMovil.filterAll()
      csData.dimDia.filterAll()
      csData.dimYear.filterAll()

      d3.select('#barrio_filter_label').text('')
      d3.select('#genero_filter_label').text('')
      d3.select('#genero_filter_label').text('')
      d3.select('#heatmap_filter_label').text('')
      d3.select('#barrioBarChart').selectAll('rect').attr('style', 'fill:"";')
      d3.select('#gender').selectAll('rect').attr('style', 'fill:"";')
      d3.select('#heatmapArmaMovilchart').selectAll('.hour').attr('style', 'stroke-width:2;')
      d3.select('#weekButtons').selectAll('*').classed('selected', false)
      d3.select('#yearButtons').selectAll('*').classed('selected', false)

      // -----------------------------------------------------
      // Arma Empleada
      /*
            armaBarChart.onMouseOver(function (d) {
                csData.dimArma.filter(d.key);
                update();
            });

            armaBarChart.onMouseOut(function (d) {
                csData.dimArma.filterAll();
                update();
            });
            */

      // -----------------------------------------------------
      // Barrio
      barrioBarChart.onMouseOver(d => {
        csData.dimBarrio.filter(d.key)
        d3.select('#barrio_filter_label').text(' ' + d.key)
        update()
      })

      barrioBarChart.onMouseOut(() => {
        csData.dimBarrio.filterAll()
        d3.select('#barrio_filter_label').text('')
        update()
      })

      // -----------------------------------------------------
      // Género
      myGenderChart.onMouseOver(d => {
        csData.dimRangoEtario.filter(d.key)
        d3.select('#genero_filter_label').text(' ' + d.key)
        update()
      })

      myGenderChart.onMouseOut(() => {
        csData.dimRangoEtario.filterAll()
        d3.select('#genero_filter_label').text('')
        update()
      })

      // -----------------------------------------------------
      // HeatMap
      myHeatMap.onMouseOver(d => {
        csData.dimArmaMovil.filter(d.key)
        d3.select('#heatmap_filter_label').text(' ' + heatmapLabels(d.key))
        update()
      })
      myHeatMap.onMouseOut(() => {
        csData.dimArmaMovil.filterAll()
        d3.select('#heatmap_filter_label').text('')
        update()
      })

      // -----------------------------------------------------
      // Dia
      weekButtonControl.onMouseOver(d => {
        csData.dimDia.filter(d.key)
        update()
      })
      weekButtonControl.onMouseOut(() => {
        csData.dimDia.filterAll()
        update()
      })

      // -----------------------------------------------------
      // Year
      yearButtonControl.onMouseOver(d => {
        // csData.dimTimestamp.filter(d.key.getFullYear());
        csData.dimYear.filter(d.key)
        update()
      })
      yearButtonControl.onMouseOut(() => {
        csData.dimYear.filterAll()
        update()
      })

      // -----------------------------------------------------
    } else { // filtroDinamico = false
      // Arma Empleada - OnClick
      /*
            armaBarChart.onMouseClick(function (d) {

                if (d3.select(this).style("fill") === "brown") {
                    d3.select(this).style("fill", "");
                    armaSelected.splice(armaSelected.indexOf(d.key), 1);
                } else {
                    d3.select(this).style("fill", "brown");
                    armaSelected.push(d.key);
                }

                armaBarChartOnClickFilter();
                update();
            });
            */
      // -----------------------------------------------------
      // Barrio - OnClick
      barrioBarChart.onMouseClick(function (d) {
        if (d3.select(this).style('fill') === 'brown') {
          d3.select(this).style('fill', '')
          barrioSelected.splice(barrioSelected.indexOf(d.key), 1)
        } else {
          d3.select(this).style('fill', 'brown')
          barrioSelected.push(d.key)
        }

        barrioBarChartOnClickFilter()
        update()
      })

      // -----------------------------------------------------
      // Género - OnClick
      myGenderChart.onMouseClick(function (d) {
        if (d3.select(this).style('fill') === 'brown') {
          d3.select(this).style('fill', '')
          genderSelected.splice(genderSelected.indexOf(d.key), 1)
        } else {
          d3.select(this).style('fill', 'brown')
          genderSelected.push(d.key)
        }

        myGenderChartOnClickFilter()
        update()
      })

      // -----------------------------------------------------
      // HeatMap - OnClick
      myHeatMap.onMouseClick(function (d) {
        if (d3.select(this).style('stroke') === 'brown') {
          d3.select(this).style('stroke', '')
          d3.select(this).style('stroke-width', 0)
          armaMovilSelected.splice(armaMovilSelected.indexOf(d.key), 1)
        } else {
          d3.select(this).style('stroke', 'brown')
          d3.select(this).style('stroke-width', 2)
          armaMovilSelected.push(d.key)
        }

        myHeatMapOnClickFilter()
        update()
      })
      // -----------------------------------------------------
      // Dia - OnClick
      weekButtonControl.onMouseClick(function (d) {
        if (d3.select(this).classed('selected')) {
          d3.select(this).classed('selected', false)
          diaSelected.splice(diaSelected.indexOf(d.key), 1)
        } else {
          d3.select(this).classed('selected', true)
          diaSelected.push(d.key)
        }

        weekButtonControlOnClickFilter()
        update()
      })
      // -----------------------------------------------------
      // Year - OnClick
      yearButtonControl.onMouseClick(function (d) {
        if (d3.select(this).classed('selected')) {
          d3.select(this).classed('selected', false)
          yearSelected.splice(yearSelected.indexOf(d.key), 1)
        } else {
          d3.select(this).classed('selected', true)
          yearSelected.push(d.key)
        }

        yearButtonControlOnClickFilter()
        update()
      })
      // -----------------------------------------------------
    }

    // function armaBarChartOnClickFilter () {
    //   let string = ''
    //   for (let i = 0; i < armaSelected.length; i++) { string = string + ' | ' + armaSelected[i] }
    //   csData.dimArma.filter(d => !!(string.includes(d)))
    //   if (armaSelected.length === 0) { csData.dimArma.filterAll() }

    //   // console.log('---------------------------------')
    //   // console.log('armaSelected string: ' + string)
    //   // console.log('armaSelected size: ' + armaSelected.length)
    //   for (let i = 0; i < armaSelected.length; i++) {
    //     // console.log(armaSelected[i])
    //   }
    //   // console.log('---------------------------------')
    // }

    function barrioBarChartOnClickFilter () {
      let string = ''
      for (let i = 0; i < barrioSelected.length; i++) { string = string + ', ' + barrioSelected[i] }
      csData.dimBarrio.filter(d => !!(string.includes(d)))
      if (barrioSelected.length === 0) { csData.dimBarrio.filterAll() }

      d3.select('#barrio_filter_label').text(string.slice(1, string.length))

      // console.log('---------------------------------')
      // console.log('barrioSelected string: ' + string)
      // console.log('barrioSelected size: ' + barrioSelected.length)
      for (let i = 0; i < barrioSelected.length; i++) {
        // console.log(barrioSelected[i])
      }
      // console.log('---------------------------------')
    }

    // -----------------------------------------------------

    function myGenderChartOnClickFilter () {
      let string = ''
      for (let i = 0; i < genderSelected.length; i++) { string = string + ', ' + genderSelected[i] }
      csData.dimRangoEtario.filter(d => !!(string.includes(d)))
      if (genderSelected.length === 0) { csData.dimRangoEtario.filterAll() }

      d3.select('#genero_filter_label').text(string.slice(1, string.length))

      // console.log('---------------------------------')
      // console.log('genderSelected string: ' + string)
      // console.log('genderSelected size: ' + genderSelected.length)
      for (let i = 0; i < genderSelected.length; i++) { /* console.log(genderSelected[i]) */ }
      // console.log('---------------------------------')
    }

    // -----------------------------------------------------

    function myHeatMapOnClickFilter () {
      let string = ''
      let stringLabels = ''
      for (let i = 0; i < armaMovilSelected.length; i++) {
        string = string + ', ' + armaMovilSelected[i]
        stringLabels = stringLabels + ', ' + heatmapLabels(armaMovilSelected[i])
      }
      csData.dimArmaMovil.filter(d => !!(string.includes(d)))
      if (armaMovilSelected.length === 0) { csData.dimArmaMovil.filterAll() }

      d3.select('#heatmap_filter_label').text(stringLabels.slice(1, stringLabels.length))

      // console.log('---------------------------------')
      // console.log('armaMovilSelected string: ' + string)
      // console.log('armaMovilSelected size: ' + armaMovilSelected.length)
      for (let i = 0; i < armaMovilSelected.length; i++) {
        // console.log(armaMovilSelected[i])
      }
      // console.log('---------------------------------')
    }

    // -----------------------------------------------------

    function weekButtonControlOnClickFilter () {
      let string = ''
      for (let i = 0; i < diaSelected.length; i++) { string = string + ', ' + diaSelected[i] }
      csData.dimDia.filter(d => !!(string.includes(d)))
      if (diaSelected.length === 0) { csData.dimDia.filterAll() }

      // console.log('---------------------------------')
      // console.log('diaSelected string: ' + string)
      // console.log('diaSelected size: ' + diaSelected.length)
      for (let i = 0; i < diaSelected.length; i++) {
      //  console.log(diaSelected[i])
      }
      // console.log('---------------------------------')
    }

    // -----------------------------------------------------

    function yearButtonControlOnClickFilter () {
      let string = ''
      for (let i = 0; i < yearSelected.length; i++) { string = string + ', ' + yearSelected[i] }
      csData.dimYear.filter(d => !!(string.includes(d)))
      if (yearSelected.length === 0) { csData.dimYear.filterAll() }

      // console.log('---------------------------------')
      // console.log('yearSelected string: ' + string)
      // console.log('yearSelected size: ' + yearSelected.length)
      for (let i = 0; i < yearSelected.length; i++) {
        // console.log(yearSelected[i])
      }
      // console.log('---------------------------------')
    }

    function heatmapLabels (text) {
      const split = text.split('|')

      const arma = ['ARMA BLANCA', 'ARMA DE FUEGO', 'CONTUNDENTES', 'CORTANTES', 'ESCOPOLAMINA', 'JERINGA', 'PERRO', 'SIN EMPLEO DE ARMAS', 'NO REPORTADO']
      const movil = ['A PIE', 'BICI', 'C-BUS', 'C-MOTO', 'C-TAXI', 'C-VEH', 'P-BUS', 'P-METRO', 'P-MOTO', 'P-TAXI', 'P-VEH', 'VEHICULO', 'NO REPORTA']

      return (arma[split[0] - 1] + ' - ' + movil[split[1] - 1])
    }

    // -----------------------------------------------------

    // :::::::::::::::::::::::::::::::::::::::::::::::::::::

    // .attr('href', `javascript:reset(${id})`)
    // href="javascript:gateNameChart.filterAll();dc.redrawAll();"
    // .attr('href', "javascript:TESTING();")
    // .attr('class', 'reset')

    if (justOnce) {
      // barrio_filter_label
      d3.select('#titulo_barrio').append('text')
        .attr('class', 'filter_text')
        .attr('id', 'barrio_filter_label')
        .text('')
        .style('display', 'null') // none

      // genero_filter_label
      d3.select('#titulo_genero').append('text')
        .attr('class', 'filter_text')
        .attr('id', 'genero_filter_label')
        .text('')
        .style('display', 'null') // none

      // heatmap_filter_label
      d3.select('#titulo_heatmap').append('text')
        .attr('class', 'filter_text')
        .attr('id', 'heatmap_filter_label')
        .text('')
        .style('display', 'null') // none

      justOnce = false
    }

    // :::::::::::::::::::::::::::::::::::::::::::::::::::::

    function update () {
      d3.select('#weekButtons')
        .datum(csData.dia.all().sort(function (a, b) { return sortByKey(a, b) }))
        .call(weekButtonControl)

      d3.select('#yearButtons')
        .datum(csData.year.all())
        .call(yearButtonControl)

      d3.select('#barrioBarChart')
        .datum(csData.barrio.top(20))
        .call(barrioBarChart)
        .select('.x.axis')
        .selectAll('.tick text')
        .attr('transform', 'rotate(-90) translate(-10, -13)')

      /*
             d3.select("#armaBarChart")
                 .datum(csData.arma.top(Infinity))
                 .call(armaBarChart)
                 .select(".x.axis")
                 .selectAll(".tick text")
                 .attr("transform", "rotate(-90) translate(-10, -13)");
            */

      d3.select('#gender')
        .datum(csData.rangoEtario.all())
        .call(myGenderChart)

      d3.select('#mesRadialLinechart')
        .datum(csData.timestampMonth.all())
        .call(myRadialLineChart
          .title('Año')
          .subtitle('Mes')
        )

      d3.select('#semanaRadialLinechart')
        .datum(csData.timestampWeek.all())
        .call(myRadialLineChart
          .title('Año')
          .subtitle('Semana')
        )

      d3.select('#diaRadialLinechart')
        .datum(csData.timestampDay.all())
        .call(myRadialLineChart
          .title('Año')
          .subtitle('Día')
        )

      d3.select('#heatmapArmaMovilchart')
        .datum(csData.ArmaMovil.all())
        .call(myHeatMap)
    }

    update()
  }
  reload()
})()
