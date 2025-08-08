import json

def remove_introduction(data):
    if isinstance(data, dict):
        # If 'introduction' key exists, remove it
        if 'introduction' in data:
            del data['introduction']
        # Recursively call for all values
        for key in data:
            remove_introduction(data[key])
    elif isinstance(data, list):
        # If data is a list, recursively call for each item
        for item in data:
            remove_introduction(item)

# Load the JSON file
with open('book_modifications.json', 'r', encoding='utf-8') as f:
    book_data = json.load(f)

# Remove all 'introduction' keys
remove_introduction(book_data)

# Save the modified JSON back
with open('book_modifications.json', 'w', encoding='utf-8') as f:
    json.dump(book_data, f, indent=4, ensure_ascii=False)

print("All 'introduction' values have been deleted.")
