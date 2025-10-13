import React, { useState } from 'react';
import { FaTwitter, FaImage, FaSmile, FaTimes } from 'react-icons/fa';

const TwitterPostForm = ({ onSubmit, onCancel }) => {
  const [content, setContent] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const MAX_CHARS = 280;
  
  const handleChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setContent(text);
      setCharCount(text.length);
    }
  };
  
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview('');
  };
  
  const handleSubmit = () => {
    onSubmit(content, selectedImage);
  };
  
  return (
    <div className="w-full flex flex-col bg-background-dark rounded-xl overflow-hidden">
      <div className="flex items-center p-4 border-b border-white/5">
        <FaTwitter className="text-secondary text-xl mr-3" />
        <h3 className="m-0 text-white text-base font-medium flex-1">Create a Post</h3>
        <button 
          className="bg-transparent border-0 text-text-muted text-base cursor-pointer flex items-center justify-center"
          onClick={onCancel}
        >
          <FaTimes />
        </button>
      </div>
      
      <div className="p-4">
        <textarea
          className="w-full bg-background-medium border border-white/10 rounded-lg p-3 text-white text-base resize-none outline-none transition-colors focus:border-secondary"
          placeholder="What's happening?"
          value={content}
          onChange={handleChange}
          rows={4}
        />
        
        {imagePreview && (
          <div className="relative mt-4 rounded-lg overflow-hidden">
            <img src={imagePreview} alt="Preview" className="w-full max-h-[200px] object-cover rounded-lg" />
            <button 
              className="absolute top-2 right-2 bg-black/50 text-white border-0 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer text-sm transition-colors hover:bg-black/70"
              onClick={handleRemoveImage}
            >
              <FaTimes />
            </button>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between p-3 px-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <label className="bg-transparent border-0 text-secondary text-lg cursor-pointer p-1.5 flex items-center justify-center rounded-full transition-colors hover:bg-secondary/10">
            <FaImage />
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageSelect} 
              className="hidden" 
            />
          </label>
          <button className="bg-transparent border-0 text-secondary text-lg cursor-pointer p-1.5 flex items-center justify-center rounded-full transition-colors hover:bg-secondary/10">
            <FaSmile />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`text-text-muted text-sm ${charCount > MAX_CHARS * 0.8 ? 'text-warning' : ''}`}>
            {charCount}/{MAX_CHARS}
          </div>
          <button 
            className="py-2 px-4 bg-secondary text-white border-0 rounded-full text-sm font-medium cursor-pointer transition-colors hover:bg-[#0c85d0] disabled:bg-secondary/50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={charCount === 0 || charCount > MAX_CHARS}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwitterPostForm;