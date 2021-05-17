
// ===== NAVBAR ======

function openTab(evt, section) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the link that opened the tab
  document.getElementById(section).style.display = "block";
  evt.currentTarget.className += " active";
}

// ===== MAP ======

function getWeights(){
  
  // get the values user inputted weights and store it as a dict 
  var OGuserWeights = {
    newSubmit:document.getElementById("newSubmit").value, 
    crime:document.getElementById("crime").value, 
    price:document.getElementById("price").value,
    popDensity:document.getElementById("popDensity").value,
    attractions:document.getElementById("attractions").value,
    schools:document.getElementById("schools").value,
    postSec:document.getElementById("postSec").value,
    healthService:document.getElementById("healthService").value,
    religiousInsti:document.getElementById("religiousInsti").value,
    subway:document.getElementById("subway").value
  };

  var maxWeights = weightsMax(OGuserWeights);
  
  // declare global variable userWeights
  userWeights = {
    newSubmit:OGuserWeights["newSubmit"],
    crime: parseFloat(OGuserWeights["crime"]/maxWeights).toFixed(2),
    price: parseFloat(OGuserWeights["price"]/maxWeights).toFixed(2),
    popDensity: parseFloat(OGuserWeights["popDensity"]/maxWeights).toFixed(2),
    attractions: parseFloat(OGuserWeights["attractions"]/maxWeights).toFixed(2),
    schools: parseFloat(OGuserWeights["schools"]/maxWeights).toFixed(2),
    postSec: parseFloat(OGuserWeights["postSec"]/maxWeights).toFixed(2),
    healthService: parseFloat(OGuserWeights["healthService"]/maxWeights).toFixed(2),
    religiousInsti: parseFloat(OGuserWeights["religiousInsti"]/maxWeights).toFixed(2),
    subway: parseFloat(OGuserWeights["subway"]/maxWeights).toFixed(2),
  };

  // call fieldCalculator and addNewLayer
  fieldCalculator();
  addNewLayer();
}

function weightsMax(OGuserWeights){
  // calculate the sum of user inputted values on the sliders
  var sum = 0;

  for (var factor in OGuserWeights){
    if(factor != "newSubmit"){
      sum += parseInt(OGuserWeights[factor]);
    }
  }
  return sum;
}



function fieldCalculator(){
  // calculate the maximum value possible for the final reclass
	var totalMaxValue = (10*userWeights["crime"]) + (10*userWeights["price"]) + 
                      (5*userWeights["popDensity"]) + (5*userWeights["attractions"]) + 
                      (5*userWeights["schools"]) + (5*userWeights["postSec"]) +
                      (5*userWeights["healthService"]) + (5*userWeights["religiousInsti"]) +
                      (5*userWeights["subway"])
                        
  // update the value of each neighbourhood in the FinalRecla col of tableData
  // with the corrosponding reclass value * weight given by the user
	for (var i = 0; i < tableData.features.length; i++) {
		tableData.features[i].properties.FinalRecla = ((
    (tableData.features[i].properties.reCrime * userWeights["crime"]) +
		(tableData.features[i].properties.rePrice * userWeights["price"]) +
		(tableData.features[i].properties.reDensity * userWeights["popDensity"]) +
    (tableData.features[i].properties.reAttract * userWeights["attractions"]) +
    (tableData.features[i].properties.reSchool * userWeights["schools"]) +
    (tableData.features[i].properties.rePostS * userWeights["postSec"]) +
    (tableData.features[i].properties.reHealthS * userWeights["healthService"]) +
    (tableData.features[i].properties.reWorship * userWeights["religiousInsti"]) +
    (tableData.features[i].properties.reSub * userWeights["subway"])
    ) / totalMaxValue) * 100
  };
}		

	
function addNewLayer(){
	// creates a new map layer and set its style/functions
	var newL = L.geoJson(tableData, {
							style: mapStyle,
							onEachFeature: onEachFeature});
	
	// add new layer to submittedLayers
	addLadgend.addBaseLayer(newL, userWeights["newSubmit"]);
}

 
function getColor(d) {
  // assign colours based on values
  // less than 50 = 50% suitability
  // more than 90 = 90+% suitability
  return d <= 50 ? '#ffffff' :
         d > 50 && d <= 60 ? '#ff0000' :
         d > 60 && d <= 70 ? '#ff4000' :
         d > 70 && d <= 80 ? '#ff8000' :
         d > 80 && d <= 90 ? '#ffbf00' :
                     '#ffff00';
}

