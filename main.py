from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
import os
import uvicorn

app = FastAPI()

DATA_FILE = "entries.json"

# Ensure the data file exists
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as file:
        json.dump([], file)

# Function to read data from JSON file
def read_data():
    with open(DATA_FILE, "r") as file:
        return json.load(file)

# Function to write data to JSON file
def write_data(data):
    with open(DATA_FILE, "w") as file:
        json.dump(data, file, indent=4)

# Pydantic model for validation
class WorkEntry(BaseModel):
    project: str
    task: str
    hours: float

@app.get("/working_hours_app")
def get_work_hours():
    return read_data()

@app.post("/working_hours_app")
def add_work_hours(entry: WorkEntry):
    data = read_data()
    print(type(data))
    data.append(entry.model_dump())
    write_data(data)
    return {"message": "Entry added successfully"}

@app.delete("/working_hours_app/{index}")
def delete_work_entry(index: int):
    data = read_data()
    if 0 <= index < len(data):
        del data[index]
        write_data(data)
        return {"message": "Entry deleted successfully"}
    raise HTTPException(status_code=404, detail="Entry not found")

# Run the FastAPI app on a specific port
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)