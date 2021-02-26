import json
#compact
r = json.dumps([1, 2, 3, {'4': 5, '6': 7}], separators=(',', ':'))
print(r)
#non compact
t = {'8': 5, '6': 7}
test = json.dumps(t, sort_keys=False, indent=0)
print(test)

import json

person_dict = {'name': 'Bob',
'age': 12,
'children': None
}
person_json = json.dumps(person_dict)

# Output: {"name": "Bob", "age": 12, "children": null}
print(person_json)

print(person_dict['age'])