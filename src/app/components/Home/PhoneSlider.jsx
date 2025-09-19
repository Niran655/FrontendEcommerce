"use client"
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Box, Button, Container, IconButton, Typography } from '@mui/material';
import React from 'react';
import { useState,useEffect } from 'react';

const slides = [
  {
    title: 'Max Book',
    description: 'Best for Play Game',
    buttonText: 'Buy Now',
    buttonUrl: '#',
    image: 'https://i0.wp.com/9to5mac.com/wp-content/uploads/sites/6/2023/06/macos-macbook-wallpaper.jpg?resize=1200%2C628&quality=82&strip=all&ssl=1 ',
  },
  {
    title: 'ASUS',
    description: 'Best for Play Game',
    buttonText: 'Buy Now',
    buttonUrl: '#',
    image: 'https://i.blogs.es/189204/apertura-macbook-pro-m2/1366_2000.jpeg',
  },
  {
    title: 'ACSER',
    description: 'Best for Play Game',
    buttonText: 'Buy Now',
    buttonUrl: '#',
    image: 'https://s.zst.com.br/cms-assets/2021/08/macbook-air-m1-tela.jpg',
  },
];

export default function PhoneSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true); 

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoplay) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [autoplay]);

  const goTo = (index) => setCurrentSlide(index);
  const next = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleImageError = (e) => {
    const fallbacks = [
      'https://picsum.photos/id/1018/1920/1080',
      'https://picsum.photos/id/1015/1920/1080',
      'https://picsum.photos/id/1019/1920/1080',
    ];
    e.target.src = fallbacks[currentSlide % fallbacks.length];
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: '30vh',
        minHeight: 400,
        borderRadius:2,
        overflow: 'hidden',
        '&:hover': { autoplay: false },
      }}
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      {slides.map((slide, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: currentSlide === index ? 1 : 0,
            transition: 'opacity 0.8s ease',
            zIndex: currentSlide === index ? 1 : 0,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
            }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              onError={handleImageError}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.8,
              }}
            />
          </Box>

          <Container
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                maxWidth: 600,
                color: 'white',
                transform: currentSlide === index ? 'translateX(0)' : 'translateX(40px)',
                opacity: currentSlide === index ? 1 : 0,
                transition: 'all 0.6s ease 0.3s',
              }}
            >
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {slide.title}
              </Typography>
              <Typography variant="h5" gutterBottom>
                {slide.description}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                href={slide.buttonUrl}
                sx={{ mt: 2 }}
              >
                {slide.buttonText}
              </Button>
            </Box>
          </Container>
        </Box>
      ))}

      {/* Navigation Buttons */}
      <IconButton
        onClick={prev}
        sx={{
          position: 'absolute',
          top: '50%',
          left: 16,
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
          zIndex: 3,
        }}
        aria-label="Previous slide"
      >
        <ArrowBackIos />
      </IconButton>
      <IconButton
        onClick={next}
        sx={{
          position: 'absolute',
          top: '50%',
          right: 16,
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
          zIndex: 3,
        }}
        aria-label="Next slide"
      >
        <ArrowForwardIos />
      </IconButton>

      {/* Slide Indicators */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 3,
        }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => goTo(index)}
            sx={{
              width: currentSlide === index ? 16 : 8,
              height: currentSlide === index ? 16 : 8,
              borderRadius: '50%',
              backgroundColor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}