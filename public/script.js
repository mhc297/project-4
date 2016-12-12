document.addEventListener("DOMContentLoaded", function(event) {
  console.log("script.js is linked");
  getDonors();
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
let svg = d3.select("#map-container").append("svg")
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
  // groups the feature collections (ie state names) and geographic details to be passed to the path generator
  let topoData = topojson.feature(map, stateDrawData).features;


  svg.append("g")
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

  svg.append("path")
    .datum(topojson.mesh(map, stateDrawData, function(a, b) { return a !== b; }))
    .attr("id", "state-borders")
    .attr("d", path);
});

// this function renders the donor data when a given state is clicked. The states id is passed as the event of the click
function selectState(usState){
  // calls the sql database
  fetch(`/db/donors/${usState.id}`)
  .then((r) => r.json())
  // the response is going to an array of 20 items per state clicked (2 senators * 10 donors)
  .then((data) => {
    console.log("donor data is ", data);
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

    clearButton = document.createElement('button');
    clearButton.className = 'clearMasterButton'
    clearButton.innerText = 'Clear';
    clearButton.addEventListener('click', clearMasterContainer);
    headlineContainer.append(clearButton);

    masterContainer.append(headlineContainer);

    // grabs the first senators name (the data is returned ordered by senator)
    senatorOneName = data[1].name;
    senatorOneParty = data[1].party;
    senatorOneTitle = document.createElement('h5');
    senatorOneTitle.innerText = `${senatorOneName}`;

    if (senatorOneParty == 'Democrat'){
      senatorOneTitle.style.color = '#232066';
    } if (senatorOneParty == 'Republican'){
      senatorOneTitle.style.color = '#E91D0E';
    } if (senatorOneParty == 'Independent') {
      senatorOneTitle.style.color = '#0F7F12';
    }

    // grabs the senators name
    senatorTwoName = data[data.length - 1].name;
    senatorTwoParty = data[data.length - 1].party;
    senatorTwoTitle = document.createElement('h5');
    senatorTwoTitle.innerText = `${senatorTwoName}`;

    if (senatorTwoParty == 'Democrat'){
      senatorTwoTitle.style.color = '#232066';
    } if (senatorTwoParty ==='Republican'){
      senatorTwoTitle.style.color = '#E91D0E';
    } if (senatorTwoParty == 'Independent') {
      senatorTwoTitle.style.color = '#0F7F12';
    }

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
      }
    });

    containerDiv.append(senatorOneDiv);
    containerDiv.append(senatorTwoDiv);
    masterContainer.append(containerDiv);


    function clearMasterContainer(){
      masterContainer.innerText = '';
    }

  })
  .catch(error => console.log(error))
}

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


