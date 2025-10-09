'use client';
import React, { useState, Suspense } from 'react';
import { ChevronLeft, Plus, Trash2, Edit2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetAllServices } from '@/hooks/query/service-queries';
import { useCreateService, useDeleteService, useUpdateService } from '@/hooks/mutation/service-mutations';
import { Service, CreateServiceRequest } from '@/services/api/service-api';
import FullScreenLoader from '@/components/common/full-screen-loader';

const EditServicesContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // API hooks
  const { data: servicesData, isLoading, error } = useGetAllServices();
  const createServiceMutation = useCreateService();
  const deleteServiceMutation = useDeleteService();
  const updateServiceMutation = useUpdateService();
  
  // Local state
  const [showOtherServices, setShowOtherServices] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; serviceId: string; serviceName: string }>({
    show: false,
    serviceId: '',
    serviceName: ''
  });
  const [newService, setNewService] = useState<{ title: string; description: string; category: 'ASTROLOGY_READING' | 'COACHING_SESSION' }>({ 
    title: '', 
    description: '',
    category: 'ASTROLOGY_READING' 
  });
  
  const services = servicesData?.data || [];
  
  const handleBack = () => {
    const from = searchParams.get('from');
    if (from === 'editProfile') {
      router.push('/dashboard/astrologers/edit-profile?view=editProfile');
    } else {
      router.push('/dashboard/astrologers/edit-profile');
    }
  };
  
  const handleRemoveService = (service: Service) => {
    setDeleteConfirm({
      show: true,
      serviceId: service.id,
      serviceName: service.title
    });
  };
  
  const handleConfirmDelete = () => {
    deleteServiceMutation.mutate(deleteConfirm.serviceId);
    setDeleteConfirm({ show: false, serviceId: '', serviceName: '' });
  };
  
  const handleCancelDelete = () => {
    setDeleteConfirm({ show: false, serviceId: '', serviceName: '' });
  };
  
  const handleEditService = (service: Service) => {
    setEditingService(service);
    setNewService({ 
      title: service.title, 
      description: service.description || '', 
      category: service.category 
    });
    setShowOtherServices(true);
  };
  
  const handleAddService = (category: 'ASTROLOGY_READING' | 'COACHING_SESSION') => {
    setEditingService(null);
    setNewService({ title: '', description: '', category });
    setShowOtherServices(true);
  };
  
  const handleSaveService = async () => {
    if (newService.title.trim()) {
      const serviceData = {
        title: newService.title,
        description: newService.description || undefined,
        category: newService.category
      };
      
      if (editingService) {
        // Update existing service
        updateServiceMutation.mutate({
          id: editingService.id,
          data: serviceData
        }, {
          onSuccess: () => {
            setNewService({ title: '', description: '', category: 'ASTROLOGY_READING' });
            setEditingService(null);
            setShowOtherServices(false);
          }
        });
      } else {
        // Create new service
        createServiceMutation.mutate(serviceData, {
          onSuccess: () => {
            setNewService({ title: '', description: '', category: 'ASTROLOGY_READING' });
            setShowOtherServices(false);
          }
        });
      }
    }
  };
  
  const handleCancelAdd = () => {
    setNewService({ title: '', description: '', category: 'ASTROLOGY_READING' });
    setEditingService(null);
    setShowOtherServices(false);
  };
  
  const handleSaveChanges = () => {
    // If adding a new service, save it first
    if (showOtherServices && newService.title.trim()) {
      handleSaveService();
    } else {
      // Navigate back if no pending service
      handleBack();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-golden-glow mx-auto mb-4"></div>
          <p>Loading services...</p>
        </div>
      </div>
    );
  }

  // If there's an error, treat it as empty list to show professional UI
  const effectiveServices = error ? [] : services;
  const astrologyServices = effectiveServices.filter(s => s.category === 'ASTROLOGY_READING');
  const coachingServices = effectiveServices.filter(s => s.category === 'COACHING_SESSION');

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-full p-4 lg:p-8 pt-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <ChevronLeft 
              className="w-5 h-5 cursor-pointer hover:bg-gray-700 rounded p-1"
              onClick={handleBack}
            />
            <div>
              <h1 className="text-xl lg:text-2xl font-bold">Edit Service</h1>
              <p className="text-gray-400 text-xs lg:text-sm">Customize your experience and preferences.</p>
            </div>
          </div>
        </div>

        {/* Services Offered Section */}
        <div className="mb-8">
          <h3 className="text-white text-lg lg:text-xl mb-4 lg:mb-6 font-normal">Services Offered</h3>
          
          {/* Astrology Reading */}
          <div className="mb-8">
            <h4 className="text-white text-base font-normal mb-4">Astrology Reading</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {astrologyServices.map((service) => (
                <div
                  key={service.id}
                  className="relative bg-emerald-green/50 capitalize border border-emerald-green p-4 h-16 flex items-center justify-center cursor-pointer hover:border-golden-glow group transition-colors"
                >
                  <span className="text-sm text-center pr-2 group-hover:opacity-0 transition-opacity duration-200">{service.title}</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-1 p-2">
                    <button
                      onClick={() => handleEditService(service)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 disabled:opacity-50"
                      disabled={updateServiceMutation.isPending}
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleRemoveService(service)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 disabled:opacity-50"
                      disabled={deleteServiceMutation.isPending}
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => handleAddService('ASTROLOGY_READING')}
                className="border border-grey p-4 h-16 flex items-center justify-center hover:border-golden-glow transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                <span className="text-sm">Add Services</span>
              </button>
            </div>
          </div>

          {/* Coaching Sessions */}
          <div className="mb-8">
            <h4 className="text-white text-base font-normal mb-4">Coaching Sessions</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {coachingServices.map((service) => (
                <div
                  key={service.id}
                  className="relative bg-emerald-green/50 capitalize border border-emerald-green p-4 h-16 flex items-center justify-center cursor-pointer hover:border-golden-glow group transition-colors"
                >
                  <span className="text-sm text-center pr-2 group-hover:opacity-0 transition-opacity duration-200">{service.title}</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-1 p-2">
                    <button
                      onClick={() => handleEditService(service)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 disabled:opacity-50"
                      disabled={updateServiceMutation.isPending}
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleRemoveService(service)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 disabled:opacity-50"
                      disabled={deleteServiceMutation.isPending}
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => handleAddService('COACHING_SESSION')}
                className="border border-grey p-4 h-16 flex items-center justify-center hover:border-golden-glow transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                <span className="text-sm">Add Services</span>
              </button>
            </div>
          </div>

          {/* Other Services - Dynamic Form */}
          {showOtherServices && (
            <div className="mb-8">
              <h4 className="text-white text-base font-normal mb-4">
                {editingService ? 'Edit' : 'Add New'} {newService.category === 'ASTROLOGY_READING' ? 'Astrology Reading' : 'Coaching Session'}
              </h4>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newService.title}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  placeholder="Service Title"
                  className="w-full bg-transparent border border-grey px-4 py-3 text-white text-sm hover:border-golden-glow focus:border-golden-glow focus:outline-none placeholder-gray-500"
                />
                <textarea 
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Service Description (optional)"
                  className="w-full bg-transparent border border-grey px-4 py-3 text-white text-sm hover:border-golden-glow focus:border-golden-glow focus:outline-none h-24 resize-none placeholder-gray-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Only show when adding services */}
        {showOtherServices && (
          <div className="flex justify-start gap-4">
            <button
              onClick={handleCancelAdd}
              className="border border-grey px-6 py-3 text-white hover:bg-grey/10 transition-colors text-base font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
              className="bg-gradient-to-r from-golden-glow via-pink-shade to-bronze text-black px-6 py-3 text-base font-semibold hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(createServiceMutation.isPending || updateServiceMutation.isPending) 
                ? 'Saving...' 
                : editingService 
                  ? 'Update Service' 
                  : 'Save Changes'
              }
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-graphite border border-grey p-6 w-full max-w-md mx-4">
            <h3 className="text-white text-lg font-semibold mb-4">Delete Service</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{deleteConfirm.serviceName}"? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleCancelDelete}
                disabled={deleteServiceMutation.isPending}
                className="flex-1 border border-grey px-4 py-2 text-white hover:bg-grey/10 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteServiceMutation.isPending}
                className="flex-1 bg-red-600 px-4 py-2 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteServiceMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EditServicesPage = () => {
  return (
    <Suspense fallback={<FullScreenLoader loading={true} />}>
      <EditServicesContent />
    </Suspense>
  );
};

export default EditServicesPage;