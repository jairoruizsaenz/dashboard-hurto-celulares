var width = 400,
    height = 300;

var margin = {
    top: 20,
    right: 10,
    bottom: 40,
    left: 10,
};

margin.middle = 28;

var svg = d3.select('body').append('svg')
    .attr('width', margin.left + width + margin.right)
    .attr('height', margin.top + height + margin.bottom)
    .append('g')
    .attr('class', 'inner-region')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var regionWidth = (width / 2) - margin.middle;

var pointA = regionWidth,
    pointB = width - regionWidth;

var yAxisLeft = d3.svg.axis()
    .scale(yScale)
    .orient('right')
    .tickSize(4, 0)
    .tickPadding(margin.middle - 4);

var yAxisRight = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .tickSize(4, 0)
    .tickFormat('');




