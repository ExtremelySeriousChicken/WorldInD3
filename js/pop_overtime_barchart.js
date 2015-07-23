var data;
var countryList = [];

window.onload = function(){
	

	var countrySelector = document.getElementById("countryOption");

	

	d3.csv("data/population_trend.csv", function(dataIn){ 
		data = dataIn ;

		countryList = produceCountries(data);

		for(var i = 0; i < countryList.length; i++){
		    var option = document.createElement("option");
		    option.value = countryList[i];
		    option.appendChild(document.createTextNode(countryList[i]));
		    countrySelector.appendChild(option);
	    }    

	    var xScale = d3.scale.linear().domain([1960,2014]).range([0,1480]);
        var yScale = d3.scale.linear().domain([ 10000000, 0]).range([0,480]);

         var yAxis  = d3.svg
                   .axis()
                   .scale(yScale)
                   .orient("right")
                   .ticks(20)
                   .tickSize(1480)
                   .tickSubdivide(true);

          var xAxis  = d3.svg
                   .axis()
                   .scale(xScale)
                   .orient("bottom")
                   .tickSize(480)
                   .ticks(18);

           //now draw the axes
           d3.select("svg").append("g").attr("id","popTimeyAxisG").call(yAxis);
           d3.select("svg").append("g").attr("id","popTimexAxisG").call(xAxis);

           // now add the dummy data
           var dummyData = [];
           var years = [];

           for(var i = 1960; i <= 2014; i++){
            dummyData.push({year: i, population:0});
            years.push(i);
           }

           d3.select("svg")
             .selectAll("rect")
             .data(dummyData)
             .enter()
             .append("rect")
             .attr("x", function(d,i){
                 return i * (1480 / years.length);
             }).attr("y", function(d,i){
                 return yScale(d.population);
             }).attr("height", function(d){
                 return 480 - yScale(d.population);
             }).attr("width", function(d){
                 return 1480 / years.length - 1;
             }).attr("fill", "blue");
	});
}

/*
* Requires : the first and and the end of the year.
* Effects  : This function will determine whether the input is vaid or not. A valid input has:
*            integer input. The start must be more than or equal to the end.
*/
function isValid(start, end){
	if (isNaN(start)) return false;
	if (isNaN(end)) return false;

	if(end < start) return false;

	if(start < 1960) return false;

	if(end > 2014) return false;

	return true;

}
/*
* Requires : the start of the year/
* Modifies : nothing
* Effects  : This function will first check the input by calling isValid. If it is valid, then we
*            will create the array.
*/
function produceYear(start, end){
        var returnThis = [];

        for(var i = start; i <= end; i++){
        	returnThis.push(i);
        }

        return returnThis;
}

/*
*/
function getCountryData(data, country, years){
	var returnThis = [];
	for(var i = 0; i < data.length; i++){
		if(data[i]["Country Name"] == country){
			for(var j = 0; j < years.length; j++){
        returnThis.push({year: years[j], population: data[i][years[j]]})
			}
			break;
		}
	}
	return returnThis;
}

/*
* Effects  : get the maximum number of population
*/
function getMaxPop(data, years){
	var max = 0;

	for(var i = 0; i < years.length; i++){
    if(parseInt(data[i]['population']) > parseInt(max)){
      max = parseInt(data[i]['population']);
    }
	}

	return max;
}

function getMinPop(data, years){
    var min = 0;

    for(var i = 0; i < years.length; i++){
        if(parseInt(data[i]['population']) < parseInt(min)){
            min = parseInt(data[i]['population']);
        }
    }

  return min;
}
/*
* Requires : the country input
* Effects  : Make the bar chart
*/
function processBarChart(){
	var years = produceYear(1960,2014);

	var country = document.getElementById("countryOption").value;
	var selectedCountry = getCountryData(data,country, years);
    var xScale = d3.scale.linear().domain([1960,2014]).range([0,1480]);
    var yScale = d3.scale.linear().domain([0,(getMaxPop(selectedCountry, years) * 1.05)]).range([480,0]);
    var yAxis  = d3.svg
                   .axis()
                   .scale(yScale)
                   .orient("right")
                   .ticks(20)
                   .tickSize(1480)
                   .tickSubdivide(true);

    var xAxis  = d3.svg
                   .axis()
                   .scale(xScale)
                   .orient("bottom")
                   .tickSize(480)
                   .ticks(18);

    //now draw the axes
    d3.select("svg").select("#popTimeyAxisG").transition().call(yAxis);
    d3.select("svg").select("#popTimexAxisG").transition().call(xAxis);

    var colorScale = d3.scale.linear()
                       .domain([getMinPop(selectedCountry,years), getMaxPop(selectedCountry,years)])
                       .range([255,70]);

    //now make th barchart
    d3.select("svg")
      .selectAll("rect")
      .data(selectedCountry)
      .transition()
      .delay(function(d,i){
          return i * 50;
      }).duration(1000)
      .ease("bounce")
      .attr("x", function(d,i){
          return i * (1480 / years.length);
      }).attr("y", function(d,i){
          return yScale(d.population);
      }).attr("height", function(d){
          return 480 - yScale(d.population);
      }).attr("width", function(d){
          return 1480 / years.length - 1;
      }).attr("fill", function(d){
          return 'rgb(0,0,' + colorScale(d.population
            ) + ')';
      });
      
     processTable(country, selectedCountry);
}

/*
*/
function produceCountries(data){
	var countries = [];
	for(var i = 0; i < data.length; i++){
        countries.push(data[i]["Country Name"]);
	}
    
    return countries;
}

function processTable(countryName, selectedCountry){

  var table  = document.getElementById("countryTable");
  var header = document.getElementById("countryName");


  var tableParent = table.parentNode;
  tableParent.removeChild(table);
  var table = document.createElement("table");
  table.id = "countryTable";
  var tableParent = document.getElementById("countryData");
  tableParent.appendChild(table);
  //now add the new data

  header.innerHTML = countryName;

  var tr = document.createElement("tr");
  tr.className = "countryTr";
  var td = document.createElement("td");
  td.appendChild(document.createTextNode("year"));
  tr.appendChild(td);

  for(var i = 0; i < 27; i++){
    var td    = document.createElement("td");
    td.appendChild(document.createTextNode(selectedCountry[i].year));
    tr.appendChild(td);
  }

  table.appendChild(tr);

  //now adding the content
  var tr = document.createElement("tr");
  tr.className = "countryTr";
  var td = document.createElement("td");
  td.appendChild(document.createTextNode("population"));
  tr.appendChild(td);

  for(var i = 0; i < 27; i++){
    var td    = document.createElement("td");
    td.appendChild(document.createTextNode(String(selectedCountry[i].population)));
    tr.appendChild(td);
  }
  table.appendChild(tr);

  var tr = document.createElement("tr");
  tr.className = "countryTr";
  var td = document.createElement("td");
  td.appendChild(document.createTextNode("year"));
  tr.appendChild(td);

  for(var i = 27; i < 55; i++){
    var td    = document.createElement("td");
    td.appendChild(document.createTextNode(selectedCountry[i].year));
    tr.appendChild(td);
  }

  table.appendChild(tr);

  //now adding the content
  var tr = document.createElement("tr");
  tr.className = "countryTr";
  var td = document.createElement("td");
  td.appendChild(document.createTextNode("population"));
  tr.appendChild(td);

  for(var i = 27; i < 55; i++){
    var td    = document.createElement("td");
    td.appendChild(document.createTextNode(String(selectedCountry[i].population)));
    tr.appendChild(td);
  }
  table.appendChild(tr);



}