
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

// ===== WEIGHTS INTERFACE ======

// crime slider
var crime = document.getElementById('crime');
var crimeVal = document.getElementById('crimeVal');

crimeVal.innerHTML = crime.value;

crime.oninput = function() {
  crimeVal.innerHTML = this.value;
}

// price slider
var price = document.getElementById('price');
var priceVal = document.getElementById('priceVal');

priceVal.innerHTML = price.value;

price.oninput = function() {
  priceVal.innerHTML = this.value;
}

// population density slider
var popDensity = document.getElementById('popDensity');
var popVal = document.getElementById('popVal');

popVal.innerHTML = popDensity.value;

popDensity.oninput = function() {
  popVal.innerHTML = this.value;
}

//attractions slider
var attractions = document.getElementById('attractions');
var attractionsVal = document.getElementById('attractionsVal');

attractionsVal.innerHTML = attractions.value;

attractions.oninput = function() {
  attractionsVal.innerHTML = this.value;
}

//schools slider
var schools = document.getElementById('schools');
var schoolsVal = document.getElementById('schoolsVal');

schoolsVal.innerHTML = schools.value;

schools.oninput = function() {
  schoolsVal.innerHTML = this.value;
}

//postSec slider
var postSec = document.getElementById('postSec');
var postSecVal = document.getElementById('postSecVal');

postSecVal.innerHTML = postSec.value;

postSec.oninput = function() {
  postSecVal.innerHTML = this.value;
}

//healthService slider
var healthService = document.getElementById('healthService');
var healthVal = document.getElementById('healthVal');

healthVal.innerHTML = healthService.value;

healthService.oninput = function() {
  healthVal.innerHTML = this.value;
}

//religiousInsti slider
var religiousInsti = document.getElementById('religiousInsti');
var religiousVal = document.getElementById('religiousVal');

religiousVal.innerHTML = religiousInsti.value;

religiousInsti.oninput = function() {
  religiousVal.innerHTML = this.value;
}

//subway slider
var subway = document.getElementById('subway');
var subwaysVal = document.getElementById('subwayVal');

subwayVal.innerHTML = subway.value;

subway.oninput = function() {
  subwayVal.innerHTML = this.value;
}


// ===== MAP ======

//add legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 50, 60, 70, 80, 90],
    labels = [];

  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? ' &ndash; ' + ((grades[i + 1]) -1) + '<br>' : '+');
  }
  
  return div;
};


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
	addLagend.addBaseLayer(newL, userWeights["newSubmit"]);
}

 
function getColor(d) {
  // assign colours based on values
  // less than or equal to 69 = 69% suitability
  // more than 90 = 90+% suitability
  return d < 50 ? '#FFFFFF' :
    d >= 50 && d < 60 ? '#e8e4db' :
    d >= 60 && d < 70 ? '#d9c7b1' :
    d >= 70 && d < 80 ? '#85837a' :
    d >= 80 && d < 90 ? '#6e917a' :
                        '#196633';
}

function mapStyle(feature) {

  // set map style
  return {
    fillColor: getColor(feature.properties.FinalRecla),
    weight: 2,
    opacity: 1,
    color: '#adadad',
    fillOpacity: 0.4
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
      color: '#adadad'
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
      labels: ["Assult","Auto Theft","Break & Entry","Robbery","Homicide","Shootings"],
      datasets: [{
          label: 'Crime Data',
          data: crimeData,
          borderWidth: 1,
          hoverOffset: 5,
          backgroundColor:['#c5bb9a', '#b1a88a', '#9d957b', '#89826b', '#76705c', '#625d4d'],
          borderColor: '#ffffff'
        }]
  },
  options:{
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        padding: {
          top: 0,
          bottom: 0
        }   
      },
      title: {
        display: true,
        text: 'Rates of Crime',
        align: 'start',
        padding: {
          top: 0,
          bottom: 0
        }
      }
    }      
  }
});

// Age Charts
ageStats = document.getElementById('ageStats').getContext('2d'); 

ageChart = new Chart(ageStats, {
  type: 'doughnut',
  data: {
      labels: ["0-14 years",
                "15-24 years",
                "25-54 years",
                "55-64 years",
                "65+ years"],
      datasets: [
        {
          label: 'Age Data',
          data: ageData,
          borderWidth: 1,
          hoverOffset: 5,
          backgroundColor:['#c19c43', '#c7aa65', '#dbbea0', '#d2a06f', '#ccc079'],
          borderColor: '#ffffff'
        }] 
  },
  options:{
    responsive: true,
    plugins: {
      legend: {
          display: true,
          position: 'right',
          padding: {
            top: 0,
            bottom: 0
          }   
      },
      title: {
        display: true,
        text: 'Age Composition',
        align: 'start',
        padding: {
          top: 0,
          bottom: 0
        }
      }
    }      
  }
});

// Race Charts
raceStats = document.getElementById('raceStats').getContext('2d'); 

raceChart = new Chart(raceStats, {
  type: 'doughnut',
  data: {
      labels: ["Aboriginal",
                "North American",
                "European",
                "Central & South American",
                "African","Asian","Oceania"],
      datasets: [
        {
          label: 'Ethnic Origins',
          data: raceData,
          borderWidth: 1,
          hoverOffset: 5,
          backgroundColor:['#9eb89b', '#b7cca9', '#d4e1ca', '#d1dbb7', '#c6d2a5', '#c9d8c8', '#95A48A'],
          borderColor: '#ffffff'
        }]
  },
  options:{
    responsive: true,
    plugins: {
      legend: {
          display: true,
          position: 'right',
          padding: {
            top: 0,
            bottom: 0
          } 
      },
      title: {
        display: true,
        text: 'Ethnic Origin Composition',
        align: 'start',
        padding: {
          top: 0,
          bottom: 0
        }
      }
    }      
  }
});


}
