import React, { useState, useRef } from 'react';
import { FaUpload, FaCamera, FaTimes } from 'react-icons/fa';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const ImageUpload = ({ 
  onImageUpload, 
  currentImage, 
  placeholder = "Upload Image",
  className = "",
  showPreview = true,
  uploadType = "image" // "image" or "profile-photo"
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Upload to backend first
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append(uploadType === "profile-photo" ? "photo" : "image", file);
      
      let response;
      if (uploadType === "profile-photo") {
        response = await authAPI.uploadProfilePhoto(formData);
        const imageUrl = response.data.photoUrl;
        setPreview(`http://localhost:5000${imageUrl}`);
        onImageUpload(imageUrl);
      } else {
        response = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: formData
        });
        const data = await response.json();
        if (data.imageUrl) {
          const imageUrl = data.imageUrl;
          setPreview(`http://localhost:5000${imageUrl}`);
          onImageUpload(imageUrl);
        } else {
          throw new Error(data.message || 'Upload failed');
        }
      }

      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      setPreview(currentImage); // Revert to original image
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageUpload(null);
  };

  const handleLabelClick = () => {
    if (!uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {showPreview && preview && (
        <div className="relative inline-block">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/128x128?text=Image+Error';
            }}
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
          >
            <FaTimes className="w-3 h-3" />
          </button>
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <button
          type="button"
          onClick={handleLabelClick}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            uploading 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
          }`}
          disabled={uploading}
        >
          {uploadType === "profile-photo" ? <FaCamera /> : <FaUpload />}
          {uploading ? 'Uploading...' : placeholder}
        </button>
        
        {uploading && (
          <div className="text-sm text-gray-500">
            Uploading...
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload; 