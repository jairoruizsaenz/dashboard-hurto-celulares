export function barChart () {
  let
    margin = { top: 20, right: 20, bottom: 30, left: 60 }

  let width = 400

  let height = 400

  let innerWidth = width - margin.left - margin.right

  let innerHeight = height - margin.top - margin.bottom

  let xValue = d => d[0]

  let yValue = d => d[1]

  let xScale = d3.scaleBand().padding(0.1)

  let yScale = d3.scaleLinear()

  let onMouseOver = function () { }

  let onMouseOut = function () { }

  let onMouseClick = function () { }

  let justOnce = true

  function chart (selection) {
    selection.each(function (data) {
      // console.log("data barChartModule", data);
      // Select the svg element, if it exists.
      let svg = d3.select(this).selectAll('svg').data([data])

      // Otherwise, create the skeletal chart.
      let svgEnter = svg.enter().append('svg')
        .attr('class', 'barchart')

      let gEnter = svgEnter.append('g')
      gEnter.append('g').attr('class', 'x axis')
      gEnter.append('g').attr('class', 'y axis')

      // Update the outer dimensions.
      svg.merge(svgEnter)
        .attr('width', width)
        .attr('height', height)

      // Update the inner dimensions.
      let g = svg.merge(svgEnter).select('g')
        .attr('width', width)
        .attr('height', height)
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      xScale.rangeRound([0, innerWidth])
        .domain(data.map(d => xValue(d)))
      yScale.rangeRound([innerHeight, 0])
        .domain([0, d3.max(data, d => yValue(d))])

      g.select('.x.axis')
        .attr('transform', 'translate(0,' + innerHeight + ')')
        .call(d3.axisBottom(xScale))

      let EjeY = g.select('.y.axis')
        .call(d3.axisLeft(yScale))

      if (justOnce) {
        EjeY
          .append('text')
          .attr('transform', 'translate(-50,20) rotate(-90)')
          .style('font-size', '15px')
          .style('fill', 'black')
          .attr('dy', '0.71em')
          .attr('text-anchor', 'end')
          .text('Cantidad de eventos reportados')
        justOnce = false
      }

      let bars = g.selectAll('.bar')
        .data(d => d)

      bars.enter().append('rect')
        .attr('class', 'bar')
        .merge(bars)
        .attr('x', X)
        .attr('y', Y)
        .attr('width', xScale.bandwidth())
        .attr('height', d => innerHeight - Y(d))
        .on('mouseover', onMouseOver)
        .on('mouseout', onMouseOut)
        .on('click', onMouseClick)
        // .append("svg:title")
        //  .text(function(d) { return d.value; });

      bars.exit().remove()
    })
  }

  // The x-accessor for the path generator; xScale o xValue.
  let X = d => xScale(xValue(d))

  // The y-accessor for the path generator; yScale o yValue.
  let Y = d => yScale(yValue(d))

  chart.margin = function (_) {
    if (!arguments.length) return margin
    margin = _
    return chart
  }

  chart.width = function (_) {
    if (!arguments.length) return width
    width = _
    innerWidth = width - margin.left - margin.right
    return chart
  }

  chart.height = function (_) {
    if (!arguments.length) return height
    height = _
    innerHeight = height - margin.top - margin.bottom
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

  chart.onMouseClick = function (_) {
    if (!arguments.length) return onMouseClick
    onMouseClick = _
    return chart
  }

  return chart
}
