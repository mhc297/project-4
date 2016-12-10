console.log("script.js is linked");

var width = 960;
var height = 500;
var centered;

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
  if ((error) => console.log(error));
  console.log("Map Data is ", map);

  let groupedElements = svg.append("g");
  // this is a geometry collection that holds an array of arc and line coordinates for each US state
  let stateDrawData = map.objects.states;
  let topoData = topojson.feature(map, stateDrawData).features
  console.log("stateDrawData is ", stateDrawData)

  groupedElements.append("g")
    .attr("id", "states")
    .selectAll("path")
    // passes the state geometry dataset into the groupedElements array
    .data(topoData)
      // binds the above stateDraw coordinates to the groupedElements array so they can be drawn on the page.
      .enter()
      // appends a path (ie, draws the coordinates) from the stateDrawData dataset to the page
      .append("path")
      .attr("d", path)
      console.log("topojson is ", topojson);

  groupedElements.append("path")
    .datum(topojson.mesh(map, map.objects.states, function(a, b) { return a !== b; }))
    .attr("id", "state-borders")
    .attr("d", path);
    console.log("map.objects.states is ", map.objects.states);
});

// function selectState(usState){

// }
