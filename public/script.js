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
  // console.log("Map Data is ", map);

  let groupedElements = svg.append("g");
  // this is a geometry collection that holds an array of arc and line coordinates for each US state
  let stateDrawData = map.objects.states;
  let topoData = topojson.feature(map, stateDrawData).features;

  groupedElements.append("g")
    .attr("id", "states")
    .selectAll("path")
    // passes the state geometry dataset into the groupedElements array
    .data(topoData)
      // binds the above topoData coordinates to the groupedElements array so each coordinate can be drawn on the page.
      .enter()
      // appends a path (ie, draws the coordinates) from the stateDrawData dataset to the page
      .append("path")
      .attr("d", path)
      .on("click", selectState);

  groupedElements.append("path")
    //
    .datum(topojson.mesh(map, stateDrawData, function(a, b) { return a !== b; }))
    .attr("id", "state-borders")
    .attr("d", path);

});

function selectState(usState){
  fetch(`/db/donors/${usState.id}`)
  .then((r) => r.json())
  .then((data) => {
    containerDiv = document.createElement('div');

    senatorOneName = data[1].name;
    senatorOneTitle = document.createElement('h4');
    senatorOneTitle.innerText = `Senator: ${senatorOneName}`;

    senatorTwoName = data[data.length - 1].name;
    senatorTwoTitle = document.createElement('h4');
    senatorTwoTitle.innerText = `Senator: ${senatorTwoName}`;

    senatorOneDiv = document.createElement('div');
    senatorOneDiv.append(senatorOneTitle);
    senatorOneDiv = document.createElement('div');
    senatorOneDiv.append(senatorOneTitle);

    senatorTwoDiv = document.createElement('div');
    senatorTwoDiv.append(senatorTwoTitle);
    senatorTwoDiv = document.createElement('div');
    senatorTwoDiv.append(senatorTwoTitle);

    data.forEach(function(donation){
      if (donation.name == senatorOneName) {

      organizationLi = document.createElement('h5');
      organizationLi.innerText = `Donor: ${donation.org_name}`;
      senatorOneDiv.append(organizationLi);

      amountLi = document.createElement('h5');
      amountLi.innerText = `Donation Amount: $${donation.dollar_total}`;
      senatorOneDiv.append(amountLi);
    } else {
      organizationLi = document.createElement('h5');
      organizationLi.innerText = `Donor: ${donation.org_name}`;
      senatorTwoDiv.append(organizationLi);

      amountLi = document.createElement('h5');
      amountLi.innerText = `Donation Amount: $${donation.dollar_total}`;
      senatorTwoDiv.append(amountLi);
    }
    });

    containerDiv.append(senatorOneDiv);
    containerDiv.append(senatorTwoDiv);

    document.body.append(containerDiv);

  })
  .catch(error => console.log(error))
}
