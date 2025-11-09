'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Camera, X, Heart } from 'lucide-react';

interface UserPhoto {
  url: string;
  user: string;
  caption: string;
  uploadedAt: string;
}

interface UserPhotosGalleryProps {
  photos: UserPhoto[];
  productId?: string;
}

export default function UserPhotosGallery({ photos = [], productId }: UserPhotosGalleryProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<UserPhoto | null>(null);

  if (photos.length === 0 && !productId) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Camera className="w-8 h-8 text-purple-600" />
            Customer Photos
          </h2>
          <p className="text-gray-600 mb-4">Real photos from our happy customers!</p>
          
          {productId && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-bold hover:shadow-xl transition-all inline-flex items-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Share Your Photo
            </button>
          )}
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div
                key={index}
                onClick={() => setSelectedPhoto(photo)}
                className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
              >
                <Image
                  src={photo.url}
                  alt={photo.caption}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <p className="text-white font-bold text-sm">{photo.user}</p>
                  <p className="text-white text-xs line-clamp-2">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-12 h-12 text-purple-600" />
            </div>
            <p className="text-gray-600 text-lg mb-4">No customer photos yet</p>
            <p className="text-gray-500">Be the first to share your experience!</p>
          </div>
        )}

        {/* Photo Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-xl text-gray-900">{selectedPhoto.user}</h3>
                  <button className="text-red-500 hover:text-red-600 transition-colors">
                    <Heart className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600">{selectedPhoto.caption}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(selectedPhoto.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Share Your Photo</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Photo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-1">Click to upload</p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Share your experience with this product..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:shadow-xl transition">
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
