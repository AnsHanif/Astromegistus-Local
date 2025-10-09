/**
 * React Query hooks for Transcript PDF generation
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/axios';

// Generate PDF from VTT mutation
export const useGenerateTranscriptPdf = () => {
  return useMutation({
    mutationFn: async (videoCallId: string) => {
      const response = await axiosInstance.post('/transcript-pdf/generate', {
        videoCallId,
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      console.log('xxx--- PDF generated successfully:', data.pdfUrl);
    },
    onError: (error: any) => {
      console.error('xxx--- Failed to generate PDF:', error);
      console.error('Error details:', error.response?.data);
    },
  });
};

// Get transcript PDF query
export const useTranscriptPdf = (videoCallId: string) => {
  return useQuery({
    queryKey: ['transcript-pdf', videoCallId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/transcript-pdf/${videoCallId}`
      );
      return response.data.data;
    },
    enabled: !!videoCallId,
    retry: 2,
  });
};

// Download PDF helper
export const downloadTranscriptPdf = (pdfUrl: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = fileName;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
