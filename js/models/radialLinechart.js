export function radialLineChart () {
  // document.body.style.zoom = 0.80
  let margin = { top: 0, bottom: 0, right: 0, left: 0 }

  let modo = 0

  let width = 100

  let height = 100

  let innerRadius = 100

  let title = 'T'

  let subtitle = 'S'

  let outerRadius = Math.min((width - margin.right - margin.left), (height - margin.top - margin.bottom)) / 2 - 6

  let fullCircle = 2 * Math.PI

  let onMouseOver = function () { }
  let onMouseOut = function () { }

  let xValue = function (d) { return d[0] }
  let yValue = function (d) { return d[1] }

  let xScale = d3.scaleTime()
  let yScale = d3.scaleRadial()

  let opacity = 0.5

  let colours = d3.scaleOrdinal(d3.schemeCategory10)
  let parseDate = d3.timeParse('%Y-%m-%d')

  function chart (selection) {
    selection.each(function (data) {
      let dataSeries = data.reduce(function (valorAnterior, valorActual) {
        let tempYear = valorActual.key.getFullYear()
        if (valorAnterior[tempYear]) {
          valorAnterior[tempYear].push(valorActual)
        } else {
          valorAnterior[tempYear] = [valorActual]
        }
        return valorAnterior
      }, {})
      let anhos = Object.keys(dataSeries)

      // console.log("radialLineChart data: ", data);
      // console.log("dataSeries: ", dataSeries);
      outerRadius = Math.min((width - margin.right - margin.left), (height - margin.top - margin.bottom)) / 2 - 6
      innerRadius = outerRadius / 2.5

      let xScaleDomain = [
        parseDate('' + anhos[0] + '-01-01'),
        parseDate('' + anhos[anhos.length - 1] + '-12-31')
      ]
      xScale
        .range([0, fullCircle * anhos.length])
        .domain(xScaleDomain)
      // .domain(d3.extent(data, xValue));

      // console.log("xScale.domain()", xScale.domain());
      // console.log("xScale.range()", xScale.range());

      yScale
        .range([innerRadius, outerRadius])
        .domain([0, d3.extent(data, yValue)[1] * 1.2])
        .nice()

      let format = ['%b', '%I %p', '%I %p', '%I %p']
      // let title = ["Mes", "Hora", "Hora", "Hora"];
      // let subtitle = ["Día", "15 min", "30 min", "60 min"];
      let xScaleTickData = [
        [
          parseDate('' + anhos[0] + '-01-01'),
          parseDate('' + anhos[0] + '-02-01'),
          parseDate('' + anhos[0] + '-03-01'),
          parseDate('' + anhos[0] + '-04-01'),
          parseDate('' + anhos[0] + '-05-01'),
          parseDate('' + anhos[0] + '-06-01'),
          parseDate('' + anhos[0] + '-07-01'),
          parseDate('' + anhos[0] + '-08-01'),
          parseDate('' + anhos[0] + '-09-01'),
          parseDate('' + anhos[0] + '-10-01'),
          parseDate('' + anhos[0] + '-11-01'),
          parseDate('' + anhos[0] + '-12-01')
        ],
        []
      ]

      // let title_ = title[modo];
      // let subtitle_ = subtitle[modo];
      let labelFormat = d3.timeFormat(format[modo])
      let line = d3.lineRadial().angle(X).radius(Y)

      let svg = d3.select(this).selectAll('svg').data([data])
      let svgEnter = svg.enter()
        .append('svg')
        .attr('class', 'radialLineChart')

      svgEnter.append('g').attr('class', 'series')
      svgEnter.append('g').attr('class', 'x axis')
      svgEnter.append('g').attr('class', 'y axis')
      svgEnter.append('g').attr('class', 'title').append('text')
      svgEnter.append('g').attr('class', 'subtitle').append('text')

      svgEnter.selectAll('g')
        .attr('transform', 'translate(' + ((width - margin.left - margin.right) / 2) + ',' + ((height - margin.top - margin.bottom) / 2) + ')')

      let g = svg.merge(svgEnter)
        .attr('width', width)
        .attr('height', height)
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      // Make Y axis
      let yAxisData = [yScale.domain()[0]]
      yAxisData = yAxisData.concat(yScale.ticks(4))
      // yAxisData.push(yScale.domain()[1]);

      let yAxis = g.select('.y.axis')
        .attr('text-anchor', 'middle')

      let yTickCircle = yAxis
        .selectAll('circle')
        .data(yAxisData)
      yTickCircle.enter().append('circle')
        .merge(yTickCircle)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('opacity', 0.2)
        .attr('r', yScale)
      yTickCircle.exit().remove()

      let yTickText = yAxis
        .selectAll('text')
        .data(yAxisData)
      yTickText.enter().append('text')
        .merge(yTickText)
        .style('font-size', 10)
        .attr('y', function (d) { return -yScale(d) })
        .attr('dy', '0.35em')
        .text(function (d) { return '' + d })
      yTickText.exit().remove()
      // End make Y axis

      let series = g.selectAll('.series')
      let ss = series.selectAll('path')
        .data(anhos)
      ss.enter()
        .append('path')
        .merge(ss)
        .attr('class', function (d) { return 'serie' + d })
        .attr('fill', 'none')
        .attr('stroke', function (d) { return colours(d) })
        .attr('stroke-width', 1.5)
        .attr('opacity', opacity)
        .datum(function (d) { return dataSeries[d] })
        .attr('d', line)
        .on('mouseover', onMouseOver)
        .on('mouseout', onMouseOut)
      // .append("svg:title")
      // .text(function(d) { return "Test"; });

      ss.exit().remove()

      // Make X axis
      // xScaleData = xScale.ticks(1);
      let xScaleData = xScaleTickData[modo]
      // console.log("xScaleData", xScaleData);
      let xAxis = g.select('.x.axis')
        .attr('text-anchor', 'middle')

      let xTick1 = xAxis
        .selectAll('g')
        .data(xScaleData)

      // let xTick =
      xTick1.enter().append('g')
        .merge(xTick1)
        .attr('text-anchor', 'middle')
      // .attr("transform", function (d) {
      //     return "rotate(" + ((xScale(d)) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)";
      // });
        .attr('transform', function (d) {
          return 'rotate(' + ((xScale(d)) * 180 / Math.PI - 90) + ')translate(' + innerRadius + ',0)'
        })
      xTick1.exit().remove()

      let xTickLine = xAxis
        .selectAll('line')
        .data(xScaleData)
      xTickLine.enter().append('line')
        .merge(xTickLine)
        .attr('x2', -4)
        .attr('stroke', '#000')
        .attr('transform', function (d) {
          return 'rotate(' + ((xScale(d)) * 180 / Math.PI - 90) + ')translate(' + innerRadius + ',0)'
        })
      xTickLine.exit().remove()

      let xTickText = xAxis
        .selectAll('text')
        .data(xScaleData)
      xTickText.enter().append('text')
        .merge(xTickText)
        .attr('transform', function (d) {
          let angle = xScale(d)
          return (((angle < Math.PI / 2) || ((Math.PI * 3 / 2) < angle)) ? 'rotate(90)translate(0,22)' : 'rotate(-90)translate(0, -15)')
        })
        .text(function (d) {
          return labelFormat(d)
        })
        .style('font-size', 10)
        .attr('opacity', 0.6)
        .attr('text-anchor', 'end')
        .attr('transform', function (d) {
          return 'rotate(' + ((xScale(d)) * 180 / Math.PI - 90) + ')translate(' + innerRadius + ',0)'
        })

      // .attr("transform", function (d) {
      // let angle = xScale(d);
      // return ((angle < Math.PI / 2) || (angle > (Math.PI * 3 / 2))) ? "rotate(90)translate(0,22)" : "rotate(-90)translate(0, -15)";
      // });
      xTickText.exit().remove()
      // End make X axis
      // let _title =
      g.select('.title').select('text')
        .attr('dy', '-0.2em')
        .attr('text-anchor', 'middle')
        .text(title) // Title

      // let _subtitle =
      g.select('.subtitle').select('text')
        .attr('dy', '1em')
        .attr('text-anchor', 'middle')
        .attr('opacity', 0.6)
        .text(subtitle) // Subtitle
    })
  }

  function X (d) { return xScale(xValue(d)) }
  function Y (d) { return yScale(yValue(d)) }

  chart.innerRadius = function (_) {
    if (!arguments.length) return innerRadius
    innerRadius = _
    return chart
  }

  chart.modo = function (_) {
    if (!arguments.length) return modo
    modo = _
    return chart
  }

  chart.width = function (_) {
    if (!arguments.length) return width
    width = _
    return chart
  }

  chart.height = function (_) {
    if (!arguments.length) return height
    height = _
    return chart
  }

  chart.x = function (_) {
    if (!arguments.length) return xValue
    xValue = _
    return chart
  }

  chart.y = function (_) {
    if (!arguments.length) return yValue
    yValue = _
    return chart
  }

  chart.title = function (_) {
    if (!arguments.length) return title
    title = _
    return chart
  }

  chart.subtitle = function (_) {
    if (!arguments.length) return subtitle
    subtitle = _
    return chart
  }
  chart.onMouseOver = function (_) {
    if (!arguments.length) return onMouseOver
    onMouseOver = _
    return chart
  }

  chart.onMouseOut = function (_) {
    if (!arguments.length) return onMouseOut
    onMouseOut = _
    return chart
  }

  return chart
}
