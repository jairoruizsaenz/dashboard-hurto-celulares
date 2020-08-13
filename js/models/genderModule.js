export function genderChart () {
  let
    margin = { top: 20, right: 20, bottom: 30, left: 20, middle: 28 }

  let width = 200

  let height = 400

  let yValue = function (d) { return d[0] }

  let xLeftValue = function (d) { return d[1] }

  let xRightValue = function (d) { return d[2] }

  let titleValue = ''

  let onMouseOver = function () { }

  let onMouseOut = function () { }

  let onMouseClick = function () { }

  let xScaleLeft = d3.scaleLinear()

  let xScaleRight = d3.scaleLinear()

  let yScale = d3.scaleBand()

  let innerWidth = 0

  let innerHeight = 0

  let regionWidth = 0

  let pointA = 0

  let pointB = 0

  // SET UP AXES
  let yAxisLeft = d3.axisRight()
  let yAxisRight = d3.axisLeft()
  let xAxisRight = d3.axisBottom()
  let xAxisLeft = d3.axisBottom()

  function chart (selection) {
    selection.each(function (data) {
      calcularMedidas()

      // Select the svg element, if it exists.
      let svg = d3.select(this).selectAll('svg').data([data])

      // Otherwise, create the skeletal chart.
      let svgEnter = svg.enter().append('svg')
        .attr('width', width)
        .attr('height', height)

      yScale.range([innerHeight, 0])
        .domain(data.map(function (d) { return yValue(d) }))
        .paddingInner(0.05)
      xScaleLeft.range([regionWidth, 0])
        .domain([0, d3.max(data, function (d) { return d3.max([xLeftValue(d), xRightValue(d)]) }) * 1.15])
      xScaleRight.range([0, regionWidth])
        .domain([0, d3.max(data, function (d) { return d3.max([xLeftValue(d), xRightValue(d)]) }) * 1.15])

      // SET UP AXES
      yAxisLeft
        .scale(yScale)
        .tickSize(4, 0)
        .tickPadding(margin.middle - 4)

      yAxisRight
        .scale(yScale)
        .tickSize(4, 0)
        .tickFormat('')

      xAxisRight
        .scale(xScaleRight)
        .ticks(4)

      xAxisLeft
        .scale(xScaleLeft)
        .ticks(5)

      // DRAW AXES
      svgEnter.append('g')
        .attr('class', 'axis y left')
      d3.select('.axis.y.left')
        .attr('transform', translation(pointA, margin.top))
        .call(yAxisLeft)
        .selectAll('text')
        .style('text-anchor', 'middle')

      svgEnter.append('g')
        .attr('class', 'axis y right')
      d3.select('.axis.y.right')
        .attr('transform', translation(pointB - 1, margin.top))
        .call(yAxisRight)

      svgEnter.append('g')
        .attr('class', 'axis x left')
      d3.select('.axis.x.left')
        .attr('transform', translation(margin.left, innerHeight + margin.top))
        .call(xAxisLeft)

      svgEnter.append('g')
        .attr('class', 'axis x right')
      d3.select('.axis.x.right')
        .attr('transform', translation(pointB, innerHeight + margin.top))
        .call(xAxisRight)
      // END DRAW AXES

      // MAKE GROUPS FOR EACH SIDE OF CHART
      let leftBarGroup = svgEnter.append('g')
        .attr('class', 'leftBarGroup')
      leftBarGroup = d3.select('.leftBarGroup')
        .attr('transform', translation(pointA, 0) + 'scale(-1, 1)')
      let rightBarGroup = svgEnter.append('g')
        .attr('class', 'rightBarGroup')
      rightBarGroup = d3.select('.rightBarGroup')
        .attr('transform', translation(pointB, 0))

      // DRAW BARS
      let leftBarGroupBar = leftBarGroup.selectAll('.bar.left')
        .data(data)
      leftBarGroupBar.enter()
        .append('rect')
        .attr('class', 'bar left')
        .merge(leftBarGroupBar)
        .attr('x', 0)
        .attr('y', function (d) { return Y(d) })
        .attr('width', function (d) { return xScaleRight(xLeftValue(d)) })
        .attr('height', yScale.bandwidth())
        .attr('transform', translation(0, margin.top))
        .on('mouseover', onMouseOver)
        .on('mouseout', onMouseOut)
        .on('click', onMouseClick)
      leftBarGroupBar.exit().remove()

      let leftBarGroupText = leftBarGroup.selectAll('text')
        .data(data)
      leftBarGroupText.enter()
        .append('text')
        .merge(leftBarGroupText)
        .attr('class', 'text_data')
        .attr('x', function (d) { return xScaleRight(-xLeftValue(d)) - 5 })
        .attr('y', function (d) { return Y(d) + margin.top + yScale.bandwidth() / 2 + 5 })
        .attr('opacity', function (d) { return (xLeftValue(d) === 0) ? 0.0 : 1.0 })
        .text(function (d) { return xLeftValue(d) })
        .attr('style', 'font-size:10px;transform: scaleX(-1);-ms-transform:scaleX(-1);-moz-transform:scaleX(-1);-webkit-transform:scaleX(-1);-o-transform:scaleX(-1);')
      leftBarGroupText.exit().remove()

      let rightBarGroupBar = rightBarGroup.selectAll('.bar.right')
        .data(data)
      rightBarGroupBar.enter().append('rect')
        .attr('class', 'bar right')
        .merge(rightBarGroupBar)
        .attr('x', 0)
        .attr('y', function (d) { return Y(d) })
        .attr('width', function (d) { return XRight(d) })
        .attr('height', yScale.bandwidth())
        .attr('transform', translation(0, margin.top))
        .on('mouseover', onMouseOver)
        .on('mouseout', onMouseOut)
        .on('click', onMouseClick)
      rightBarGroupBar.exit().remove()

      let rightBarGroupText = rightBarGroup.selectAll('text')
        .attr('class', 'text_data')
        .data(data)
      rightBarGroupText.enter()
        .append('text')
        .merge(rightBarGroupText)
        .attr('x', function (d) { return XRight(d) + 5 })
        .attr('y', function (d) { return Y(d) + yScale.bandwidth() / 2 + 5 })
        .attr('opacity', function (d) { return (xRightValue(d) === 0) ? 0.0 : 1.0 })
        .text(function (d) { return xRightValue(d) })
        .attr('style', 'font-size:10px;')
        .attr('transform', translation(0, margin.top))
      rightBarGroupText.exit().remove()
      // END DRAW BARS

      // DRAW LEGEND
      let legend = svgEnter.append('g')
        .attr('transform', translation(10, 20))

      let mujer = legend.append('g')
        .attr('transform', translation(10, 10))
      mujer.append('rect')
        .attr('class', 'bar left')
        .attr('width', 12)
        .attr('height', 12)
        .attr('transform', translation(0, -10))
      mujer.append('text')
        .attr('x', 20)
        .attr('y', 0)
        .text('Mujeres')
        .attr('style', 'font-size:10px;')
      // .attr('transform', translation(30, 0));

      let hombre = legend.append('g')
        .attr('transform', translation(10, 25))
      hombre.append('rect')
        .attr('class', 'bar right')
        .attr('width', 12)
        .attr('height', 12)
        .attr('transform', translation(0, -10))
      hombre.append('text')
        .attr('x', 20)
        .attr('y', 0)
        .text('Hombres')
        .attr('style', 'font-size:10px;')

      let title = legend.append('g')
        .attr('transform', translation(10, 40))
      title.append('text')
        .attr('x', 0)
        .attr('y', 10)
        .text(titleValue)
        .attr('style', 'font-size:25px;')
      // END DRAW LEGEND
    })
  }

  function calcularMedidas () {
    innerWidth = width - margin.left - margin.right
    innerHeight = height - margin.top - margin.bottom
    regionWidth = (innerWidth / 2) - margin.middle
    pointA = (width / 2) - margin.middle
    pointB = width - regionWidth - margin.right
  }

  function translation (x, y) {
    return 'translate(' + x + ',' + y + ')'
  }

  // The x-accessor for the path generator; xScale o xValue.
  // function XLeft (d) {
  //   return xScaleLeft(xLeftValue(d))
  // }

  // The x-accessor for the path generator; xScale o xValue.
  function XRight (d) {
    return xScaleRight(xRightValue(d))
  }

  // The y-accessor for the path generator; yScale o yValue.
  function Y (d) {
    return yScale(yValue(d))
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
    regionWidth = (width / 2) - margin.middle
    return chart
  }

  chart.height = function (_) {
    if (!arguments.length) return height
    height = _
    innerHeight = height - margin.top - margin.bottom
    return chart
  }

  chart.xLeft = function (_) {
    if (!arguments.length) return xLeftValue
    xLeftValue = _
    return chart
  }

  chart.xRight = function (_) {
    if (!arguments.length) return xRightValue
    xRightValue = _
    return chart
  }

  chart.y = function (_) {
    if (!arguments.length) return yValue
    yValue = _
    return chart
  }

  chart.title = function (_) {
    if (!arguments.length) return titleValue
    titleValue = _
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
