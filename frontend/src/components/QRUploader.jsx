import jsQR from "jsqr";
import { useRef, useState } from "react";

function QRUploader({ onDecoded }) {
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("");
  const fileInputRef = useRef(null);

  const decodeImage = (file) => {
    if (!file.type.startsWith("image/")) {
      setStatus("Please upload a valid QR code image file.");
      return;
    }

    setFileName(file.name);
    setStatus("Reading QR code image...");

    const reader = new FileReader();

    reader.onerror = () => {
      setStatus("Unable to read this image. Please try another file.");
    };

    reader.onload = () => {
      const image = new Image();

      image.onerror = () => {
        setStatus("This image could not be loaded. Please use a clear PNG or JPG image.");
      };

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", { willReadFrequently: true });

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

        if (!qrCode) {
          setStatus("No QR code was detected. Try a sharper image with the full code visible.");
          return;
        }

        if (!qrCode.data) {
          setStatus("A QR code was detected, but it did not contain readable text.");
          return;
        }

        setStatus("QR code decoded. The extracted link is ready to analyze.");
        onDecoded(qrCode.data);
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      decodeImage(file);
    }
  };

  return (
    <section className="qr-uploader">
      <div>
        <p className="eyebrow">QR image upload</p>
        <h2>Extract a link from a QR code</h2>
        <p className="muted">
          Upload a clear QR image. The browser decodes it locally and fills the URL field automatically.
        </p>
      </div>

      <input
        ref={fileInputRef}
        className="hidden-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <button className="secondary-button" type="button" onClick={() => fileInputRef.current?.click()}>
        Choose QR image
      </button>

      {fileName && <p className="file-name">{fileName}</p>}
      {status && <p className="helper-text">{status}</p>}
    </section>
  );
}

export default QRUploader;
