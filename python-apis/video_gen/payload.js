// Payload data
const payload = {
    product_name: "laptop",
    product_description: "apple's new gen m5 chip laptop",
    model_img: "https://bucketforadgen.s3.ap-south-1.amazonaws.com/macbook_air_ad_poster.png",
    model_gender: "female"
  };
  
  // API endpoint URL
  const url = "https://videogen.pythonanywhere.com/generate-vid/";
  
  // Making a POST request
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Error: ${response.status}, ${response.statusText}`);
      }
    })
    .then(output => {
      console.log(output);
    })
    .catch(error => {
      console.error(error);
    });
  