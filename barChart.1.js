/* global d3 */

function genderChart(selection) {
  var
    margin = { top: 20, right: 20, bottom: 30, left: 40, middle: 28 },
    width = 200,
    height = 400,
    regionWidth = (width / 2) - margin.middle,
    pointA = regionWidth,
    pointB = width - regionWidth,
    innerWidth = width - margin.left - margin.right,
    innerHeight = height - margin.top - margin.bottom,
    yValue = function (d) { return d[0]; },
    xLeftValue = function (d) { return d[1]; },
    xRightValue = function (d) { return d[2]; },
    xScale = d3.scaleLinear(),
    xScaleLeft = d3.scaleLinear()
      .range([regionWidth, 0]),
    xScaleRight = d3.scaleLinear()
      .range([0, regionWidth]),
    yScale = d3.scaleBand()
      .range([height, 0])
      .paddingInner(0.05);

  // SET UP AXES
  var yAxisLeft = d3.axisRight()
    .scale(yScale)
    .tickSize(4, 0)
    .tickPadding(margin.middle - 4);

  var yAxisRight = d3.axisLeft()
    .scale(yScale)
    .tickSize(4, 0)
    .tickFormat('');

  var xAxisRight = d3.axisBottom()
    .scale(xScale)
    .ticks(3)
    .tickFormat('');

  var xAxisLeft = d3.axisBottom()
    // REVERSE THE X-AXIS SCALE ON THE LEFT SIDE BY REVERSING THE RANGE
    .scale(xScale.copy().range([pointA, 0]))
    .ticks(3)
    .tickFormat('');






  function chart(selection) {
    selection.each(function (data) {

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      // Otherwise, create the skeletal chart.
      var svgEnter = svg.enter().append("svg");



      yScale.range([height, 0])
        .domain(data.map(function (d) { return yValue(d); }));
      xScale.range([regionWidth, 0])
        .domain([0, d3.max(data, function (d) { return xLeftValue(d); })]);
      xScaleLeft.range([regionWidth, 0])
        .domain([0, d3.max(data, function (d) { return xLeftValue(d); })]);
      xScaleRight.range([0, regionWidth])
        .domain([0, d3.max(data, function (d) { return xRightValue(d); })]);

      // DRAW AXES
      svgEnter.append('g')
        .attr('class', 'axis y left')
        .attr('transform', translation(pointA, 0))
        .call(yAxisLeft)
        .selectAll('text')
        .style('text-anchor', 'middle');

      svgEnter.append('g')
        .attr('class', 'axis y right')
        .attr('transform', translation(pointB, 0))
        .call(yAxisRight);

      svgEnter.append('g')
        .attr('class', 'axis x left')
        .attr('transform', translation(0, height))
        .call(xAxisLeft);

      svgEnter.append('g')
        .attr('class', 'axis x right')
        .attr('transform', translation(pointB, height))
        .call(xAxisRight);
      // END DRAW AXES

      // MAKE GROUPS FOR EACH SIDE OF CHART
      // scale(-1,1) is used to reverse the left side so the bars grow left instead of right
      var leftBarGroup = svgEnter.append('g')
        .attr('transform', translation(pointA, 0) + 'scale(-1,1)');
      var rightBarGroup = svgEnter.append('g')
        .attr('transform', translation(pointB, 0));


      // DRAW BARS
      leftBarGroup.selectAll('.bar.left')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar left')
        .attr('x', 0)
        .attr('y', function (d) { return yScale(yValue(d)); })
        .attr('width', function (d) { return xScale(xLeftValue(d)); })
        .attr('height', yScale.bandwidth());

      // leftBarGroup.selectAll("text")
      //   .attr('class', 'text_data')
      //   .data(data)
      //   .enter()
      //   .append("text")
      //   .attr('x', function (d) { return -xScale(percentage(d.male)) - 28; })
      //   .attr('y', function (d) { return yScale(d.group) + yScale.bandwidth() / 2 + 5; })
      //   .text(function (d) { return d3.format(".2%")(percentage(d.male)) })
      //   .attr('style', 'font-size:10px;transform: scaleX(-1);-ms-transform:scaleX(-1);-moz-transform:scaleX(-1);-webkit-transform:scaleX(-1);-o-transform:scaleX(-1);');

      rightBarGroup.selectAll('.bar.right')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar right')
        .attr('x', 0)
        .attr('y', function (d) { return yScale(yValue(d)); })
        .attr('width', function (d) { return xScaleRight(xRightValue(d)); })
        .attr('height', yScale.bandwidth());

      // rightBarGroup.selectAll("text")
      //   .attr('class', 'text_data')
      //   .data(data)
      //   .enter()
      //   .append("text")
      //   .attr('x', function (d) { return xScale(percentage(d.female)) + 5; })
      //   .attr('y', function (d) { return yScale(d.group) + yScale.bandwidth() / 2 + 5; })
      //   .text(function (d) { return d3.format(".2%")(percentage(d.female)) })
      //   .attr('style', 'font-size:10px;');;
      // END DRAW BARS




      // var gEnter = svgEnter.append("g");
      // gEnter.append("g").attr("class", "x axis");
      // gEnter.append("g").attr("class", "y axis");

      // Update the outer dimensions.
      // svg.merge(svgEnter)
      //   .attr("width", width)
      //   .attr("height", height);

      // Update the inner dimensions.
      // var g = svg.merge(svgEnter).select("g")
      //   .attr("width", width)
      //   .attr("height", height)
      //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      // g.select(".x.axis")
      //   .attr("transform", "translate(0," + innerHeight + ")")
      //   .call(d3.axisBottom(xScale));

      // g.select(".y.axis")
      //   .call(d3.axisLeft(yScale))
      //   .append("text")
      //   .attr("transform", "rotate(-90)")
      //   .attr("y", 6)
      //   .attr("dy", "0.71em")
      //   .attr("text-anchor", "end")
      //   .text("Frequency");

      // var bars = g.selectAll(".bar")
      //   .data(function (d) { return d; });

      // bars.enter().append("rect")
      //   .attr("class", "bar")
      //   .merge(bars)
      //   .attr("x", X)
      //   .attr("y", Y)
      //   .attr("width", xScale.bandwidth())
      //   .attr("height", function (d) { return innerHeight - Y(d); });

      // bars.exit().remove();
    });

  }

  function translation(x, y) {
    return 'translate(' + x + ',' + y + ')';
  }

  // The x-accessor for the path generator; xScale o xValue.
  function XLeft(d) {
    return xScaleLeft(xLeftValue(d));
  }

  // The x-accessor for the path generator; xScale o xValue.
  function XRight(d) {
    return xScaleRight(xRightValue(d));
  }

  // The y-accessor for the path generator; yScale o yValue.
  function Y(d) {
    return yScale(yValue(d));
  }

  chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    innerWidth = width - margin.left - margin.right;
    regionWidth = (width / 2) - margin.middle;
    return chart;
  };

  chart.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    innerHeight = height - margin.top - margin.bottom;
    return chart;
  };

  chart.xLeft = function (_) {
    if (!arguments.length) return xLeftValue;
    xLeftValue = _;
    return chart;
  };

  chart.xRight = function (_) {
    if (!arguments.length) return xRightValue;
    xRightValue = _;
    return chart;
  };

  chart.y = function (_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  return chart;
}