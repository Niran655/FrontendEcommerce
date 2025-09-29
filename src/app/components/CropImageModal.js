"use client";
import { useState, useCallback } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Button, IconButton, Slider, Stack, Typography } from "@mui/material";
import { Close, Crop, RotateLeft, RotateRight } from "@mui/icons-material";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropUtils";

const CropImageModal = ({
  open,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatio = 1,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;

    setIsLoading(true);
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      
      onCropComplete(croppedImage);
      onClose();
    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const rotateLeft = () => {
    setRotation(rotation - 90);
  };

  const rotateRight = () => {
    setRotation(rotation + 90);
  };

  const zoomPercent = (value) => {
    return `${Math.round(value * 100)}%`;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
          maxHeight: '800px'
        }
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Crop Image</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ position: 'relative', height: '400px' }}>
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropCompleteCallback}
            objectFit="contain"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ flexDirection: 'column', gap: 2, p: 3 }}>
        {/* Controls */}
        <Box sx={{ width: '100%' }}>
          <Stack spacing={2}>
            {/* Zoom Control */}
            <Box>
              <Typography variant="body2" gutterBottom>
                Zoom: {zoomPercent(zoom)}
              </Typography>
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e, newZoom) => setZoom(newZoom)}
                valueLabelDisplay="auto"
                valueLabelFormat={zoomPercent}
              />
            </Box>

            {/* Rotation Control */}
            <Box>
              <Typography variant="body2" gutterBottom>
                Rotation: {rotation}°
              </Typography>
              <Slider
                value={rotation}
                min={0}
                max={360}
                step={1}
                onChange={(e, newRotation) => setRotation(newRotation)}
                valueLabelDisplay="auto"
              />
            </Box>

            {/* Rotation Buttons */}
            <Stack direction="row" spacing={1} justifyContent="center">
              <Button 
                startIcon={<RotateLeft />} 
                onClick={rotateLeft}
                variant="outlined"
                size="small"
              >
                Rotate Left
              </Button>
              <Button 
                startIcon={<RotateRight />} 
                onClick={rotateRight}
                variant="outlined"
                size="small"
              >
                Rotate Right
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} width="100%" justifyContent="flex-end">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleCrop}
            variant="contained"
            startIcon={<Crop />}
            disabled={isLoading || !croppedAreaPixels}
          >
            {isLoading ? "Cropping..." : "Crop Image"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default CropImageModal;