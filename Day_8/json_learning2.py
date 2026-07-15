import json

# with open ("user.json") as f:
#     data = json.load(f)
#     print(data)

# print(data["name"])

test_dict = {"name":"Yawsh","id":10}

with open("user.json", "w") as f:
    json.dump(test_dict, f, indent= 2)