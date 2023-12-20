import requests

# Payload data
payload = {
    'description': '{Stunning}'
}

# API endpoint URL
url = "https://modelgen.pythonanywhere.com/generate-model-img/"

# Making a POST request
response = requests.post(url, json=payload)

# Checking the response
if response.status_code == 200:
    output = response.json()
    print(output)
else:
    print(f"Error: {response.status_code}, {response.text}")
