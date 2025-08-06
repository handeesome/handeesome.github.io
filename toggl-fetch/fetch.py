import requests
import json
import os
from datetime import datetime, timedelta

API_TOKEN = os.environ['TOGGL_API_TOKEN']
JSON_PATH = 'public/toggl-data.json'  # Path relative to the repo root

def fetch_entries(start_date, end_date):
    url = "https://api.track.toggl.com/api/v9/time_entries"
    response = requests.get(
        url,
        params={"start_date": start_date, "end_date": end_date},
        auth=(API_TOKEN, "api_token")
    )
    response.raise_for_status()
    return response.json()

def get_last_date_from_file():
    try:
        with open(JSON_PATH, 'r') as f:
            data = json.load(f)
            timestamps = [entry['start'] for entry in data]
            latest = max(datetime.fromisoformat(ts.replace('Z', '+00:00')) for ts in timestamps)
            return latest
    except Exception:
        return datetime.utcnow() - timedelta(days=7)  # fallback to 1 week ago

def main():
    start = get_last_date_from_file()
    end = datetime.utcnow()
    entries = fetch_entries(start.isoformat(), end.isoformat())

    # Load existing data
    try:
        with open(JSON_PATH, 'r') as f:
            existing = json.load(f)
    except Exception:
        existing = []

    # Merge and deduplicate
    all_entries = {e['id']: e for e in existing + entries}
    with open(JSON_PATH, 'w') as f:
        json.dump(list(all_entries.values()), f, indent=2)

if __name__ == "__main__":
    main()
