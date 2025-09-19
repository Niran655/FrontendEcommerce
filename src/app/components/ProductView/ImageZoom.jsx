import ReactImageMagnify from "react-image-magnify";
import React, { useState } from "react";

const ProductZoom = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="p-6">
      {/* Thumbnail Image */}
      <img
        src="https://m.media-amazon.com/images/I/71QE00iB9IL._AC_SL1500_.jpg"
        alt="Samsung Galaxy"
        className="w-64 cursor-pointer rounded-lg shadow"
        onClick={() => setIsOpen(true)}
      />

      {/* Modal Zoom */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl shadow-xl relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 bg-gray-200 px-3 py-1 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            {/* Zoom Component */}
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "Samsung Galaxy",
                  isFluidWidth: true,
                  src: "https://m.media-amazon.com/images/I/71QE00iB9IL._AC_SL1500_.jpg",
                },
                largeImage: {
                  src: "https://m.media-amazon.com/images/I/71QE00iB9IL._AC_SL1500_.jpg",
                  width: 1200,
                  height: 1800,
                },
                enlargedImageContainerDimensions: {
                  width: "150%",
                  height: "150%",
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductZoom;
