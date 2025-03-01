import requests

BASE_URL = "http://localhost:8000/working_hours_app"

def test_get_entries():
    response = requests.get(BASE_URL)
    print("GET Response:", response.json())

def test_add_entry():
    new_entry = {
        "project": "Test Project",
        "task": "Testing API",
        "hours": 4.5
    }
    response = requests.post(BASE_URL, json=new_entry)
    print("POST Response:", response.json())

def test_delete_entry(index):
    response = requests.delete(f"{BASE_URL}/{index}")
    print("DELETE Response:", response.json())

if __name__ == "__main__":
    print("Testing GET:")
    test_get_entries()

    print("\nTesting POST:")
    test_add_entry()
    test_get_entries()

    print("\nTesting DELETE:")
    test_delete_entry(0)  # Delete the first entry
    test_get_entries()
