import requests
import json
import os
from datetime import datetime, timedelta

API_TOKEN = os.environ['TOGGL_API_TOKEN']
WORKSPACE_ID = 20692980
USER_AGENT = "ducenhandee@gmail.com"
JSON_PATH = 'src/data/books/toggl-data.json'  # Path relative to the repo root

def fetch_entries(since_date, until_date):
    url = "https://api.track.toggl.com/reports/api/v2/details"
    params = {
        "workspace_id": WORKSPACE_ID,
        "since": since_date,
        "until": until_date,
        "user_agent": USER_AGENT
    }
    response = requests.get(url, params=params, auth=(API_TOKEN, "api_token"))
    response.raise_for_status()
    return response.json().get("data", [])

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

    since = start.strftime('%Y-%m-%d')
    until = end.strftime('%Y-%m-%d')

    entries = fetch_entries(since, until)

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