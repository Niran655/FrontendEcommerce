"use client";
import { useState, useRef } from "react";
import {
  Box,
  Button,
  Avatar,
  Typography,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { AddPhotoAlternate, Edit } from "@mui/icons-material";
import CropImageModal from "./CropImageModal";

const ImageUploadWithCropModal = ({
  onUploadSuccess,
  onUploadError,
  aspectRatio = 1,
  existingImageUrl = "",
}) => {
  const [selectedImage, setSelectedImage] = useState("");
  const [croppedImage, setCroppedImage] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const displayImage = croppedImage?.url || existingImageUrl;

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset error
    setError("");

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      const errorMsg = "Please select a valid image file";
      setError(errorMsg);
      onUploadError?.(errorMsg);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      const errorMsg = "Please select an image smaller than 10MB";
      setError(errorMsg);
      onUploadError?.(errorMsg);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
      setIsCropModalOpen(true);
    };
    reader.onerror = () => {
      const errorMsg = "Failed to read file";
      setError(errorMsg);
      onUploadError?.(errorMsg);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedImageData) => {
    setCroppedImage(croppedImageData);
    setError(""); // Clear previous errors
    await uploadToServer(croppedImageData.file);
  };

  const uploadToServer = async (file) => {
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file, file.name);
      
      console.log('Uploading file:', file.name, file.size); // Debug log

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response not OK:', response.status, errorText);
        
        // Check if it's HTML error page
        if (errorText.startsWith('<!DOCTYPE') || errorText.startsWith('<html')) {
          throw new Error('Server returned HTML instead of JSON. Check API route.');
        }
        
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      // Try to parse JSON
      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        throw new Error('Invalid response format from server');
      }

      if (result.success) {
        const imageUrl = result.imageUrl;
        console.log('Upload successful:', imageUrl); // Debug log
        onUploadSuccess?.({
          imageUrl,
          imageId: result.imageId,
          file: file
        });
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = error.message || 'Upload failed';
      setError(errorMsg);
      onUploadError?.(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditImage = () => {
    if (displayImage) {
      setSelectedImage(displayImage);
      setIsCropModalOpen(true);
    }
  };

  const handleRemoveImage = () => {
    setCroppedImage(null);
    setSelectedImage("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onUploadSuccess?.({ imageUrl: "" });
  };

  // Test API connection
  const testApiConnection = async () => {
    try {
      const response = await fetch("/api/upload");
      const data = await response.json();
      console.log('API test response:', data);
      return data;
    } catch (error) {
      console.error('API test failed:', error);
      setError(`API connection failed: ${error.message}`);
      return null;
    }
  };

  // Test connection on component mount
  useState(() => {
    testApiConnection();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Image Preview and Upload Area */}
      <Box
        sx={{
          border: "2px dashed #ddd",
          borderRadius: 2,
          p: 3,
          textAlign: "center",
          backgroundColor: "#fafafa",
          cursor: "pointer",
          "&:hover": {
            borderColor: "#1976d2",
            backgroundColor: "#f0f8ff",
          },
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        {displayImage ? (
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Avatar
              src={displayImage}
              sx={{
                width: 120,
                height: 120,
                mx: "auto",
                border: "3px solid #fff",
                boxShadow: 2,
              }}
              variant="rounded"
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -10,
                right: -10,
                backgroundColor: "white",
                borderRadius: "50%",
                p: 0.5,
                boxShadow: 2,
              }}
            >
              <Edit sx={{ fontSize: 16, color: "primary.main" }} />
            </Box>
          </Box>
        ) : (
          <Stack spacing={1} alignItems="center">
            <AddPhotoAlternate sx={{ fontSize: 48, color: "#ccc" }} />
            <Typography variant="body2" color="textSecondary">
              Click to upload image
            </Typography>
            <Typography variant="caption" color="textSecondary">
              PNG, JPG, JPEG up to 10MB
            </Typography>
          </Stack>
        )}
      </Box>

      {/* Action Buttons when image exists */}
      {displayImage && (
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Edit />}
            onClick={handleEditImage}
            disabled={isUploading}
          >
            Edit Image
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={handleRemoveImage}
            disabled={isUploading}
          >
            Remove
          </Button>
          {/* Debug button */}
          <Button
            size="small"
            variant="outlined"
            onClick={testApiConnection}
          >
            Test API
          </Button>
        </Stack>
      )}

      {/* Upload Status */}
      {isUploading && (
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <CircularProgress size={16} sx={{ mr: 1 }} />
          <Typography variant="body2" color="textSecondary">
            Uploading image...
          </Typography>
        </Box>
      )}

      {/* Crop Modal */}
      <CropImageModal
        open={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        imageSrc={selectedImage}
        onCropComplete={handleCropComplete}
        aspectRatio={aspectRatio}
      />
    </Box>
  );
};

export default ImageUploadWithCropModal;