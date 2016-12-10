console.log("script.js is linked");

let heatMapped = [1, 2, 3, 4];
heatMapped.className = 'heatMapped';
console.log('heatMapped array contains ', heatMapped);

let width = 960;
let height = 500;
let centered;

let projection = d3.geo.albersUsa()
    .scale(1070)
    .translate([width / 2, height / 2]);

let path = d3.geo.path()
    .projection(projection);

let svg = d3.select("body").append("svg")
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
    console.log(data)
    // vanilla JS DOM manipulation to create the modal that will display the data
    containerDiv = document.createElement('div');
    containerDiv.className = "containerDiv";
    containerDiv.innerHTML = "";

    // grabs the first senators name (the data is returned ordered by senator)
    senatorOneName = data[1].name;
    senatorOneTitle = document.createElement('h4');
    senatorOneTitle.innerText = `Senator: ${senatorOneName}`;

    // grabs the senators name
    senatorTwoName = data[data.length - 1].name;
    senatorTwoTitle = document.createElement('h4');
    senatorTwoTitle.innerText = `Senator: ${senatorTwoName}`;

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
        organizationLi.innerText = `Donor: ${donation.org_name}`;
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
        organizationLi.innerText = `Donor: ${donation.org_name}`;
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
    document.body.append(containerDiv);

  })
  .catch(error => console.log(error))
}

