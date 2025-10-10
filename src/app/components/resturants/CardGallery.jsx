"use client";
import React, { useRef } from "react";
import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../../../../style/CardGallery.scss";

// 🧠 Card data
const cards = [
  {
    title: "Teknoloji",
    desc: "Modern web teknolojileri ve yazılım geliştirme araçları ile projelerinizi hayata geçirin.",
    colorFrom: "#3b82f6",
    colorTo: "#6366f1",
    icon: "fa-laptop-code",
    badge: "Yeni",
    badgeColor: "#22c55e",
  },
  {
    title: "İletişim",
    desc: "Ekip içi iletişim ve müşteri ilişkilerinde başarılı olmak için gerekli tüm bilgiler.",
    colorFrom: "#a855f7",
    colorTo: "#ec4899",
    icon: "fa-comments",
  },
  {
    title: "Eğitim",
    desc: "Kariyer gelişiminiz için önemli becerileri öğrenin ve kendinizi sürekli geliştirin.",
    colorFrom: "#ec4899",
    colorTo: "#ef4444",
    icon: "fa-book-open",
    badge: "Popüler",
    badgeColor: "#eab308",
  },
  {
    title: "Analitik",
    desc: "Verileri analiz edin ve işletmeniz için akıllı kararlar alın.",
    colorFrom: "#22c55e",
    colorTo: "#14b8a6",
    icon: "fa-chart-pie",
  },
  {
    title: "İnovasyon",
    desc: "Sorunlara yenilikçi yaklaşımlar geliştirin ve rekabet avantajı sağlayın.",
    colorFrom: "#facc15",
    colorTo: "#f97316",
    icon: "fa-lightbulb",
  },
];

export default function CardGallery() {
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

  return (
    <Box className="card-gallery">
      <Box className="scroll-buttons">
        <IconButton onClick={() => scroll("left")} className="scroll-btn">
          <ChevronLeft />
        </IconButton>
        <IconButton onClick={() => scroll("right")} className="scroll-btn">
          <ChevronRight />
        </IconButton>
      </Box>

      <Box ref={sliderRef} className="card-slider">
        {cards.map((card, idx) => (
          <Card key={idx} className="gallery-card">
            <Box
              className="card-header"
              style={{
                background: `linear-gradient(to right, ${card.colorFrom}, ${card.colorTo})`,
              }}
            >
              <i className={`fas ${card.icon}`}></i>
              {card.badge && (
                <Box
                  className="badge"
                  style={{ backgroundColor: card.badgeColor }}
                >
                  {card.badge}
                </Box>
              )}
            </Box>

            <CardContent>
              <Typography variant="h6" fontWeight={600}>
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                {card.desc}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
