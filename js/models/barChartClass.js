export class barChart {
  constructor (selection) {
    this.selection = selection
    this.margin = { top: 20, right: 20, bottom: 30, left: 60 },
    this.width = 400,
    this.height = 400,
    this.innerWidth = this.width - this.margin.left - this.margin.right,
    this.innerHeight = this.height - this.margin.top - this.margin.bottom,
    this.xValue = function (d) { return d[0] },
    this.yValue = function (d) { return d[1] },
    this.xScale = d3.scaleBand().padding(0.1),
    this.yScale = d3.scaleLinear(),
    this.onMouseOver = function () {},
    this.onMouseOut = function () {},
    this.onMouseClick = function () {},
    this.justOnce = true

    // The x-accessor for the path generator; xScale o xValue.
    this.X = d => this.xScale(this.xValue(d))

    // The y-accessor for the path generator; yScale o yValue.
    this.Y = d => this.yScale(this.yValue(d))
  }

  chart (selection) {
    Chart(selection)
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
        .attr('width', this.width)
        .attr('height', this.height)

      // Update the inner dimensions.
      let g = svg.merge(svgEnter).select('g')
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')

      this.xScale.rangeRound([0, this.innerWidth])
        .domain(data.map(d => this.xValue(d)))
      this.yScale.rangeRound([this.innerHeight, 0])
        .domain([0, d3.max(data, d => this.yValue(d))])

      g.select('.x.axis')
        .attr('transform', 'translate(0,' + this.innerHeight + ')')
        .call(d3.axisBottom(this.xScale))

      let EjeY = g.select('.y.axis')
        .call(d3.axisLeft(this.yScale))

      if (this.justOnce) {
        EjeY
          .append('text')
          .attr('transform', 'translate(-50,20) rotate(-90)')
          .style('font-size', '15px')
          .style('fill', 'black')
          .attr('dy', '0.71em')
          .attr('text-anchor', 'end')
          .text('Cantidad de eventos reportados')
        this.justOnce = false
      }

      let bars = g.selectAll('.bar')
        .data(d => d)

      bars.enter().append('rect')
        .attr('class', 'bar')
        .merge(bars)
        .attr('x', this.X)
        .attr('y', this.Y)
        .attr('width', this.xScale.bandwidth())
        .attr('height', d => innerHeight - this.Y(d))
        .on('mouseover', this.onMouseOver)
        .on('mouseout', this.onMouseOut)
        .on('click', this.onMouseClick)
      // .append("svg:title")
      //  .text(function(d) { return d.value; });

      bars.exit().remove()
    })

    this.margin = function (_) {
      if (!arguments.length) return this.margin
      this.margin = _
      return this
    }

    this.width = function (_) {
      if (!arguments.length) return this.width
      this.width = _
      this.innerWidth = this.width - this.margin.left - this.margin.right
      return this
    }

    this.height = function (_) {
      if (!arguments.length) return this.height
      this.height = _
      this.innerHeight = this.height - this.margin.top - this.margin.bottom
      return this
    }

    this.x = function (_) {
      if (!arguments.length) return this.xValue
      this.xValue = _
      return this
    }

    this.y = function (_) {
      if (!arguments.length) return this.yValue
      this.yValue = _
      return this
    }

    this.onMouseOver = function (_) {
      if (!arguments.length) return this.onMouseOver
      this.onMouseOver = _
      return this
    }

    this.onMouseOut = function (_) {
      if (!arguments.length) return this.onMouseOut
      this.onMouseOut = _
      return this
    }

    this.onMouseClick = function (_) {
      if (!arguments.length) return this.onMouseClick
      this.onMouseClick = _
      return this
    }

    return this
  }
}
