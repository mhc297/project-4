document.addEventListener("DOMContentLoaded", function(event) {
  console.log("script.js is linked");
  populateDonorDropdown();
  getLargestDonors();
});



let heatMapped = [1, 2, 3, 4];
heatMapped.className = 'heatMapped';

// map build was adapted from: http://bl.ocks.org/mbostock/10024231 & https://bost.ocks.org/mike/map/
let width = 960;
let height = 500;
let centered;

// defines the projection (ie scale) properties for the svg
let projection = d3.geo.albersUsa()
    .scale(1070)
    .translate([width / 2, height / 2]);

// defines the path generator, will create multiple shapes and straight lines to render the map as a svg
let path = d3.geo.path()
    .projection(projection);

// defines the svg properties and a hook that will hang onto the main page
let svg = d3.select("#map-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("id", "map")

svg.append("rect")
  .attr("class", "background")
  .attr("width", width)
  .attr("height", height)
  .on("click", searchByState);

let groupedElements = svg.append("g");

// list of the states by their geoJSON id, will be called into the d3 tip below.
const geojsonIDs = {
  1: "AL",
  2: "AK",
  4: "AZ",
  5: "AR",
  6: "CA",
  8: "CO",
  9: "CT",
  10: "DE",
  12: "FL",
  13: "GA",
  15: "HI",
  16: "ID",
  17: "IL",
  18: "IN",
  19: "IA",
  20: "KS",
  21: "KY",
  22: "LA",
  23: "ME",
  24: "MD",
  25: "MA",
  26: "MI",
  27: "MN",
  28: "MS",
  29: "MO",
  30: "MT",
  31: "NE",
  32: "NV",
  33: "NH",
  34: "NJ",
  35: "NM",
  36: "NY",
  37: "NC",
  38: "ND",
  39: "OH",
  40: "OK",
  41: "OR",
  42: "PA",
  44: "RI",
  45: "SC",
  46: "SD",
  47: "TN",
  48: "TX",
  49: "UT",
  50: "VT",
  51: "VA",
  53: "WA",
  54: "WV",
  55: "WI",
  56: "WY"
};

// calls d3 Tooltip, a technology that builds labels (shows the states abr on the page)
let tip = d3.tip()
  .attr('class', 'd3-tip')
  .html(function(state) {
    return geojsonIDs[state.id]
  });

// appends the tooltip to the d3 svg
svg.call(tip);

// imports in the usa.json file which contains the map data that will be drawn onto the page by the path generator
d3.json("usa.json", function(error, map) {
  if ((error) => console.log(error));
  // console.log("Map Data is ", map);

  // this is a geometry collection that holds an array of arc and line coordinates for each US state
  let stateDrawData = map.objects.states;
  // groups the feature collections (ie state names) and geographic details to be passed to the path generator
  let topoData = topojson.feature(map, stateDrawData).features;

  let heatMapped = [1, 2, 3, 4];

  // topoData.forEach(function(data) {
  //   // console.log(data.id)
  //   if (data.id in heatMapped)
  //   // console.log(data.id)
  // })

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
      .on("click", searchByState)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  // draws the state borders
  groupedElements.append("path")
    .datum(topojson.mesh(map, stateDrawData, function(a, b) {
      return a !== b;
    })
    )
    .attr("id", "state-borders")
    .attr("d", path);
});

// takes the dollar amounts stored as strings to dollar values
function convertString(string){
  let integer =  parseInt(string);
  return integer.toLocaleString()
};

// get the 10 largest campaign donations from the database and renders to the page on open
function getLargestDonors(){
  fetch('db/donors/largest')
  .then((r) => r.json())
  .then((response) => {

    donationContainer = document.getElementById('donation-container');
    donationContainer.innerText = '';
    donationContainerHeadline = document.createElement('div');
    donationContainerHeadline.innerText = 'Largest Donations (Nationally)';
    donationContainerHeadline.className = 'donationContainerHeadline';
    donationContainer.append(donationContainerHeadline);

    response.forEach(function(donation){
      donationRow = document.createElement('TR');
      if (donation.party == 'Republican') {
        donationRow.style.color = '#E91D0E';
      } if (donation.party == 'Democrat') {
        donationRow.style.color = '#232066';
      } if (donation.party == 'Independent') {
        donationRow.style.color = '#0F7F12';
      }

      donationTitleRow = document.createElement('div');
      donationTitleRow.className = 'donationTitleRow'
      donationTableDonor = document.createElement('h5');
      donationTableDonor.innerText = `${donation.org_name}`;
      donationTitleRow.append(donationTableDonor);

      donationTable = document.createElement('Table');
      donationTable.className = 'donation-table';

      donationTableSenator = document.createElement('TD');
      donationTableSenatorItem = document.createElement('p');
      donationTableSenatorItem.innerText = `${donation.name}`;
      donationTableSenator.append(donationTableSenatorItem);
      donationRow.append(donationTableSenator);

      donationTableState = document.createElement('TD');
      donationTableStateItem = document.createElement('p');
      donationTableStateItem.innerText = `${donation.state_abr}`;
      donationTableState.append(donationTableStateItem);
      donationRow.append(donationTableState);

      donationTableTotal = document.createElement('TD');
      donationTableTotalItem = document.createElement('p');
      donationTableTotalItem.innerText = `$${convertString(donation.dollar_total)}`
      donationTableTotal.append(donationTableTotalItem);
      donationRow.append(donationTableTotal);

      donationContainer.append(donationTitleRow);
      donationTable.append(donationRow);
      // donationContainerContainer.append(donationTable);
      donationContainer.append(donationTable);
    })
  })
  .catch(error => console.log(error))
};

// hits the sql database and populates the donor drop-down menu
function populateDonorDropdown(){
  let donorArray = []
  fetch('/db/donors/donorList')
  .then((r) => r.json())
  .then((donorList) => {
    donorList.forEach(function(donor){
    donorArray.push(donor.org_name)
  })

  let select = document.getElementById('donor-dropdown');
  for(let i = 0; i < donorArray.length; i++) {
    let option = document.createElement('option');
    option.innerHTML = donorArray[i];
    option.value = donorArray[i];
    select.appendChild(option);

  }
  });
};

// this function renders the donor data when a given state is clicked. The states id is passed as the event of the click
function searchByState(usState){
  let stateToShowNow = usState;
  // default centroid values, will be assigned values when the user clicks on a state
  let x = null;
  let y = null;
  let stroke;

  // adapted from: http://bl.ocks.org/mbostock/2206590
  // if the map is NOT centered on the state selected (ie, the default state), this conditional centers the map on a given state
  if (usState && centered !== usState) {
    let centroid = path.centroid(usState);
    x = centroid[0];
    y = centroid[1];
    stroke = 4;
    centered = usState;
  } else {
    x = width / 2;
    y = height / 2;
    stroke = 1;
    centered = null;
  }

  // adds a class of active to all the states (the grouped objects)
  groupedElements.selectAll("path")
      .classed("active", centered && function(usState) { return usState === centered; });

  groupedElements.transition()
      .duration(1250)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + stroke + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", (2 / stroke) + "px");

      // when the user clicks an area within the svg that is not a US state (ie, an ocean or outside the map),
      // usState will be undefined, so that resets the map an shows the largest donations by default
  if (usState === undefined) {
    getLargestDonors();
  }
    // if the user clicks on a US state, its geoJSON id is grabbed and run into the sql database
    // to return all campaign donations related to that state
  else {
    fetch(`/db/donors/${usState.id}`)
    .then((r) => r.json())

    // the response is going to an array of 20 items per state clicked (2 senators times 10 donors each)
    .then((data) => {

      // vanilla JS DOM manipulation to create the modal that will display the data
      containerDiv = document.createElement('div');
      containerDiv.className = "containerDiv";
      containerDiv.innerHTML = "";
      headlineContainer = document.createElement('div');
      headlineContainer.className = 'headline-container';
      masterContainer = document.getElementById('donation-container');
      masterContainer.innerHTML = '';
      stateName = document.createElement('h3')
      stateName.innerText = `${data[0].state}`;
      headlineContainer.append(stateName);

      masterContainer.append(headlineContainer);

      // grabs the first senators name (the data is returned ordered by senator)
      senatorOneName = data[1].name;
      senatorOneParty = data[1].party;
      senatorOneTitle = document.createElement('h5');
      senatorOneTitle.innerText = `${senatorOneName}`;

      // sets the senator's label font color dependent on their party
      if (senatorOneParty == 'Democrat'){
        senatorOneTitle.style.color = '#232066';
      } if (senatorOneParty == 'Republican'){
        senatorOneTitle.style.color = '#E91D0E';
      } if (senatorOneParty == 'Independent') {
        senatorOneTitle.style.color = '#0F7F12';
      };

      // grabs the senators name
      senatorTwoName = data[data.length - 1].name;
      senatorTwoParty = data[data.length - 1].party;
      senatorTwoTitle = document.createElement('h5');
      senatorTwoTitle.innerText = `${senatorTwoName}`;

      // sets the senator's label font color dependent on their party
      if (senatorTwoParty == 'Democrat'){
        senatorTwoTitle.style.color = '#232066';
      } if (senatorTwoParty ==='Republican'){
        senatorTwoTitle.style.color = '#E91D0E';
      } if (senatorTwoParty == 'Independent') {
        senatorTwoTitle.style.color = '#0F7F12';
      };

      // more vanilla JS to create holder divs for styling
      senatorOneDiv = document.createElement('div');
      senatorOneDiv.append(senatorOneTitle);
      senatorOneDiv = document.createElement('div');
      senatorOneDiv.append(senatorOneTitle);
      senatorOneDiv.className = "senatorDiv";

      // same as above but for the second senator
      senatorTwoDiv = document.createElement('div');
      senatorTwoDiv.append(senatorTwoTitle);
      senatorTwoDiv = document.createElement('div');
      senatorTwoDiv.append(senatorTwoTitle);
      senatorTwoDiv.className = "senatorDiv";

      // this forEach loops through the donations and groups the donation with its appropriate senator
      data.forEach(function(donation){

        //
        if (donation.name == senatorOneName) {

          eachDonationDivSenOne = document.createElement('div');
          eachDonationDivSenOne.className = "donationDiv";

          organizationLi = document.createElement('p');
          organizationLi.innerText = `${donation.org_name}`;
          organizationLi.style.fontWeight = 'bold';
          eachDonationDivSenOne.append(organizationLi);

          amountLi = document.createElement('p');
          amountLi.innerText = `Donation Amount: $${convertString(donation.dollar_total)}`;
          eachDonationDivSenOne.append(amountLi);

          pacLi = document.createElement('p');
          pacLi.innerText = `Donations From PACs: $${convertString(donation.dollar_pac)}`;
          eachDonationDivSenOne.append(pacLi);

          indivLi = document.createElement('p');
          indivLi.innerText = `Donations From Individuals: $${convertString(donation.dollar_individual)}`;
          eachDonationDivSenOne.append(indivLi);

          senatorOneDiv.append(eachDonationDivSenOne);

        } else {

          eachDonationDivSenTwo = document.createElement('div');
          eachDonationDivSenTwo.className = "donationDiv";

          organizationLi = document.createElement('p');
          organizationLi.innerText = `${donation.org_name}`;
          organizationLi.style.fontWeight = 'bold';
          eachDonationDivSenTwo.append(organizationLi);

          amountLi = document.createElement('p');
          amountLi.innerText = `Donation Amount: $${convertString(donation.dollar_total)}`;
          eachDonationDivSenTwo.append(amountLi);

          pacLi = document.createElement('p');
          pacLi.innerText = `Donations From PACs: $${convertString(donation.dollar_pac)}`;
          eachDonationDivSenTwo.append(pacLi);

          indivLi = document.createElement('p');
          indivLi.innerText = `Donations From Individuals: $${convertString(donation.dollar_individual)}`;
          eachDonationDivSenTwo.append(indivLi);

          senatorTwoDiv.append(eachDonationDivSenTwo)
        };
      });

      containerDiv.append(senatorOneDiv);
      containerDiv.append(senatorTwoDiv);
      masterContainer.append(containerDiv);

    })
    .catch(error => console.log("ERROR", error))
  }
};

// creates the modal table for donations sorted by donor
function createTable(){
  donorTable = document.getElementById('donor-table');

  tableHeadSen = document.createElement('TH');
  tableHeadSen.innerText = 'Senator';
  tableHeadSen.append(donorTable);

  tableHeadState = document.createElement('TH');
  tableHeadState.innerText = 'State';
  tableHeadState.append(donorTable);

  tableHeadTotal = document.createElement('TH');
  tableHeadTotal.innerText = 'Donation'
  tableHeadTotal.append(donorTable);
};

// creates the modal which displays BY DONOR
function searchByDonor(){
  let drop = document.getElementById('donor-dropdown');
  let dropValue = drop.options[drop.selectedIndex].value
  fetch(`/db/donors/byDonor/${dropValue}`)
  .then((r) => r.json())
  .then((data) => {

    heatMapped = [];
    donorTable = document.getElementById('donor-table');
    modal = document.getElementById('donor-modal');
    modalTitle = document.getElementById('modal-title');
    modalTitle.innerHTML = `${data[0].org_name}`
    donorTable.innerHTML = '';

    tableHeadSen = document.createElement('TH');
    tableHeadSen.innerText = 'Senator';
    donorTable.append(tableHeadSen);

    tableHeadState = document.createElement('TH');
    tableHeadState.innerText = 'State';
    donorTable.append(tableHeadState);

    tableHeadTotal = document.createElement('TH');
    tableHeadTotal.innerText = 'Donation'
    donorTable.append(tableHeadTotal);

    donorTable = document.getElementById('donor-table');
     data.forEach(function(result){
      newRow = document.createElement('TR');
      newRow.className = 'tableRow'
      newSen = document.createElement('TD');
      newSen.innerText = `${result.name}`
      newRow.append(newSen)

      newState = document.createElement('TD');
      newState.innerText = `${result.state}`
      newRow.append(newState);

      newTotal = document.createElement('TD');
      newTotal.innerText = `$${convertString(result.dollar_total)}`

      newRow.append(newTotal);
      if (result.party == 'Republican') {
        newRow.style.backgroundColor = '#E91D0E';
      } if (result.party == 'Democrat') {
        newRow.style.backgroundColor = '#232066';
      } if (result.party == 'Independent') {
        newRow.style.backgroundColor = '#0F7F12';
      };

      // newRow.style.backgroundColor = 'black';

      donorTable.append(newRow);

      modal.style.display = 'block';
      donorTable.style.display = 'block';

      modal.addEventListener('click', function (){
        modal.style.display = 'none';
      });

      let heatMapItem = result.geojson_id
      heatMapped.push(heatMapItem)
    })

      console.log("heatMapped array is now ", heatMapped);
  })
  .catch(error => console.log(error));
};

let dropButton = document.getElementById('drop-button');
dropButton.addEventListener("click", searchByDonor);


