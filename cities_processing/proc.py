import csv 
import numpy as np
import json
from collections import OrderedDict

with open("cities.csv", "r", encoding="ISO-8859-1") as file:
        data_iter = csv.reader(file)
        data = [d for d in data_iter]

data = np.asarray(data)

cities = []
ids = []

for row in data:
    row = "".join(row).split()

    id = row[0]
    country = row[-1]

    # remove unused items
    row.pop(0)
    row.pop(-1)
    row.pop(-1)
    row.pop(-1)


    city = " ".join(row)

    # some city names are empty so clean those out
    if city == "": continue

    # add country code
    city += ", " + country

    cities.append(city)
    ids.append(id)


cities, ids = zip(*sorted(zip(cities, ids))) 

output = []
for i in range(len(cities)):
    output.append((cities[i], ids[i]))

output = OrderedDict(output)

with open("cities.json", "w") as f:
    json.dump(output, f)


