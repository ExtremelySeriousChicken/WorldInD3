
window.onload = function(){
    d3.csv("data/gdp_overtime.csv", processData);
}

/*
* Requires : The data of the country and the years
* Modifies : The html
* Effects  : THis function will produce a 
*/
function printData(data, countryArray){
 //now we want to split the table into groups of 25 countries  
    //add the header
    var table = document.getElementById("countryTable");
    var head  = document.createElement('thead');
    var th    = document.createElement('th');
    th.appendChild(document.createTextNode("Year"));
    head.appendChild(th);
     for(var i = 0; i < countryArray.length; i++){
         var th    = document.createElement('th');
         th.appendChild(document.createTextNode(countryArray[i]));
         head.appendChild(th);
     }
     table.appendChild(head);
    
    //now insert the data
    data.forEach(function(value, id){
        var tr = document.createElement("tr");
        console.log(value);
        var td = document.createElement("td");
        td.appendChild(document.createTextNode(value['year']));
        tr.appendChild(td);

        for(var i = 0; i < countryArray.length; i++){
            var td = document.createElement("td");
            td.appendChild(document.createTextNode(value[countryArray[i]]));
            tr.appendChild(td);
        }
        
        table.appendChild(tr);
    })
    
}
/*
* Requires : the input
* Effects  : If the input is not a float, return false, else return true
*/
function isValid(input){
    var returnThis = (isNaN(input)) ?  false :  true;
    return returnThis;
}
/*
* Requires : The input of the upperbound. 
* Effects  : This function will check if the input is legitimate. If it is not, 
*            then alert the users that they have invalid input. If it is valid,
*            then we will change the graph depending on the data
*/
function upperBoundClick(){
    var input = document.getElementById("upperBoundInput").value;

    if(isValid(input)){
        yScale = d3.scale.linear().domain([0,input]).range([480,0]);
        // xScale = d3.scale.linear().domain([1960,2014]).range([0,980]);

        //now the axes
        yAxis = d3.svg
                  .axis()
                  .scale(yScale)
                  .orient("right")
                  .ticks(20)
                  .tickSize(1480)
                  .tickSubdivide(true);

        xAxis = d3.svg
                  .axis()
                  .scale(xScale)
                  .orient("bottom")
                  .tickSize(480)
                  .ticks(5);

        //now draw the axes
        d3.select("svg").select("#gdpTimeyAxisG").call(yAxis);
        d3.select("svg").select("#gdpTimexAxisG").call(xAxis);


        d3.select("svg").selectAll("path").remove();

        //now declare the fill scale
        drawGraph(viewedData, xScale, yScale);
    }else{
        alert("invalid input! please insert real numbers ONLY");
    }
}
/*
* Requires : The starting and then end of the year
* Modifies : -
* Effects  : 
*/
function createYears(start,end){
	var newYear = []
    for(var i = start; i <= end; i++){
		newYear.push(i)
	}

	return newYear;
    //try
}

/*
* Requires : The data and the years array
* Modifies : the data
* Effects  : This function will take in the data and the years and convert the data 
*            in the years to float. Then returned the modified data. This data will 
*            also convert the data to in millions of dollar
*/
function modifyData(data,years){
    //now go through each of the data and converthe "" to 0
	for(var i = 0; i < data.length; i++){
        for(var j = 0; j < years.length; j++){
        	if(data[i][years[j]] == ""){
        		data[i][years[j]] = 0.00;
        	}else{
        		data[i][years[j]] = parseFloat(data[i][years[j]]) / 1000000000;
                data[i][years[j]] = data[i][years[j]].toFixed(2);
        	}
        	
        }
        data[i]['Indicator Name'] = "GDP(current US$ Billions)";
    }

	return data;
}

/*
 * Requires : the modified data
* Modifies : -
* Effects  : This function will conver the data from sorted per counries
*            to sorted per year
*/
function viewableData(data, years){
	var newArray = [];
    for(var i = 0; i < years.length; i++){
            	var newYear = {year : years[i]};

    	for(var j = 0; j < data.length; j++){
    		newYear[data[j]["Country Name"]] = data[j][newYear.year];
    	}

    	newArray.push(newYear);
    }

    return newArray;
}

/*
* Requires : The data. The format of the data is described below
* Modifies : The 
* Effects  : 
*/
function drawGraph(viewedData,xScale, yScale){
    fillScale = d3.scale.linear().domain([1,20]).range(["white","darkgreen"]);

    var n = 0;

    for(country in viewedData[0]){
        if(country != 'year'){
            countryArea = d3.svg
                            .area()
                            .x(function(d){
                                return xScale(d.year)
                            })
                            .y(function(d){
                                return yScale(stack(d,country));
                            })
                            .y0(function(d){

                                return yScale(stack(d,country) -  d[country]);
                            }).interpolate("basis");


            d3.select("svg")
              .append("path")
              .attr("id", country + "area")
              .attr("class","countryData")
              .attr("d", countryArea(viewedData))
              .attr("fill", fillScale(n))
              .attr("stroke", "green")
              .attr("stroke-width", 1)
              .style("opacity", .5);

            n++;
      }
    }
}

/*
* 
*/
function getCountryNames(data){
    var array = [];
    for(var i = 0; i < data.length; i++){
        array.push(data[i]["Country Name"]);
    }

    return array;
}
/*
* Requires : the data from the file
* Mofidies : the page
* Effects  : This function is called when the page is first loaded.
*/
function processData(data){

    var years = createYears(1960,2014);

    data = modifyData(data,years);

    var newArray = [];

    //now get the data only for the first 20 country
    for(var i = 40; i < 60; i++){
        newArray.push(data[i]);
    }

    

    data = newArray;

    var countryArray = getCountryNames(data);

    viewedData = viewableData(data,years);

    printData(viewedData, countryArray);

    //declaring the scale
    yScale = d3.scale.linear().domain([0,60000]).range([480,0]);
    xScale = d3.scale.linear().domain([1960,2014]).range([0,1480]);

    //now the axes
    yAxis = d3.svg
              .axis()
              .scale(yScale)
              .orient("right")
              .ticks(20)
        	  .tickSize(1500)
              .tickSubdivide(true);

    xAxis = d3.svg
              .axis()
              .scale(xScale)
              .orient("bottom")
              .tickSize(480)
              .ticks(5);

    2//now draw the axes
    d3.select("svg").append("g").attr("id","gdpTimeyAxisG").call(yAxis);
    d3.select("svg").append("g").attr("id","gdpTimexAxisG").call(xAxis);

    //now declare the fill scale
    drawGraph(viewedData, xScale, yScale);
    
}

function stack(incomingData, incomingAttribute) {
    var newHeight = 0;
      for (x in incomingData) {
        if (x != "year") {
          newHeight += parseInt(incomingData[x]);
          if (x == incomingAttribute) {
            break;
          }
        }
      }
    return newHeight;
}