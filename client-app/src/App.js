import React, { useState } from 'react';
import './App.css';
import ImageCropper from './components/ImageCropper';
import Results from './components/Results/results.js';
import demoImage from './components//ImageCropper/demoImage.jpg';

const serverResponse = [];

function App() {
  // Declares a new state variable: imageToCrop, and new setting function: setImageToCrop
  const [imageToCrop, setImageToCrop] = useState(undefined); // useState() returns a variable and a setter func
  const [croppedImage, setCroppedImage] = useState(undefined);

  // only called when uploading a file
  const onUploadFile = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        const image = reader.result;

        setImageToCrop(image);
      });

      reader.readAsDataURL(event.target.files[0]); // this is the uploaded file parsed with FileReader
      // console.log(event.target.files[0]); // interesting format for the file.
    }
  };

  // converts Base64 to Blob URL
  function b64toBlob(b64, onsuccess, onerror) {
    let img = new Image();
    img.onerror = onerror;
    img.onload = function onload() {
      let canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      let ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(onsuccess);
    };
    img.src = b64;
  }

  // button to start the backend process
  // send a api call to the template matching service run with node/express and receive an object with image and count.
  function CountBtn() {
    //console.log(`Cropped Image URL: ${croppedImage}, Image to Crop URL: ${imageToCrop}`);

    // the next two functions are used to convert blobURLs to Base64
    async function parseURI(d) {
      var reader = new FileReader();
      reader.readAsDataURL(d);
      return new Promise((res, rej) => {
        reader.onload = (e) => {
          res(e.target.result);
        };
      });
    }
    async function getDataBlobURL(url) {
      var res = await fetch(url);
      var blob = await res.blob();
      var uri = await parseURI(blob);
      //console.log(uri);
      return uri;
    }

    // runs the function to convert Blob URL to Base64
    const croppedImageBlob = getDataBlobURL(croppedImage).then((result) => {
      return result;
    });
    const imageToCropBlob = getDataBlobURL(imageToCrop || demoImage).then((result) => {
      return result;
    });

    // function to get Base64 from promise object and post to server
    const postToServer = async () => {
      const croppedImageBase64 = await croppedImageBlob;
      const imageToCropBase64 = await imageToCropBlob;
      const data = {
        status: 'In-progress',
        templateImage: croppedImageBase64,
        image: imageToCropBase64,
        takeoffCount: null,
      };

      // ------api post request to server------ //
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };

      fetch('/api/send', options)
        .then((res) => res.json())
        .then(
          (results) => (
            b64toBlob(
              results.resultImage,
              function (blob) {
                let url = window.URL.createObjectURL(blob);
                //setResultImage(url);
                setImageToCrop(url); // Include this line to update ImageToCrop with the template matched image (Result Image)
              },
              function (error) {}
            ),
            //setServerResponse(results),
            serverResponse.push(results)
            //console.log('Response Object:', serverResponse)
          )
        );
    };

    postToServer();
  }

  return (
    <div className="app">
      <label className="drawing-upload">
        <input type="file" accept="image/*" onChange={onUploadFile} />
        Upload Drawing
      </label>
      <div>
        <ImageCropper
          imageToCrop={imageToCrop}
          onImageCropped={(croppedImage) => setCroppedImage(croppedImage)}
        />
      </div>
      {croppedImage && (
        <div className="croppedImg">
          <img alt="Cropped Img" src={croppedImage} />
        </div>
      )}
      <div className="app input">
        <button className="button" onClick={CountBtn}>
          Count Items
        </button>
        <Results serverResponse={serverResponse} />
      </div>
    </div>
  );
}

export default App;
