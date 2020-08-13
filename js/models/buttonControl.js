export function buttonControl () {
  let margin = { top: 0, right: 10, bottom: 0, left: 10 }

  let width = 200

  let height = 100

  let innerWidth = width - margin.left - margin.right

  let innerHeight = height - margin.top - margin.bottom

  let xValue = function (d) { return d[0] }

  let xScale = d3.scaleBand().padding(0.1)

  let onMouseOver = function () { }

  let onMouseOut = function () { }

  let onMouseDown = function () { }

  let onMouseClick = function () { }

  function chart (selection) {
    selection.each(function (data) {
      // Select the svg element, if it exists.
      let svg = d3.select(this).selectAll('svg').data([data])

      let svgEnter = svg.enter()
        .append('svg')
      // .attr("class", "buttonControl")
        .attr('class', 'buttonControl')
        .attr('width', width)
        .attr('height', height)
        .append('g').attr('class', 'content text')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')')
        .merge(svg)
      svg.exit().remove()

      xScale.rangeRound([0, innerWidth])
        .domain(data.map(function (d) { return xValue(d) }))

      let gText = svgEnter.selectAll('text')
        .data(data)
      gText.enter()
        .append('text')
        .attr('class', 'btn')
        .merge(gText)
        .attr('x', function (d) { return X(d) + 5 })
        .attr('y', 10)
        .text(function (d) { return xValue(d) })
        .attr('style', 'font-size:10px;')
        .attr('style', 'background: #fd703c;')
        .on('mouseover', onMouseOver)
        .on('mouseout', onMouseOut)
        .on('click', onMouseClick)

      gText.exit().remove()
    })
  }

  // The x-accessor for the path generator; xScale o xValue.
  function X (d) {
    return xScale(xValue(d))
  }

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

  chart.onMouseDown = function (_) {
    if (!arguments.length) return onMouseDown
    onMouseDown = _
    return chart
  }

  chart.onMouseClick = function (_) {
    if (!arguments.length) return onMouseClick
    onMouseClick = _
    return chart
  }

  return chart
}
