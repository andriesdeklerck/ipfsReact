import './App.css';
import React, { useState } from 'react';
import IPFS from 'ipfs';

function App() {
  const [fileHash, setFileHash] = useState('');
  const [fileBuffer, setFileBuffer] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const buffer = Buffer.from(reader.result);
      setFileBuffer(buffer);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = async () => {
    try {
      setUploading(true);

      const ipfs = await IPFS.create();
      const result = await ipfs.add(fileBuffer);
      const hash = result.cid.toString();

      setFileHash(hash);
      setUploaded(true);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>IPFS File Storage</h1>
      <input type="file" onChange={handleFileInputChange} />
      <button onClick={handleFileUpload} disabled={!fileBuffer || uploading}>
        Upload
      </button>
      {uploaded && (
        <div>
          <p>File uploaded successfully!</p>
          <p>IPFS Hash: {fileHash}</p>
        </div>
      )}
    </div>
  );
}

export default App;
