import axiosInstance from '../axios';

// Types
export interface SessionMaterialFile {
  key: string;
  url: string;
  filename: string;
  uploadedAt: string;
}

export interface SessionMaterialApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface UploadSessionMaterialData {
  key: string;
  url: string;
  filename: string;
  type: string;
}

export interface SessionMaterialUrlData {
  materialKey: string;
  materialUrl: string;
  expiresIn: number;
}

export interface AddMaterialToBookingData {
  bookingId: string;
  materialFiles: SessionMaterialFile[];
}

export const sessionMaterialAPI = {
  // Upload session material file
  uploadSessionMaterial: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    return axiosInstance.post<SessionMaterialApiResponse<UploadSessionMaterialData>>(
      '/session-materials/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  // Get session material by key (generates presigned URL)
  getSessionMaterialByKey: (materialKey: string) => {
    const encodedKey = encodeURIComponent(materialKey);
    return axiosInstance.get<SessionMaterialApiResponse<SessionMaterialUrlData>>(
      `/session-materials/${encodedKey}`
    );
  },

  // Delete session material by key
  deleteSessionMaterialByKey: (materialKey: string) => {
    const encodedKey = encodeURIComponent(materialKey);
    return axiosInstance.delete<SessionMaterialApiResponse>(
      `/session-materials/${encodedKey}`
    );
  },

  // Add material file to coaching booking
  addMaterialToBooking: (
    bookingId: string,
    materialData: { key: string; url: string; filename: string }
  ) => {
    return axiosInstance.post<SessionMaterialApiResponse<AddMaterialToBookingData>>(
      `/session-materials/booking/${bookingId}/add`,
      materialData
    );
  },

  // Remove material file from coaching booking
  removeMaterialFromBooking: (bookingId: string, materialKey: string) => {
    return axiosInstance.post<SessionMaterialApiResponse<AddMaterialToBookingData>>(
      `/session-materials/booking/${bookingId}/remove`,
      { key: materialKey }
    );
  },
};