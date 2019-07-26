var margin = { top: 50, right: 300, bottom: 50, left: 50, middle: 50 },
    outerWidth = 1700,
    outerHeight = 700,
    scatterWidth = 1700,
    scatterHeight = 700,
    timeWidth = 1050,
    timeHeight = 300,
    width = scatterWidth - margin.left - margin.right,
    height = scatterHeight - margin.top - margin.bottom,
    tWidth = timeWidth - margin.left - margin.right,
    tHeight = timeHeight - margin.top - margin.bottom,
    translation = height + margin.middle;

var x = d3.scale.linear().range([0, width]).nice();

var y = d3.scale.linear().range([height, 0]).nice();

var colorCat = "Year Most Popular";

var xTime = d3.scale.linear().range([0, tWidth]).nice();

var yTime = d3.scale.linear().range([tHeight, 0]).nice();


d3.csv("name_trends.csv", function(data) {
  data.forEach(function(d) {
    d.name = d.name;
    d.x = d.x;
    d.y = d.y;
    d.year = d.year;
    d.sex = d.sex;
  });

  var xMax = d3.max(data, function(d) { return d.x; }) * 1.05,
      xMin = d3.min(data, function(d) { return d.x; }),
      xMin = xMin > 0 ? 0 : xMin,
      yMax = d3.max(data, function(d) { return d.y; }) * 1.05,
      yMin = d3.min(data, function(d) { return d.y; }),
      yMin = yMin > 0 ? 0 : yMin;


  var txMax = 2014,
      txMin = 1937,
      tyMax = 1,
      tyMin = 0;

  xTime.domain([txMin, txMax]);
  yTime.domain([tyMin, tyMax]);


  x.domain([xMin, xMax]);
  y.domain([yMin, yMax]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width);


  var txAxis = d3.svg.axis()
        .scale(xTime)
        .orient("bottom")
        .tickSize(-tHeight);

  var tyAxis = d3.svg.axis()
        .scale(yTime)
        .orient("left")
        .tickSize(-tWidth);

  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return  d.name + "<br>" + 'Peak Year' + ": " + d.year;
      });

  var zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);

  var svg = d3.select("#scatter")
    .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoomBeh);

  svg.call(tip);

  svg.append("rect")
      .attr("width", width)
      .attr("height", height);
  

  svg.append("g")
      .classed("x axis", true)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .classed("label", true)
      .attr("x", width)
      .attr("y", margin.bottom - 10)
      .style("text-anchor", "end");


  svg.append("g")
      .classed("y axis", true)
      .call(yAxis)
    .append("text")
      .classed("label", true)
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("dy", ".71em")
      .style("text-anchor", "end");


  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

  objects.append("svg:line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");

  objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);

  objects.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .classed("dot", true)
      .attr("r", 3)
      .attr("transform", transform)
      .style("fill", function(d) {if (d.sex == 'male') {return d3.interpolateBlues((d.year - 1937)/(2035-1937) + 0.18)} else {return d3.interpolateReds((d.year - 1937)/(2055-1937) + 0.18)}; })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

    svg.append('rect')
    .attr('width', tWidth)
    .attr('height', tHeight)
    .attr('transform', 'translate(0,' + translation + ')');





  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("transform", transform);
  }

  function transform(d) {
    return "translate(" + x(d['x']) + "," + y(d['y']) + ")";
  }
});