function mapStyle(feature) {

  // set map style
  return {
    fillColor: getColor(feature.properties.FinalRecla),
    weight: 2,
    opacity: 1,
    color: '#adadad',
    fillOpacity: 0.3
  };
}


// ===== EVENT LISTENERS  ======
              
function highlightFeature(e) {
  
  var layer = e.target;

  // add hover effect when mouse is over a neighbourhood
  layer.setStyle({
      weight: 5,
      color: '#333333'
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  }

  info.update(e.target.feature.properties);
}

function resetHighlight(e) {
  // remove hover effect when mouse is off a neighbourhood
  var layer = e.target;

  layer.setStyle({
      weight: 2,
      opacity: 1,
      color: '#adadad',
      fillOpacity: 0.1
  });
  
  info.update();
}

function zoomToFeature(e) {
  // zoom to neighbourhood when clicked
  mymap.fitBounds(e.target.getBounds());

  // update crimeData, raceData, ageData
  hood = e.target.feature.properties;

  crimeData = [hood.assaultR, 
              hood.autoTheftR,
              hood.BnER,
              hood.robberyR,
              hood.homicideR,
              hood.shootingsR];

  raceData = [hood.aborilPer, 
              hood.nAmerPer,
              hood.euroPer,
              hood.sAmerPer,
              hood.africaPer,
              hood.asiaPer,
              hood.oceaniaPer];

  ageData = [hood.childrenP, 
            hood.youthPr,
            hood.workingP,
            hood.preRetireP,
            hood.seniorP];


  if (crimeChart) {
    crimeChart.destroy();
    raceChart.destroy();
    ageChart.destroy();
  }

  //show neighbourhood stats
  makecharts();
  
}


function onEachFeature(feature, layer) {
  // add the listeners on our neighbourhood layers

  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
}


// ===== CHARTS ======

function makecharts() {

// Crime Charts

crimeStats = document.getElementById('crimeStats').getContext('2d'); 

crimeChart = new Chart(crimeStats, {
      type: 'doughnut',
      data: {
          labels: ["Assult","Auto Theft","Break and Entry","Robbery","Homicide","Shootings"],
          datasets: [
            {
              label: 'Crime Data',
              data: crimeData,
              borderWidth: 1
            }
          ]
      },
  });

// Race Charts
raceStats = document.getElementById('raceStats').getContext('2d'); 

raceChart = new Chart(raceStats, {
      type: 'doughnut',
      data: {
          labels: ["North American Aboriginal",
                    "Other North American",
                    "European ",
                    "Latin; Central and South American",
                    "African","Asian","Oceania"],
          datasets: [
            {
              label: 'Ethnic Origins',
              data: raceData,
              borderWidth: 1
            }
          ]
      },
  });


// Age Charts
ageStats = document.getElementById('ageStats').getContext('2d'); 

ageChart = new Chart(ageStats, {
      type: 'doughnut',
      data: {
          labels: ["Children (0-14 years)",
                    "Youth (15-24 years)",
                    "Working Age (25-54 years)",
                    "Pre-retirement (55-64 years)",
                    "Seniors (65+ years)"],
          datasets: [
            {
              label: 'Age Data',
              data: ageData,
              borderWidth: 1
            }
          ]
      },
  });

}
