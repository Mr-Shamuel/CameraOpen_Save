import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';

const Test = () => {
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);

  const handleOpenCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const handleTakePhoto = () => {
    if (stream) {
      const video = document.createElement('video');
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoDataUrl = canvas.toDataURL('image/png');
        setPhoto(photoDataUrl);

        // Create a link element, set the download attribute with a filename, and simulate a click to download the image
        const link = document.createElement('a');
        link.href = photoDataUrl;
        link.download = 'captured-photo.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        video.srcObject = null; // Stop the video stream
      };
      video.play();
    }
  };

  useEffect(() => {
    // Clean up function to stop the camera stream when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, [stream]);

  return (
    <div>
      <Button onClick={handleOpenCamera} variant="contained" color="primary">
        Open Camera
      </Button>
      <Button onClick={handleTakePhoto} variant="contained" color="secondary">
        Take Photo
      </Button>
      {photo && (
        <div>
          <p>Photo:</p>
          <img src={photo} alt="Captured Photo" />
        </div>
      )}
      {stream && (
        <div>
          <p>Camera View:</p>
          <video autoPlay playsInline ref={(video) => { if (video) video.srcObject = stream; }} />
        </div>
      )}
    </div>
  );
};

export default Test;
