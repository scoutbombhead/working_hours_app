from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
import os
import uvicorn
from typing import List


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (replace with your frontend URL for security)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


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

@app.post("/save_work_hours")
async def save_work_hours(entries: List[WorkEntry]):  # Explicitly define list type
    try:
        data = [entry.model_dump() for entry in entries]
        write_data(data)
        return {"message": "Work hours saved successfully!"}
    except Exception as e:
        return {"error": str(e)}

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