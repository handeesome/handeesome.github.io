import csv
import json
from pathlib import Path

# Input and output files
input_csv = Path("../../public/books.csv")
output_json = Path("../../src/data/books/books.json")
modification_file = Path("../../src/data/books/book_modifications.json")  # <- your overrides

# Fields mapping: target_key -> source_header
field_map = {
    "key": "Book Id",
    "title": "Title",
    "author": "Author",
    "num pages": "Number of Pages",
    "avg rating": "Average Rating",
    "shelves": "Bookshelves",
    "date read": "Date Read",
    "date added": "Date Added"
}

books_output = []

# Load modifications (if exists)
modifications = {}
if modification_file.exists():
    with open(modification_file, "r", encoding="utf-8") as modfile:
        modifications = json.load(modfile)

# Read CSV and transform data
with open(input_csv, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    
    for row in reader:
        book = {}
        for key, source_field in field_map.items():
            value = row.get(source_field, "").strip()

            if key == "ISBN":
                isbn13 = value[2:-1]  # Strip leading "="" and trailing quote if present
                book["ISBN"] = isbn13 if isbn13 else None
            elif key == "shelves":
                book["shelves"] = value or "finished"
            else:
                book[key] = value or None

        # Apply modification if exists
        book_key = book.get("key")
        if book_key and book_key in modifications:
            for mod_key, mod_value in modifications[book_key].items():
                book[mod_key] = mod_value

        books_output.append(book)

# Write to JSON
with open(output_json, "w", encoding="utf-8") as jsonfile:
    json.dump(books_output, jsonfile, ensure_ascii=False, indent=2)

print(f"✅ Converted {len(books_output)} books to {output_json}")
