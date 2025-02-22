from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # This allows all origins. You can specify localhost if you want.
    allow_credentials=True,
    allow_methods=["*"],  # This allows all methods (GET, POST, DELETE, etc.)
    allow_headers=["*"],  # This allows all headers
)

# Path to the JSON file where todos will be saved
ENTRIES_FILE_PATH = 'todos.json'

def read_entries_from_file():
    print("Reading entries from file")
    if os.path.exists(ENTRIES_FILE_PATH):
        print("File found")
        try:
            with open(ENTRIES_FILE_PATH, 'r') as file:
                entries = json.load(file)
                print("Entries loaded")
                return entries
        except json.JSONDecodeError as error:
            print(f"Error reading JSON: {error}")
            return [] # Return an empty list if there was an error
    else:
            print(f"File not found: {ENTRIES_FILE_PATH}")
    return [] # Return an empty list if the file doesn't exist

def save_entries_to_file(entires):
    print("Saving entries to file")
    with open(ENTRIES_FILE_PATH, 'w') as file:
        json.dump(entires, file)

entries = read_entries_from_file()
print("Entries loaded from file")


class Entry(BaseModel):
    idx: int
    project: str
    task: str
    hours: str
@app.get("/")
def read_root():
    return {"message": "Welcome to Working Hours App"}

@app.get("/entries", response_model=List[Entry])
def get_entries():
    return entries

@app.post("/entries")
def add_entry(entry: Entry):
    entries.append(entry.model_dump(mode="json"))
    save_entries_to_file(entries)
    return

@app.delete("/entries/{idx}")
def delete_entry(idx: int):
    global entries
    entries = [e for e in entries if e["idx"]  != idx]
    save_entries_to_file(entries)
    return{"message": "Entry deleted"}

@app.put("/entries/{idx}")
def update_entry(idx: int, updated_entry: Entry):
    for entry in entries:
        if entry["idx"] == idx:
            entry["project"] = updated_entry.project
            entry["task"] = updated_entry.task
            entry["hours"] = updated_entry.hours
            return {"message": "Entry updated"}
    return {"message": "Entry not found"}, 404