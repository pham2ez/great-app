import json

def parseZip(file):
    with open('zipcodes.json') as json_file:
        data = json.load(json_file)
        zipcodes = data['zipcodes']
        new_data = {'zipcodes': {}}
        for zipcode_dict in zipcodes:
            zipcode = zipcode_dict['zip']
            lat = zipcode_dict['lat']
            longitude = zipcode_dict['long']
            new_data['zipcodes'][zipcode] = (lat, longitude)
    with open('new_zipcodes.json', 'w') as outfile:
        json.dump(new_data, outfile)

parseZip('zipcodes.json')