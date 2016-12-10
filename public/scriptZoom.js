// this is the svg's default height and width
var width = 960;
var height = 500;
var centered = null;

var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked);

var g = svg.append("g");

d3.json("usa.json", function(error, us) {
  if (error) throw error;

  g.append("g")
    .attr("id", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
    .attr("d", path)
    .on("click", clicked);

  g.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("id", "state-borders")
      .attr("d", path);
});

function clicked(stateSelected) {
  // default centroid values
  var x = null;
  var y = null;
  var k = null;

  // if the map is NOT centered on the state selected (ie, the default state), this conditional centers the map on a given state
  if (stateSelected && centered !== stateSelected) {
    var centroid = path.centroid(stateSelected);
    console.log("stateSelected is ", stateSelected);
    console.log("centroid is ", centroid);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = stateSelected;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
      .classed("active", centered && function(stateSelected) { return stateSelected === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}
