console.log("script.js is linked");

var width = 960,
    height = 500,
    centered;

var projection = d3.geo.albersUsa()
    .scale(1070)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "map")

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);


d3.json("usa.json", function(error, map) {
  if (error) throw error;
  console.log("Map Data is ", map);

  let g = svg.append("g");

  g.append("g")
    .attr("id", "states")
    .selectAll("path")
    .data(topojson.feature(map, map.objects.states).features)
    .enter().append("path")
      .attr("d", path);

  g.append("path")
      .datum(topojson.mesh(map, map.objects.states, function(a, b) { return a !== b; }))
      .attr("id", "state-borders")
      .attr("d", path);
});