var donors = [
  '1-800 Contacts',
  '21st Century Fox',
  'AFLAC Inc',
  'AKT Development',
  'AT&T Inc',
  'Abc Supply',
  'Acadian Companies',
  'Adams & Reese',
  'AegisPAC',
  'Aetna Inc',
  'Affiliated Managers Group',
  'Air Products & Chemicals Inc',
  'Airbus Group',
  'Akerman LLP',
  'Akin, Gump et al',
  'Alaska Air Group',
  'Alexander & Baldwin',
  'Alkermes plc',
  'Alliance Resource Partners',
  'Alliant Techsystems',
  'Aloha Partners',
  'Alpha Natural Resources',
  'Alphabet Inc',
  'Alston & Bird',
  'Alston, Hunt et al',
  'Altria Group',
  'Amazon.com',
  'American Airlines Group',
  'American Chemistry Council',
  'American Crystal Sugar',
  'American Electric Power',
  'American Lighting Assn',
  'American Mid-Sized Banks',
  'American Nurses Assn',
  'American Postal Workers Union',
  'American Trucking Assns',
  'Amgen Inc',
  'Amway/Alticor Inc',
  'Anadarko Petroleum',
  'Apollo Global Management',
  'Apple Inc',
  'Arizona Diamondbacks/Datatel Inc',
  'Arizona Tile',
  'Ashland Inc',
  'AstraZeneca PLC',
  'Avalon Advisors',
  'Avera Health Systems',
  'B&G Food Enterprises',
  'BAE Systems',
  'BB&T Corp',
  'BGR Group',
  'BNP Paribas',
  'BP',
  'Bain Capital',
  'Baker Botts LLP',
  'Baker, Donelson et al',
  'Bank of America',
  'Bank of New York Mellon',
  'Barnes & Thornburg',
  'Beef Products Inc',
  'Belfer Management',
  'Berkshire Hathaway',
  'Bernstein Shur',
  'Biloxi Freezing & Processing',
  'Blackrock Inc',
  'Blackstone Group',
  'Blessey Marine Service',
  'Blue Cross/Blue Shield',
  'Boeing Co',
  'Boich Companies',
  'Boies, Schiller & Flexner',
  'Boston University',
  'Bowdoin College',
  'Boyd Gaming',
  'Bradley, Arant et al',
  'Brady Industries',
  'Braman Motorcars',
  'Brown & Brown Insurance',
  'Brown Rudnick LLP',
  'Brown-Forman Corp',
  'Brownstein, Hyatt et al',
  'Bryan Cave LLP',
  'Buchanan, Ingersoll & Rooney',
  'Burns & McDonnell',
  'CEMEX SA de CV',
  'CHARMER SUNBELT GROUP',
  'CSX Corp',
  'Cablevision Systems',
  'Caesars Entertainment',
  'Cajun Industries',
  'Calfee, Halter & Griswold',
  'Calpine Corp',
  'Campbell Soup',
  'Cancer Treatment Centers of America',
  'Capital Group',
  'Capital One Financial',
  'Carnival Corp',
  'Carpenters & Joiners Union',
  'Case Western Reserve University',
  'Celanese Corp',
  'Centene Corp',
  'Cerberus Capital Management',
  'Charah Inc',
  'Charter Communications',
  'Chemorse Ltd',
  'Cheniere Energy',
  'Chesapeake Energy',
  'Chevron Corp',
  'Ciciora Custom Homes',
  'Cisco Systems',
  'Citadel LLC',
  'Citigroup Inc',
  'Citizens for Prosperity in America Today',
  'Cleveland Clinic',
  'Club for Growth',
  'Coca-Cola Co',
  'Cohen Group',
  'Cole, Schotz et al',
  'Comcast Corp',
  'Commonwealth of Massachusetts',
  'Communications Workers of America',
  'Community Health Systems',
  'ConocoPhillips',
  'Cooney & Conway',
  'Corning Inc',
  'Council for a Livable World',
  'Council of Insurance Agents & Brokers',
  'Covington & Burling',
  'Cox Enterprises',
  'Crawford Group',
  'Credit Union National Assn',
  'Cronin, Fried et al',
  'D&J Construction',
  'DANPAC',
  'DCI Group',
  'DISH Network',
  'DLA Piper',
  'DTE Energy',
  'DaVita HealthCare Partners',
  'Dade Medical College',
  'Date Mining Services',
  'Davis, Polk & Wardwell',
  'Deloitte LLP',
  'Delta Air Lines',
  'Democracy Engine',
  'Denali Leadership PAC',
  'Dentons',
  'Devon Energy',
  'Discover Financial Services',
  'Dominion Resources',
  'Dorsey & Whitney',
  'Dow Chemical',
  'Drummond Co',
  'DuPont Co',
  'Duke Energy',
  'Dupont Co',
  'EMILY\'s List',
  'Early, Lucarelli et al',
  'Edens & Avant',
  'Edison Chouest Offshore',
  'Edison International',
  'Edwards Wildman Palmer',
  'Eisai Co Ltd',
  'Eli Lilly & Co',
  'Elliott Management',
  'Emergent BioSolutions',
  'Energy Transfer Equity',
  'Entergy Corp',
  'Ernst & Young',
  'Exelon Corp',
  'Express Scripts',
  'Exxon Mobil',
  'FMR Corp',
  'Faegre Baker Daniels',
  'Fanjul Corp',
  'FedEx Corp',
  'Federated Investors Inc',
  'Feminist Majority Foundation',
  'Fiat SpA',
  'Fiduciary Management Inc',
  'FirstEnergy Corp',
  'Foley & Lardner',
  'Forest City Enterprises',
  'Free State PAC',
  'Freeport-McMoRan',
  'Fresenius Medical Care',
  'GEO Group',
  'General Atomics',
  'General Dynamics',
  'General Electric',
  'Genworth Financial',
  'Gibbons PC',
  'Gibson, Dunn & Crutcher',
  'Gilead Sciences',
  'Girardi & Keese',
  'Goldberg, Persky & White',
  'Goldman Sachs',
  'Granite Telecommunications',
  'Grant & Eisenhofer',
  'Greater New York Hospital Assn',
  'Greenberg Traurig LLP',
  'Guardian Life Insurance',
  'HJ Kalikow & Co',
  'Harbor Freight Tools',
  'Harris Corp',
  'Harris, Williams & Co',
  'Harrison, White et al',
  'Hartford Financial Services',
  'Harvard University',
  'Hawaiian Electric Industries',
  'Hawkins Construction',
  'HealthSouth Corp',
  'Heartland Values PAC',
  'Hercules Holding',
  'Hess Corp',
  'Highfields Capital Management',
  'Holland & Knight',
  'Home Depot',
  'Honeywell International',
  'Humana Inc',
  'Humanscale Corp',
  'Huntington Ingalls Industries',
  'Hunton & Williams',
  'Husch Blackwell LLP',
  'Hy-Vee Inc',
  'ICE Group',
  'Idacorp Inc',
  'Impact',
  'Indiana University',
  'Intel Corp',
  'Intellectual Ventures LLC',
  'International Assn of Fire Fighters',
  'International Paper',
  'Intl Alliance Theatrical Stage Employees',
  'JPMorgan Chase & Co',
  'JStreetPAC',
  'Jackson Hole Mountain Resort',
  'Jackson Kelly Pllc',
  'Jay Cashman Inc',
  'Jenner & Block',
  'Jennmar Corp',
  'Johns Hopkins University',
  'Jones Day',
  'Jones Financial Companies',
  'Jones Walker LLP',
  'Jpmorgan Chase & Co',
  'K&L Gates',
  'KKR & Co',
  'KPMG LLP',
  'Kiewit Corp',
  'Kindred Healthcare',
  'King & Spalding',
  'Kingston Technology',
  'Kirkham Motorsports',
  'Kirkland & Ellis',
  'Kleinberg, Kaplan et al',
  'Knight Transportation',
  'Kobayashi Group',
  'Kobayashi, Sugita & Goda',
  'Koch Industries',
  'Koskoff, Koskoff & Bieder',
  'Krieg Devault Llp',
  'L&F Distributors',
  'Land O\'Lakes',
  'Land Title Guarantee Co',
  'Langlas & Assoc',
  'Las Vegas Sands',
  'Latham & Watkins',
  'Law Offices of Peter G Angelos',
  'Lawrence & Schiller',
  'Lazard Ltd',
  'League of Conservation Voters',
  'Leon Medical Centers',
  'Liberty Mutual',
  'Lions Gate Entertainment',
  'Live Oak Bank',
  'Lockheed Martin',
  'Lockridge Grindal Nauen PLLP',
  'Lowenstein Sandler LLP',
  'MCNA Dental Plans',
  'MGM Resorts International',
  'MacAndrews & Forbes',
  'Madison Dearborn Partners',
  'Making Business Excel PAC',
  'Mantech International',
  'Marathon Petroleum',
  'Marriott International',
  'Marshfield Clinic',
  'Marvin Windows',
  'Mason Capital Management',
  'Massachusetts General Hospital',
  'Massachusetts Institute of Technology',
  'Massachusetts Mutual Life Insurance',
  'Mathena Inc',
  'Maynard, Cooper & Gale',
  'Mbi Energy Services',
  'McGuireWoods LLP',
  'McKee Foods',
  'McKinsey & Co',
  'McWane Inc',
  'Medco Health Solutions',
  'Medtronic Inc',
  'Mepco LLC',
  'Metlife Inc',
  'Mewbourne Oil Co',
  'Micron Technology',
  'Microsoft Corp',
  'Miller & Martin',
  'Milliken & Co',
  'Mintz, Levin et al',
  'Mmr Constructors',
  'Mockler Beverage',
  'Monsanto Co',
  'Morgan & Morgan',
  'Morgan Lewis LLP',
  'Morgan Stanley',
  'Morris, Nichols et al',
  'Motley Rice LLC',
  'Moveon.org',
  'Murray Energy',
  'Mutual of Omaha',
  'Mylan Inc',
  'NV Energy',
  'National Amusements Inc',
  'National Assn of Broadcasters',
  'National Assn of Insurance & Financial Advisors',
  'National League of Postmasters',
  'National Nurses United',
  'National Stone, Sand & Gravel Assn',
  'Navatek Ltd',
  'Navistar International',
  'Nelson, Mullins et al',
  'New Balance Athletic Shoe',
  'New Breed Inc',
  'New Breed Logistics',
  'New York Life Insurance',
  'NextEra Energy',
  'Nike Inc',
  'Noble Energy',
  'NorPAC',
  'Norfolk Southern',
  'Northrop Grumman',
  'Northwestern Mutual',
  'Novogradac & Co',
  'Nucor Corp',
  'O\'Melveny & Myers',
  'OC Tanner Co',
  'OGE Energy',
  'Oaktree Capital Management',
  'Oberlin College',
  'Ocean Champions',
  'Ohio State University',
  'Oracle Corp',
  'Oregon Health & Science University',
  'Oshkosh Corp',
  'PG&E Corp',
  'PNC Financial Services',
  'PNM Resources',
  'PPL Corp',
  'Pachulski, Stang et al',
  'Parker Towing',
  'Paul, Weiss et al',
  'Peabody Energy',
  'Peace Action',
  'Pershing Square Capital Management',
  'Pfizer Inc',
  'Pierce Atwood LLP',
  'Pilot Corp',
  'Pinnacle Bancorp',
  'Pinnacle West Capital',
  'Pioneer Natural Resources',
  'Planned Parenthood',
  'Poet LLC',
  'Polsinelli PC',
  'Pop Fishing & Marine',
  'Potlatch Corp',
  'Powell Construction',
  'Power Financial Corp',
  'Power, Rogers & Smith',
  'PricewaterhouseCoopers',
  'Primerica Inc',
  'Procter & Gamble',
  'Prudential Financial',
  'Pvs Chemicals',
  'RDL Inc',
  'RE Janes Gravel Co',
  'RM Towill Corp',
  'RPM International',
  'Raytheon Co',
  'Reclaim America PAC',
  'Reed Smith LLP',
  'Regions Financial',
  'Renaissance Technologies',
  'Reynolds American',
  'Richie\'s Specialty Pharmacy',
  'Robbins, Geller et al',
  'Robins, Kaplan et al',
  'Rock Creek Group',
  'Rock Holdings',
  'Ropes & Gray',
  'Rothman Institute',
  'Salt River Project',
  'Saltchuk Resources',
  'Sanderson Farms',
  'Sanford Health',
  'Scana Corp',
  'Seacoast Commerce Bank',
  'Select Medical Holdings',
  'Sempra Energy',
  'Senate Conservatives Fund',
  'Service Employees International Union',
  'Shaheen & Gordon',
  'Shipman & Goodwin',
  'Sierra Nevada Corp',
  'Signature Bank',
  'Simmons Law Firm',
  'Sinclair Broadcast Group',
  'Sinclair Companies',
  'Skadden, Arps et al',
  'Smith\'s Inc',
  'Southeastern Minerals',
  'Southern Co',
  'Squire Patton Boggs',
  'State Farm Insurance',
  'State of Illinois',
  'Station Casinos',
  'Stephens Group',
  'Stevens & Lee',
  'Stoel, Rives et al',
  'Sullivan & Cromwell',
  'Susan B Anthony List',
  'Susman Godfrey Llp',
  'Synovus Financial Corp',
  'TAMKO Building Products',
  'Target Corp',
  'Technology Crossover Ventures',
  'Telapex Inc',
  'TeleCommunication Systems Inc',
  'Tenaska Energy',
  'Tenax Aerospace',
  'The Villages',
  'Thornton Law Firm',
  'Tiber Creek Group',
  'Time Warner',
  'Timken Co',
  'Toys R Us',
  'Travelers Companies',
  'Trinity Industries',
  'Tyson Foods',
  'UNITE HERE',
  'UPMC Health System',
  'US Bancorp',
  'US Senate',
  'US Steel',
  'USAA',
  'Ultimate Fighting Championship',
  'Union Pacific Corp',
  'United Parcel Service',
  'United Technologies',
  'UnitedHealth Group',
  'Unitedhealth Group',
  'University Of Virginia',
  'University of California',
  'University of Colorado',
  'University of Hawaii',
  'University of Michigan',
  'University of Minnesota',
  'University of Missouri',
  'University of New Mexico',
  'University of Notre Dame',
  'University of Washington',
  'University of Wisconsin',
  'Unum Group',
  'Valero Energy',
  'Van Scoyoc Assoc',
  'Vectren Corp',
  'Venable LLP',
  'Verizon Communications',
  'Visa Inc',
  'Voices for Progress',
  'Votesane PAC',
  'WPP Group',
  'Wachtell, Lipton et al',
  'Wal-Mart Stores',
  'Walt Disney Co',
  'Washington University In St Louis',
  'Watco Companies',
  'Weitz & Luxenberg',
  'Wells Fargo',
  'Welsh, Carson et al',
  'Werner Enterprises',
  'Westport Properties',
  'Wexford Capital',
  'WilmerHale Llp',
  'Wilmerhale Llp',
  'Winchester Carlisle Comp',
  'Woodforest Financial Group',
  'Woodward Inc',
  'Wynn Resorts',
  'Xcel Energy',
  'Yale University',
  'Yellowstone Bank',
  'Young, Conaway et al',
  'Zillow Inc'
]

let select = document.getElementById('donor-dropdown');

for(let i = 0; i < donors.length; i++) {
    let option = document.createElement('option');
    option.innerHTML = donors[i];
    option.value = donors[i];
    select.appendChild(option);
}

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
}

function handleDonorRequest(){
  let drop = document.getElementById('donor-dropdown');
  let dropValue = drop.options[drop.selectedIndex].value
  fetch(`/db/donors/byDonor/${dropValue}`)
  .then((r) => r.json())
  .then((data) => {
    console.log(data)
    heatMapped = [];
    donorTable = document.getElementById('donor-table');

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
      newSen = document.createElement('TD');
      newSen.innerText = `${result.name}`
      newRow.append(newSen)

      newState = document.createElement('TD');
      newState.innerText = `${result.state}`
      newRow.append(newState);

      newTotal = document.createElement('TD');
      newTotal.innerText = `${result.dollar_total}`
      newRow.append(newTotal);

      donorTable.append(newRow);

      let heatMapItem = result.geojson_id
      heatMapped.push(heatMapItem)
    })
      console.log("heatMapped array is now ", heatMapped);
  })
  .catch(error => console.log(error));
}

let dropButton = document.getElementById('drop-button')
dropButton.addEventListener("click", handleDonorRequest)


