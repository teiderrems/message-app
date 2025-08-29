import React, { useState } from "react";

interface ImageDisplayProps {
  initialImageUrl?: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  initialImageUrl = "https://picsum.photos/400/300?random=1",
}) => {
  const [imageUrl, _] = useState(initialImageUrl);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openImageModal = () => {
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Message avec image */}
      <div className="flex justify-end">
        <div className="overflow-hidden rounded-t-lg">
          <img
            src={imageUrl}
            alt="Image partagée"
            className="w-full h-48 object-cover cursor-pointer"
            onClick={openImageModal}
          />
        </div>
      </div>

      {/* Modal d'affichage de l'image */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="font-semibold">Image partagée</h3>
              <button
                onClick={closeImageModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <img
                src={imageUrl}
                alt="Image en grand format"
                className="w-full h-64 object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageDisplay;
