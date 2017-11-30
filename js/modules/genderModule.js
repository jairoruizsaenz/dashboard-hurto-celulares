/* global d3 */

function genderChart(selection) {
    var
        margin = { top: 20, right: 20, bottom: 30, left: 20, middle: 28 },
        width = 200,
        height = 400,
        yValue = function (d) { return d[0]; },
        xLeftValue = function (d) { return d[1]; },
        xRightValue = function (d) { return d[2]; },
        titleValue = "",

        xScale = d3.scaleLinear(),
        xScaleLeft = d3.scaleLinear(),
        xScaleRight = d3.scaleLinear(),
        yScale = d3.scaleBand(),

        innerWidth = 0,
        innerHeight = 0,
        regionWidth = 0,
        pointA = 0,
        pointB = 0;

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
        .scale(xScaleRight)
        .ticks(5);
    // .tickFormat('');

    var xAxisLeft = d3.axisBottom()
        // REVERSE THE X-AXIS SCALE ON THE LEFT SIDE BY REVERSING THE RANGE
        // .scale(xScale.copy().range([pointA, 0]))
        .scale(xScaleLeft)
        .ticks(5);
    // .tickFormat('');

    function chart(selection) {
        selection.each(function (data) {

            calcularMedidas();
            console.log("data genderModule", data);
            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);

            // Otherwise, create the skeletal chart.
            var svgEnter = svg.enter().append("svg")
                .attr("width", width)
                .attr("height", height);

            yScale.range([innerHeight, 0])
                .domain(data.map(function (d) { return yValue(d); }))
                .paddingInner(0.05);
            xScaleLeft.range([regionWidth, 0])
                .domain([0, d3.max(data, function (d) { return d3.max([xLeftValue(d), xRightValue(d)]); }) * 1.15]);
            xScaleRight.range([0, regionWidth])
                .domain([0, d3.max(data, function (d) { return d3.max([xLeftValue(d), xRightValue(d)]); }) * 1.15]);

            // DRAW AXES
            svgEnter.append('g')
                .attr('class', 'axis y left')
                .attr('transform', translation(pointA, margin.top))
                .call(yAxisLeft)
                .selectAll('text')
                .style('text-anchor', 'middle');

            svgEnter.append('g')
                .attr('class', 'axis y right')
                .attr('transform', translation(pointB - 1, margin.top))
                .call(yAxisRight);

            svgEnter.append('g')
                .attr('class', 'axis x left')
                .attr('transform', translation(margin.left, innerHeight + margin.top))
                .call(xAxisLeft);

            svgEnter.append('g')
                .attr('class', 'axis x right')
                .attr('transform', translation(pointB, innerHeight + margin.top))
                .call(xAxisRight);
            // END DRAW AXES

            // MAKE GROUPS FOR EACH SIDE OF CHART
            // scale(-1,1) is used to reverse the left side so the bars grow left instead of right
            var leftBarGroup = svgEnter.append('g')
                .attr('transform', translation(pointA, 0) + 'scale(-1, 1)');
            var rightBarGroup = svgEnter.append('g')
                .attr('transform', translation(pointB, 0));

            console.log("data", data);
            // DRAW BARS
            leftBars = leftBarGroup.selectAll('.bar.left')
                .data(data);
            leftBars.enter().append('rect')
                .attr('class', 'bar left')
                .merge(leftBars)
                .attr('x', 0)
                .attr('y', function (d) { return Y(d); })
                .attr('width', function (d) { return xScaleRight(xLeftValue(d)); })
                .attr('height', yScale.bandwidth())
                .attr('transform', translation(0, margin.top));

            // console.log("leftBarGroupEnter: ", leftBarGroupEnter.size());
            console.log("leftBarGroup: ", leftBars.size());
            console.log("leftBarGroup.enter(): ", leftBars.enter().size());
            console.log("leftBarGroup.exit(): ", leftBars.exit().size());


            // leftBarGroup.selectAll("text")
            //     .attr('class', 'text_data')
            //     .data(data)
            //     .enter()
            //     .append("text")
            //     .attr('x', function (d) { return xScaleRight(-100 - xLeftValue(d)); })
            //     .attr('y', function (d) { return Y(d) + margin.top + yScale.bandwidth() / 2 + 5; })
            //     .text(function (d) { return xLeftValue(d); })
            //     .attr('style', 'font-size:10px;transform: scaleX(-1);-ms-transform:scaleX(-1);-moz-transform:scaleX(-1);-webkit-transform:scaleX(-1);-o-transform:scaleX(-1);');

            rightBarGroup.selectAll('.bar.right')
                .data(data)
                .enter().append('rect')
                .attr('class', 'bar right')
                .merge(rightBarGroup)
                .attr('x', 0)
                .attr('y', function (d) { return Y(d); })
                .attr('width', function (d) { return XRight(d); })
                .attr('height', yScale.bandwidth())
                .attr('transform', translation(0, margin.top));

            rightBarGroup.selectAll("text")
                .attr('class', 'text_data')
                .data(data)
                .enter()
                .append("text")
                .merge(rightBarGroup)
                .attr('x', function (d) { return XRight(d) + 5; })
                .attr('y', function (d) { return Y(d) + yScale.bandwidth() / 2 + 5; })
                .text(function (d) { return xRightValue(d) })
                .attr('style', 'font-size:10px;')
                .attr('transform', translation(0, margin.top));

            leftBarGroup.exit().remove();
            rightBarGroup.exit().remove();
            // END DRAW BARS

            // DRAW LEGEND
            var legend = svgEnter.append("g")
                .attr('transform', translation(10, 20));

            var mujer = legend.append("g")
                .attr('transform', translation(10, 10));
            mujer.append('rect')
                .attr('class', 'bar left')
                .attr("width", 12)
                .attr("height", 12)
                .attr('transform', translation(0, -10));
            mujer.append("text")
                .attr('x', 20)
                .attr('y', 0)
                .text("Mujeres")
                .attr('style', 'font-size:10px;');
            // .attr('transform', translation(30, 0));

            var hombre = legend.append("g")
                .attr('transform', translation(10, 25));
            hombre.append('rect')
                .attr('class', 'bar right')
                .attr("width", 12)
                .attr("height", 12)
                .attr('transform', translation(0, -10));
            hombre.append("text")
                .attr('x', 20)
                .attr('y', 0)
                .text("Hombres")
                .attr('style', 'font-size:10px;');

            var title = legend.append("g")
                .attr('transform', translation(10, 40));
            title.append("text")
                .attr('x', 0)
                .attr('y', 10)
                .text(titleValue)
                .attr('style', 'font-size:25px;');
            // END DRAW LEGEND
        });
    }

    function calcularMedidas() {
        innerWidth = width - margin.left - margin.right;
        innerHeight = height - margin.top - margin.bottom;
        regionWidth = (innerWidth / 2) - margin.middle;
        pointA = (width / 2) - margin.middle;
        pointB = width - regionWidth - margin.right;
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

    chart.title = function (_) {
        if (!arguments.length) return titleValue;
        titleValue = _;
        return chart;
    };

    return chart;
}