import React, { useState } from 'react';
import { Camera, Clock, MapPin, X, ZoomIn, Download, Trash2 } from 'lucide-react';
import { JobPhoto, jobStatusManager } from '../../utils/jobStatusManager';

interface JobPhotoGalleryProps {
  jobId: string;
  jobReference: string;
}

export function JobPhotoGallery({ jobId, jobReference }: JobPhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<JobPhoto | null>(null);
  
  const pickupPhotos = jobStatusManager.getPickupPhotos(jobId);
  const dropoffPhotos = jobStatusManager.getDropoffPhotos(jobId);
  
  const totalPhotos = pickupPhotos.length + dropoffPhotos.length;

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const PhotoCard = ({ photo }: { photo: JobPhoto }) => (
    <div 
      onClick={() => setSelectedPhoto(photo)}
      className="group relative bg-white rounded-xl overflow-hidden border-2 border-slate-200 hover:border-blue-400 transition-all cursor-pointer shadow-md hover:shadow-xl"
    >
      {/* Photo */}
      <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera className="w-16 h-16 text-slate-400" />
        </div>
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <ZoomIn className="w-12 h-12 text-white" />
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-semibold">{formatTime(photo.uploadedAt)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-blue-600">
          <span className="font-bold">{photo.uploadedByUsername}</span>
        </div>

        {photo.location && (
          <div className="flex items-center gap-1 text-xs text-green-600">
            <MapPin className="w-3 h-3" />
            <span className="font-mono text-[10px]">
              {photo.location.lat.toFixed(4)}, {photo.location.lng.toFixed(4)}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (totalPhotos === 0) {
    return (
      <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-8 text-center">
        <Camera className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-600 font-semibold">No photos uploaded yet</p>
        <p className="text-xs text-slate-500 mt-1">
          Photos will appear here when driver uploads them from mobile app
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-300">
          <p className="text-xs text-blue-600 font-semibold mb-1">Total Photos</p>
          <p className="text-2xl font-extrabold text-blue-700">{totalPhotos}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-300">
          <p className="text-xs text-green-600 font-semibold mb-1">📦 Pickup</p>
          <p className="text-2xl font-extrabold text-green-700">{pickupPhotos.length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-300">
          <p className="text-xs text-purple-600 font-semibold mb-1">🏠 Drop-off</p>
          <p className="text-2xl font-extrabold text-purple-700">{dropoffPhotos.length}</p>
        </div>
      </div>

      {/* Pickup Photos */}
      {pickupPhotos.length > 0 && (
        <div>
          <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
              📦
            </div>
            Pickup Photos ({pickupPhotos.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pickupPhotos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        </div>
      )}

      {/* Drop-off Photos */}
      {dropoffPhotos.length > 0 && (
        <div>
          <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
              🏠
            </div>
            Drop-off Photos ({dropoffPhotos.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {dropoffPhotos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className={`px-6 py-4 flex items-center justify-between ${
              selectedPhoto.type === 'pickup'
                ? 'bg-gradient-to-r from-green-600 to-green-500'
                : 'bg-gradient-to-r from-purple-600 to-purple-500'
            } text-white`}>
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {selectedPhoto.type === 'pickup' ? '📦 Pickup Photo' : '🏠 Drop-off Photo'}
                </h2>
                <p className="text-sm opacity-90 mt-1">{jobReference}</p>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Photo */}
            <div className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-8">
              <div className="max-w-2xl w-full aspect-square bg-white rounded-xl shadow-lg flex items-center justify-center">
                <Camera className="w-24 h-24 text-slate-400" />
              </div>
            </div>

            {/* Details */}
            <div className="bg-slate-50 p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-600 mb-1">Uploaded By</p>
                  <p className="font-bold text-slate-900">{selectedPhoto.uploadedByName}</p>
                  <p className="text-sm text-blue-600">{selectedPhoto.uploadedByUsername}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Upload Time</p>
                  <p className="font-bold text-slate-900">{formatTime(selectedPhoto.uploadedAt)}</p>
                </div>
              </div>

              {selectedPhoto.location && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-700 mb-1">
                    <MapPin className="w-4 h-4" />
                    <p className="text-xs font-semibold">GPS Location</p>
                  </div>
                  <p className="font-mono text-sm text-slate-900">
                    Lat: {selectedPhoto.location.lat.toFixed(6)}, Lng: {selectedPhoto.location.lng.toFixed(6)}
                  </p>
                  <a
                    href={`https://www.google.com/maps?q=${selectedPhoto.location.lat},${selectedPhoto.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline inline-block mt-1"
                  >
                    View on Google Maps →
                  </a>
                </div>
              )}

              {selectedPhoto.metadata && (
                <div className="text-xs text-slate-500">
                  {selectedPhoto.metadata.deviceModel && (
                    <p>Device: {selectedPhoto.metadata.deviceModel}</p>
                  )}
                  {selectedPhoto.metadata.appVersion && (
                    <p>App Version: {selectedPhoto.metadata.appVersion}</p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
