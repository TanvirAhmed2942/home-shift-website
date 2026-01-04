import React, { useState } from "react";
import { Camera, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const images = [
    {
      url: "https://images.unsplash.com/photo-1758523671413-cd178a883d6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpbmclMjBib3hlcyUyMGhvbWV8ZW58MXx8fHwxNzY1ODIwNzk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Professional Packing",
      category: "Packing Services",
    },
    {
      url: "https://images.unsplash.com/photo-1609188077093-bafe2e2c118d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHRydWNrJTIwdmFufGVufDF8fHx8MTc2NTc2OTg4OHww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Modern Fleet",
      category: "Our Vehicles",
    },
    {
      url: "https://images.unsplash.com/photo-1514739677676-e2c42dc777c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZhbWlseSUyMG1vdmluZ3xlbnwxfHx8fDE3NjU3MjM3MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Happy Customers",
      category: "Customer Success",
    },
    {
      url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjU4MTQ4ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Office Relocations",
      category: "Commercial Moves",
    },
    {
      url: "https://images.unsplash.com/photo-1644079446600-219068676743?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBsb2dpc3RpY3N8ZW58MXx8fHwxNzY1ODA1MTM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Secure Storage",
      category: "Storage Solutions",
    },
    {
      url: "https://images.unsplash.com/photo-1758523671413-cd178a883d6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpbmclMjBib3hlcyUyMGhvbWV8ZW58MXx8fHwxNzY1ODIwNzk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Quality Materials",
      category: "Packing Materials",
    },
  ];

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        selectedImage === 0 ? images.length - 1 : selectedImage - 1
      );
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        selectedImage === images.length - 1 ? 0 : selectedImage + 1
      );
    }
  };

  return (
    <section
      id="gallery"
      className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 px-6 py-3 rounded-full mb-6">
            <Camera className="w-4 h-4 text-blue-600" />
            <span className="text-blue-900 text-sm tracking-wider uppercase">
              Our Work
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Gallery of{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Excellence
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Take a look at our professional moving services and happy customers
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(index)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <ImageWithFallback
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block bg-blue-500 text-white text-xs px-3 py-1 rounded-full mb-3">
                    {image.category}
                  </span>
                  <h3 className="text-white text-xl font-bold mb-2">
                    {image.title}
                  </h3>
                </div>
              </div>

              {/* Zoom icon */}
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ZoomIn className="w-5 h-5 text-white" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button
            variant="default"
            onClick={() => {
              const bookingSection = document.getElementById("booking");
              if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="inline-flex items-center gap-2 h-14 text-xl  items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 shadow-xl"
          >
            <span className="font-semibold">Start Your Move Today</span>
          </Button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 p-3 rounded-full transition-all duration-300 z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Previous button */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 p-3 rounded-full transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="absolute right-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 p-3 rounded-full transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Image */}
          <div className="max-w-5xl w-full">
            <ImageWithFallback
              src={images[selectedImage].url}
              alt={images[selectedImage].title}
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <div className="text-center mt-6">
              <span className="inline-block bg-blue-500 text-white text-sm px-4 py-2 rounded-full mb-3">
                {images[selectedImage].category}
              </span>
              <h3 className="text-white text-2xl font-bold">
                {images[selectedImage].title}
              </h3>
              <p className="text-white/60 mt-2">
                {selectedImage + 1} / {images.length}
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}
