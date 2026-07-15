import json 
data = {"name":"yash deep kunwar","age":22,"city":"Kathmandu"}

json_example = json.dumps(data , indent= 2)

print(json_example)
print(type(json_example))

json_string = '{"name": "yash deep kunwar", "age": 22, "is student": true }'
back = json.loads(json_string)
print(back)
