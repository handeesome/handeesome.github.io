import os
import json

# Paths
json_file_path = 'src/data/books/books.json'      # replace with your JSON file path
jpg_folder_path = 'public/covers'        # replace with your folder containing JPGs

# Load JSON data
with open(json_file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Assuming JSON contains a list of objects, and each object has a 'key' or 'filename' field
# Adjust 'key' to the actual field name in your JSON
json_ids = set(obj['id'] for obj in data)

# List all JPG files in the folder
jpg_files = [f for f in os.listdir(jpg_folder_path) if f.lower().endswith('.jpg')]

# Find JPGs not in JSON
missing_in_json = [f for f in jpg_files if os.path.splitext(f)[0] not in json_ids]

print("JPG files not in JSON:")
for f in missing_in_json:
    print(f)
