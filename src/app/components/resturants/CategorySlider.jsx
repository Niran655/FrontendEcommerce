"use client";
import React, { useRef } from "react";
import {
  Box,
  CardContent,
  Typography,
  IconButton,
  CardMedia,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { GET_ADMIN_CATEGORY } from "../../../../graphql/queries";
import { useQuery } from "@apollo/client/react";
import "../../../../style/CategorySlider.scss"; 

export default function CategorySlider() {
  const { data, loading, error } = useQuery(GET_ADMIN_CATEGORY);
  const categories = data?.getParentCategoryForAdmin || [];

  const sliderRef = useRef(null);
  const scroll = (dir) => {
    const slider = sliderRef.current;
    const scrollAmount = 360;
    if (slider) {
      slider.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading)
    return (
      <Typography textAlign="center" py={4}>
        Loading categories...
      </Typography>
    );
  if (error)
    return (
      <Typography textAlign="center" py={4} color="error">
        Failed to load categories
      </Typography>
    );

  return (
    <Box className="category-slider">
 
      <Box className="scroll-controls">
        <IconButton onClick={() => scroll("left")} className="scroll-btn">
          <ChevronLeft />
        </IconButton>
        <IconButton onClick={() => scroll("right")} className="scroll-btn">
          <ChevronRight />
        </IconButton>
      </Box>

      <Box ref={sliderRef} className="slider-container">
        {categories.map((card, idx) => (
          <Link key={idx} href={`/restaurants/category/${card.id}`} passHref>
            <Box className="category-card">
              <Box className="card-image">
                {card.image ? (
                  <CardMedia
                    component="img"
                    image={card.image}
                    alt={card.name}
                  />
                ) : (
                  <i className={`fas ${card.icon || "fa-image"}`}></i>
                )}
              </Box>
              <CardContent className="card-content">
                <Typography variant="body2" className="card-title">
                  {card.name}
                </Typography>
              </CardContent>
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  );
}
