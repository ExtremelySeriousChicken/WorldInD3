__author__ = 'seriouschicken'

# This file serve as a data extractor from the gdp_overtime. This file will open the file and scan through the
# Data of countries and their GDP overtime. Then, we will inject these data into the existing geoJSON
# The resulting geoJSON will contains the countries, their geographic data and the GDP data.

# Fortunately, the data that we have contains the GDP over the last 50 years. Unfortunately, extracting all teh
# data and injecting them will result in a huge geoJSON data, which make it difficult to load. Therefore,
# this project aims to be done in multiple steps as follow:

# 1. GDP in geoJSON over five years
# 2. Population trend over five years
# 3. Create a server that makes it easier to extract these data
# 4. Inject the data into a topoJSON to make efforts much faster and easier

import csv, json

#
#
#
def dataExtractor(filename):
    result = []
    with open(filename,'rb') as file:
        gdpReader = csv.reader(file, delimiter=',', quotechar='|')
        print gdpReader
        for row in gdpReader:
            result.append(row)
    return result

#
#
#
def processData(data, rangeback):
    gdp_overtime = [];
    for x in data:
        newCountry = {'country': x[0]}
        newCountry['id'] = x[1] if (len(x) == 59) else x[2];
        gdp_overtime.append(newCountry)
        for year in range(rangeback):
            newCountry[str(2014 - year)] = x[-(year+1)]
    del gdp_overtime[0]

    return gdp_overtime


if __name__ == '__main__':
    print "go!"

    result = dataExtractor('./data/gdp_overtime.csv')

    result = processData(result,5)