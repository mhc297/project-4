document.addEventListener("DOMContentLoaded", function(event) {
  console.log("script.js is linked");
  getDonors();
  getLargestDonations();
});

let heatMapped = [1, 2, 3, 4];
heatMapped.className = 'heatMapped';

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
  .attr("height", height);

let groupedElements = svg.append("g");
var abr;

let tip = d3.tip()
  .attr('class', 'd3-tip')
  .html(function(d) {
    return d.id;
  });

svg.call(tip);

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
      .on("click", selectState)
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

// get the 10 largest campaign donations from the database and renders to the page on open
function getLargestDonations(){
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
      donationTableTotalItem.innerText = `$${donation.dollar_total}`
      donationTableTotal.append(donationTableTotalItem);
      donationRow.append(donationTableTotal);

      donationContainer.append(donationTitleRow);
      donationTable.append(donationRow);

      donationContainer.append(donationTable);
    })
  })
  .catch(error => console.log(error))
};


// this function renders the donor data when a given state is clicked. The states id is passed as the event of the click
function selectState(usState){
  console.log("RUNNING")
  // default centroid values
  let x = null;
  let y = null;
  let stroke;

  // if the map is NOT centered on the state selected (ie, the default state), this conditional centers the map on a given state
  if (usState && centered !== usState) {
    let centroid = path.centroid(usState);
    // console.log("usState is ", usState);
    console.log("centroid is ", centroid);
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

  groupedElements.selectAll("path")
      .classed("active", centered && function(usState) { return usState === centered; });

  groupedElements.transition()
      .duration(1250)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + stroke + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", (2 / stroke) + "px");

  // calls the sql database
  fetch(`/db/donors/${usState.id}`)
  .then((r) => r.json())
  // the response is going to an array of 20 items per state clicked (2 senators * 10 donors)
  .then((data) => {
    // console.log("donor data is ", data);
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

    // creates the button that will clear the donation and grabs the largest donations again (the default state)
    clearButton = document.createElement('button');
    clearButton.className = 'clearMasterButton'
    clearButton.innerText = 'Clear';
    clearButton.addEventListener('click', getLargestDonations);
    headlineContainer.append(clearButton);

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

    senatorOneDiv = document.createElement('div');
    senatorOneDiv.append(senatorOneTitle);
    senatorOneDiv = document.createElement('div');
    senatorOneDiv.append(senatorOneTitle);
    senatorOneDiv.className = "senatorDiv";

    senatorTwoDiv = document.createElement('div');
    senatorTwoDiv.append(senatorTwoTitle);
    senatorTwoDiv = document.createElement('div');
    senatorTwoDiv.append(senatorTwoTitle);
    senatorTwoDiv.className = "senatorDiv";

    // this forEach loops through the donations and groups the donation with its appropriate senator
    data.forEach(function(donation){

      if (donation.name == senatorOneName) {

        eachDonationDivSenOne = document.createElement('div');
        eachDonationDivSenOne.className = "donationDiv";

        organizationLi = document.createElement('p');
        organizationLi.innerText = `${donation.org_name}`;
        organizationLi.style.fontWeight = 'bold';
        eachDonationDivSenOne.append(organizationLi);

        amountLi = document.createElement('p');
        amountLi.innerText = `Donation Amount: $${donation.dollar_total}`;
        eachDonationDivSenOne.append(amountLi);

        pacLi = document.createElement('p');
        pacLi.innerText = `Donations From PACs: $${donation.dollar_pac}`;
        eachDonationDivSenOne.append(pacLi);

        indivLi = document.createElement('p');
        indivLi.innerText = `Donations From Individuals: $${donation.dollar_individual}`;
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
        amountLi.innerText = `Donation Amount: $${donation.dollar_total}`;
        eachDonationDivSenTwo.append(amountLi);

        pacLi = document.createElement('p');
        pacLi.innerText = `Donations From PACs: $${donation.dollar_pac}`;
        eachDonationDivSenTwo.append(pacLi);

        indivLi = document.createElement('p');
        indivLi.innerText = `Donations From Individuals: $${donation.dollar_individual}`;
        eachDonationDivSenTwo.append(indivLi);

        senatorTwoDiv.append(eachDonationDivSenTwo)
      };
    });

    containerDiv.append(senatorOneDiv);
    containerDiv.append(senatorTwoDiv);
    masterContainer.append(containerDiv);

  })
  .catch(error => console.log(error))
};

function getDonors(){
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
}

function createTable(){
  // donorTableContainer = document.getElementById('donor-table-container');
  // donorTableContainer.style.display = 'block';
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
}

function handleDonorRequest(){
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
      newTotal.innerText = `$${result.dollar_total}`

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
}

let dropButton = document.getElementById('drop-button')
dropButton.addEventListener("click", handleDonorRequest)


