const payload = {
    name: "macbook air",
    description: "apple's latest macbook with the latest m5 chip",
    url1: "https://bucketforadgen.s3.ap-south-1.amazonaws.com/realistic_professional_girl_like_real_world_model_img.png",
    url2: "https://bucketforadgen.s3.ap-south-1.amazonaws.com/macbook-air-laptop-11549346117llrtyx80ne.png",
  };
  
  const url = "https://adgen.pythonanywhere.com/generate-ad-poster/"
  ;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((output) => {
      console.log(output);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  