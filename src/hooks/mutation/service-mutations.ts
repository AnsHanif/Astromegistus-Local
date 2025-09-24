import { useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceAPI, CreateServiceRequest, UpdateServiceRequest } from '@/services/api/service-api';
import { enqueueSnackbar } from 'notistack';

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceRequest) =>
      serviceAPI.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      enqueueSnackbar('Service created successfully!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.error || 'Failed to create service.',
        { variant: 'error' }
      );
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateServiceRequest;
    }) => serviceAPI.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      enqueueSnackbar('Service updated successfully!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.error || 'Failed to update service.',
        { variant: 'error' }
      );
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => serviceAPI.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      enqueueSnackbar('Service deleted successfully!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.error || 'Failed to delete service.',
        { variant: 'error' }
      );
    },
  });
};