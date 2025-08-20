import requests
import json
import os
from datetime import datetime, timedelta, time
from dateutil import parser

API_TOKEN = os.environ['TOGGL_API_TOKEN']
WORKSPACE_ID = 20692980
USER_AGENT = "ducenhandee@gmail.com"
JSON_PATH = 'src/data/books/toggl-data.json'  # Path relative to the repo root

def split_entry_if_crosses_midnight(entry):
    start_dt = parser.isoparse(entry['start'])
    end_dt = parser.isoparse(entry['end'])

    if start_dt.date() == end_dt.date():
        # No split needed
        return [entry]

    # Calculate midnight (start of next day after start_dt)
    midnight = datetime.combine(start_dt.date() + timedelta(days=1), time.min, tzinfo=start_dt.tzinfo)

    # First part: start -> midnight
    dur1 = int((midnight - start_dt).total_seconds() * 1000)
    part1 = entry.copy()
    part1['start'] = start_dt.isoformat()
    part1['end'] = midnight.isoformat()
    part1['dur'] = dur1

    # Second part: midnight -> end
    dur2 = int((end_dt - midnight).total_seconds() * 1000)
    part2 = entry.copy()
    part2['start'] = midnight.isoformat()
    part2['end'] = end_dt.isoformat()
    part2['dur'] = dur2

    return [part1, part2]

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
            safe_latest = latest - timedelta(days=1)
            return safe_latest
    except Exception:
        return datetime.utcnow() - timedelta(days=7)  # fallback to 1 week ago

def make_key(e):
    return (e.get('id'), e.get('description', ''), e.get('start'))

def filter_entry(entry):
    return {
        "description": entry.get("description", ""),
        "start": entry.get("start"),
        "end": entry.get("end"),
        "dur": entry.get("dur")
    }
def main():
    start = get_last_date_from_file()
    end = datetime.utcnow()

    since = start.strftime('%Y-%m-%d')
    until = end.strftime('%Y-%m-%d')

    entries = fetch_entries(since, until)

    processed_entries = []
    for e in entries:
        processed_entries.extend(split_entry_if_crosses_midnight(e))

    # Load existing data
    try:
        with open(JSON_PATH, 'r') as f:
            existing = json.load(f)
    except Exception:
        existing = []

    final_entries = {}
    for e in existing + processed_entries:
        key = make_key(e)
        # If this composite key exists, this entry will overwrite it (merge)
        final_entries[key] = filter_entry(e)

    with open(JSON_PATH, 'w') as f:
        json.dump(list(final_entries.values()), f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    main()