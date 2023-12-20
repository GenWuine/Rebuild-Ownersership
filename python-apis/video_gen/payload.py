import requests

# Payload data
payload = {
    "product_name" : "laptop",
    "product_description" : "apple's new gen m5 chip laptop",
    "model_img" : "https://bucketforadgen.s3.ap-south-1.amazonaws.com/macbook_air_ad_poster.png",
    "model_gender" : "female"
}

# API endpoint URL
url = "https://videogen.pythonanywhere.com/generate-vid/"

# Making a POST request
response = requests.post(url, json=payload)

# Checking the response
if response.status_code == 200:
    output = response.json()
    print(output)
else:
    print(f"Error: {response.status_code}, {response.text}")
