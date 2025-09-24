import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { sessionMaterialAPI } from '../../services/api/session-material-api';

// Upload session material file
export const useUploadSessionMaterial = () => {
  return useMutation({
    mutationFn: (file: File) => sessionMaterialAPI.uploadSessionMaterial(file),
    onSuccess: (response) => {
      enqueueSnackbar(response.data.message || 'File uploaded successfully', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to upload file';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });
};

// Get session material presigned URL
export const useGetSessionMaterial = () => {
  return useMutation({
    mutationFn: (materialKey: string) => sessionMaterialAPI.getSessionMaterialByKey(materialKey),
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to get file URL';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });
};

// Delete session material
export const useDeleteSessionMaterial = () => {
  return useMutation({
    mutationFn: (materialKey: string) => sessionMaterialAPI.deleteSessionMaterialByKey(materialKey),
    onSuccess: (response) => {
      enqueueSnackbar(response.data.message || 'File deleted successfully', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to delete file';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });
};

// Add material to booking
export const useAddMaterialToBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookingId, materialData }: { 
      bookingId: string; 
      materialData: { key: string; url: string; filename: string } 
    }) => sessionMaterialAPI.addMaterialToBooking(bookingId, materialData),
    onSuccess: (response, variables) => {
      enqueueSnackbar(response.data.message || 'File added to session successfully', {
        variant: 'success',
      });
      
      // Invalidate session preparation query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ['session-preparation', variables.bookingId],
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to add file to session';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });
};

// Remove material from booking
export const useRemoveMaterialFromBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookingId, materialKey }: { bookingId: string; materialKey: string }) => 
      sessionMaterialAPI.removeMaterialFromBooking(bookingId, materialKey),
    onSuccess: (response, variables) => {
      enqueueSnackbar(response.data.message || 'File removed from session successfully', {
        variant: 'success',
      });
      
      // Invalidate session preparation query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ['session-preparation', variables.bookingId],
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to remove file from session';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });
};