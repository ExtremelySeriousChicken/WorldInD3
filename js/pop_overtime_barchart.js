window.onload = function(){
	d3.csv("data/population_trend.csv", startBarChart);
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
* Requires : the input of the start year and the end year
* Modifies : The DOM
* Effects  : This function is called when 
*/
function processBarChart(start,end){
    var years = produceYear(start,end);
}
/*
* Requires : the data and the year range.
* Modifies : the DOM element
* Effects  : This function will take in th data and the year range and then produce the trend barchart graph
*/
function produceBarChart(data, yearsArray){
    
}


/*
* Requires : the data array
* Modifies : -
* Effects  : This function will start the data. This funciton will not start anything since we have
             to wait for user's input
*/
function startBarChart(dataIn){
	var data = dataIn;
	var countryList = produceCountryList
}