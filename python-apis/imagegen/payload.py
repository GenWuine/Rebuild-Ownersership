import requests

# Payload data
payload = {
    "name": "macbook air",
    "description": "apple's latest macbook with the latest m5 chip",
    "url1": "https://bucketforadgen.s3.ap-south-1.amazonaws.com/realistic_professional_girl_like_real_world_model_img.png",
    "url2": "https://bucketforadgen.s3.ap-south-1.amazonaws.com/macbook-air-laptop-11549346117llrtyx80ne.png"
}

# API endpoint URL
url = "https://adgen.pythonanywhere.com/generate-ad-poster/"

# Making a POST request
response = requests.post(url, json=payload)

# Checking the response
if response.status_code == 200:
    output = response.json()
    print(output)
else:
    print(f"Error: {response.status_code}, {response.text}")
