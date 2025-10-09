'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Upload, Save, X, FileText, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { NotebookIcon, CalendarIcon } from '@/components/assets';
import { useSessionPreparation } from '@/hooks/query/booking-queries';
import { useSavePreparationNotes } from '@/hooks/mutation/booking-mutation/booking-mutation';
import {
  useUploadSessionMaterial,
  useAddMaterialToBooking,
  useRemoveMaterialFromBooking,
  useGetSessionMaterial,
} from '@/hooks/mutation/session-material-mutations';
import { enqueueSnackbar } from 'notistack';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';
import ConfirmationModal from '@/components/common/confirmation-modal';

interface SessionPreparationPageProps {
  bookingId?: string;
}

const SessionPreparationPage = ({ bookingId }: SessionPreparationPageProps) => {
  const router = useRouter();

  const [preparationNotes, setPreparationNotes] = useState('');
  const [specialQuestion, setSpecialQuestion] = useState('');
  const [fileToDelete, setFileToDelete] = useState<{key: string, filename: string} | null>(null);
  const [loadingFileKey, setLoadingFileKey] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    day: '',
    month: '',
    year: '',
    hour: '',
    minute: '',
    timePeriod: '',
    birthCountry: '',
  });
  const [sessionDetails, setSessionDetails] = useState({
    date: '',
    time: '',
    duration: '',
  });

  // Fetch session preparation data
  const {
    data: sessionData,
    isLoading,
    error,
  } = useSessionPreparation(bookingId || '', undefined, !!bookingId);

  const saveNotesMutation = useSavePreparationNotes();
  const uploadMaterialMutation = useUploadSessionMaterial();
  const addMaterialMutation = useAddMaterialToBooking();
  const removeMaterialMutation = useRemoveMaterialFromBooking();
  const getMaterialMutation = useGetSessionMaterial();

  // Load session data when available
  useEffect(() => {
    if (sessionData?.data) {
      const session = sessionData.data;

      // Set client information
      if (session.client.dateOfBirth) {
        const birthDate = new Date(session.client.dateOfBirth);
        setFormData((prev) => ({
          ...prev,
          day: birthDate.getDate().toString(),
          month: birthDate.toLocaleString('default', { month: 'long' }),
          year: birthDate.getFullYear().toString(),
          hour: session.client.timeOfBirth?.split(':')[0] || '',
          minute: session.client.timeOfBirth?.split(':')[1] || '',
          timePeriod: session.client.timeOfBirth?.includes('PM') ? 'PM' : 'AM',
          birthCountry: session.client.placeOfBirth || '',
        }));
      }

      // Set session details - Use the new separate date/time fields
      setSessionDetails({
        date: session.selectedDate
          ? new Date(session.selectedDate).toLocaleDateString('en-US')
          : 'TBD',
        time: session.selectedTime
          ? `${session.selectedTime}${session.timezone ? ` (${session.timezone})` : ''}`
          : 'TBD',
        duration: session.session.duration || '60 minutes',
      });

      // Set preparation notes if available
      if (session.notes) {
        setPreparationNotes(session.notes);
      }

      // Set special questions
      if (session.specialQuestions && session.specialQuestions.length > 0) {
        setSpecialQuestion(
          session.specialQuestions
            .map((q) => `${q.question}: ${q.answer}`)
            .join('\n\n')
        );
      }
    }
  }, [sessionData]);

  // Load saved notes from localStorage as fallback
  useEffect(() => {
    if (!sessionData?.data) {
      const savedNotes = localStorage.getItem('sessionPreparationNotes');
      if (savedNotes) {
        setPreparationNotes(savedNotes);
      }
    }
  }, [sessionData]);

  const handleFieldChange = useCallback(
    (
      field: 'day' | 'month' | 'year' | 'hour' | 'minute' | 'timePeriod',
      value: string
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSelect = useCallback((field: 'birthCountry', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!bookingId) {
      enqueueSnackbar('No booking ID available', { variant: 'error' });
      return;
    }

    try {
      // Upload file to S3
      const uploadResult = await uploadMaterialMutation.mutateAsync(file);
      
      // Add file to booking
      await addMaterialMutation.mutateAsync({
        bookingId,
        materialData: {
          key: uploadResult.data.data.key,
          url: uploadResult.data.data.url,
          filename: uploadResult.data.data.filename,
        },
      });

      // Clear the file input
      event.target.value = '';
    } catch (error) {
      console.error('Failed to upload material:', error);
    }
  };

  const handleRemoveMaterial = (materialKey: string, filename: string) => {
    setFileToDelete({ key: materialKey, filename });
  };

  const confirmRemoveMaterial = async () => {
    if (!bookingId || !fileToDelete) return;

    try {
      await removeMaterialMutation.mutateAsync({
        bookingId,
        materialKey: fileToDelete.key,
      });
      setFileToDelete(null);
    } catch (error) {
      console.error('Failed to remove material:', error);
    }
  };

  const cancelRemoveMaterial = () => {
    setFileToDelete(null);
  };

  const handleViewMaterial = async (materialKey: string) => {
    try {
      setLoadingFileKey(materialKey);
      
      // Get presigned URL for secure access
      const response = await getMaterialMutation.mutateAsync(materialKey);
      
      if (response.data.data.materialUrl) {
        window.open(response.data.data.materialUrl, '_blank');
      }
    } catch (error) {
      console.error('Failed to view material:', error);
      enqueueSnackbar('Failed to open file', { variant: 'error' });
    } finally {
      setLoadingFileKey(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!bookingId) {
      // Fallback to localStorage if no booking ID
      localStorage.setItem('sessionPreparationNotes', preparationNotes);
      enqueueSnackbar('Notes saved locally', { variant: 'success' });
      return;
    }

    try {
      await saveNotesMutation.mutateAsync({
        bookingId,
        data: { notes: preparationNotes },
      });
      // Success notification is handled by the mutation
    } catch (error) {
      console.error('Failed to save notes:', error);
      // Error notification is handled by the mutation
    }
  };

  const handleStartSession = () => {
    // Navigate to live session page with booking ID if available
    if (bookingId) {
      router.push(`/dashboard/astrologers/live-session?bookingId=${bookingId}`);
    } else {
      router.push('/dashboard/astrologers/live-session');
    }
  };

  // Show error toast and treat as empty data
  useEffect(() => {
    if (error && bookingId) {
      enqueueSnackbar('Failed to load session preparation data', {
        variant: 'error',
      });
    }
  }, [error, bookingId]);

  // Loading state - only show if data is loading and we don't have any data yet
  if (isLoading && bookingId && !sessionData) {
    return (
      <div className="min-h-screen bg-black text-white p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-white">
            <SpinnerLoader size={20} color="#ffffff" />
            <span>Loading session preparation data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to default values if there are errors or no data
  const clientName = sessionData?.data?.client?.name || 'Client';
  const sessionTitle = sessionData?.data?.session?.title || 'Session';

  return (
    <div className="min-h-screen bg-black text-white p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <ArrowLeft
          className="w-5 h-5 cursor-pointer hover:text-gray-300"
          onClick={handleBack}
        />
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
            Session Preparation
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Prepare for upcoming consultation
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
          <div className="p-3 sm:p-4 md:p-6 bg-graphite">
            <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              <h2 className="text-base sm:text-lg font-semibold">
                Client Information
              </h2>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="text-sm sm:text-base text-white mb-1 font-semibold">
                  {clientName}
                </h3>
                <p className="text-white text-xs sm:text-sm font-semibold">
                  {sessionTitle}
                </p>
              </div>

              <div>
                <Label className="block text-xs sm:text-sm text-white mb-1 sm:mb-2 font-semibold">
                  Date Of Birth
                </Label>
                <input
                  type="text"
                  value={
                    sessionData?.data?.client?.dateOfBirth
                      ? new Date(
                          sessionData.data.client.dateOfBirth
                        ).toLocaleDateString()
                      : ''
                  }
                  readOnly
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-white text-xs sm:text-sm focus:outline-none bg-graphite border border-grey"
                />
              </div>

              <div>
                <Label className="block text-xs sm:text-sm text-white mb-1 sm:mb-2 font-semibold">
                  Time Of Birth
                </Label>
                <input
                  type="text"
                  value={sessionData?.data?.client?.timeOfBirth || ''}
                  readOnly
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-white text-xs sm:text-sm focus:outline-none bg-graphite border border-grey"
                />
              </div>

              <div>
                <Label className="block text-xs sm:text-sm text-white mb-1 sm:mb-2 font-semibold">
                  Place Of Birth
                </Label>
                <input
                  type="text"
                  value={sessionData?.data?.client?.placeOfBirth || ''}
                  readOnly
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-white text-xs sm:text-sm focus:outline-none bg-graphite border border-grey"
                />
              </div>

              <div>
                <Label className="block text-xs sm:text-sm text-white mb-1 sm:mb-2 font-semibold">
                  Special Questions
                </Label>
                <div className="w-full">
                  <div className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-white text-xs sm:text-sm bg-graphite border border-grey min-h-[100px] overflow-y-auto">
                    {sessionData?.data?.specialQuestions?.map((q, index) => (
                      <div key={index} className="mb-2">
                        <p className="font-semibold">{q.question}</p>
                        <p className="text-gray-300">{q.answer}</p>
                      </div>
                    )) || 'No special questions available'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="p-3 sm:p-4 md:p-6 bg-graphite">
              <h2 className="text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2 font-bold">
                <NotebookIcon className="w-5 h-5 sm:w-6 sm:h-6" color="white" />
                Preparation Notes
              </h2>

              <textarea
                value={preparationNotes}
                onChange={(e) => setPreparationNotes(e.target.value)}
                placeholder="Add your preparation notes, insights, or reminders for this session"
                rows={6}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-white text-xs sm:text-sm focus:outline-none resize-none mb-3 sm:mb-4 bg-graphite border border-grey"
              />

              <Button
                onClick={handleSaveNotes}
                disabled={saveNotesMutation.isPending}
                className="text-black font-medium w-full sm:w-auto text-xs sm:text-sm border-0 min-w-[120px] h-[45px] max-w-[175px] bg-gradient-to-r from-golden-glow via-pink-shade to-bronze"
              >
                {saveNotesMutation.isPending ? (
                  <>
                    <SpinnerLoader size={16} color="#000000" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Notes
                  </>
                )}
              </Button>
            </div>

            <div className="p-4 md:p-6 bg-graphite">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Materials
              </h2>

              {/* Uploaded Files List */}
              {sessionData?.data?.materialFiles && Array.isArray(sessionData.data.materialFiles) && sessionData.data.materialFiles.length > 0 && (
                <div className="mb-4 space-y-2">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Uploaded Files:</h3>
                  {sessionData.data.materialFiles.map((file: any, index: number) => {
                    const isFileLoading = loadingFileKey === file.key;
                    
                    return (
                      <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded">
                        <div 
                          className={`flex items-center gap-2 px-2 py-1 rounded flex-1 ${
                            isFileLoading 
                              ? 'cursor-wait opacity-70' 
                              : 'cursor-pointer hover:bg-gray-700'
                          }`}
                          onClick={() => !isFileLoading && handleViewMaterial(file.key)}
                        >
                          {isFileLoading ? (
                            <SpinnerLoader size={16} color="#60a5fa" />
                          ) : file.filename?.toLowerCase().endsWith('.pdf') ? (
                            <FileText className="w-4 h-4 text-red-400" />
                          ) : (
                            <Image className="w-4 h-4 text-blue-400" />
                          )}
                          <span className={`text-sm text-white truncate max-w-[200px] ${
                            isFileLoading ? '' : 'hover:text-blue-300'
                          }`}>
                            {file.filename || 'Unknown file'}
                          </span>
                          <span className="text-xs text-gray-400 ml-2">
                            {isFileLoading ? '(Loading...)' : '(Click to view)'}
                          </span>
                        </div>
                        <Button
                          onClick={() => handleRemoveMaterial(file.key, file.filename)}
                          disabled={removeMaterialMutation.isPending || isFileLoading}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 ml-2 disabled:opacity-50"
                        >
                          {removeMaterialMutation.isPending ? (
                            <SpinnerLoader size={14} color="#f87171" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="border-2 border-dashed p-8 text-center border-[#848d8a]">
                <div className="mb-4">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm mb-2">
                    Upload Charts, References, Or Preparation Materials
                  </p>
                  <p className="text-gray-500 text-xs">
                    PDF, PNG, JPG Up To 10MB
                  </p>
                </div>

                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  onChange={handleFileUpload}
                  disabled={uploadMaterialMutation.isPending || addMaterialMutation.isPending}
                  className="hidden"
                />

                <Button
                  asChild
                  disabled={uploadMaterialMutation.isPending || addMaterialMutation.isPending}
                  className="font-medium w-[175px] h-[60px] bg-transparent bg-gradient-to-r from-golden-glow via-pink-shade to-bronze bg-clip-text text-transparent border border-golden-glow disabled:opacity-50"
                >
                  <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center gap-2">
                    {uploadMaterialMutation.isPending || addMaterialMutation.isPending ? (
                      <>
                        <SpinnerLoader size={16} color="#d4af37" />
                        Uploading...
                      </>
                    ) : (
                      'Choose File'
                    )}
                  </label>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 bg-graphite">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6" color="white" />
            Session Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Date
              </label>
              <input
                type="text"
                value={sessionDetails.date}
                readOnly
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-white text-xs sm:text-sm focus:outline-none bg-graphite border border-grey"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Time
              </label>
              <input
                type="text"
                value={sessionDetails.time}
                readOnly
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-white text-xs sm:text-sm focus:outline-none bg-graphite border border-grey"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Duration
              </label>
              <input
                type="text"
                value={sessionDetails.duration}
                readOnly
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-white text-xs sm:text-sm focus:outline-none bg-graphite border border-grey"
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={handleStartSession}
            className="w-full sm:w-auto sm:max-w-md lg:max-w-lg xl:w-[485px] text-black mt-3 sm:mt-4 md:mt-6 lg:mt-8 mx-auto block text-sm sm:text-base border-0 bg-gradient-to-r from-golden-glow via-pink-shade to-bronze"
          >
            Start Session Now
          </Button>
        </div>
      </div>

      {/* File Deletion Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!fileToDelete}
        onClose={cancelRemoveMaterial}
        onConfirm={confirmRemoveMaterial}
        title="Delete File"
        message="Are you sure you want to delete"
        itemName={fileToDelete?.filename}
        confirmText="Delete"
        cancelText="Cancel"
        variant="delete"
        isLoading={removeMaterialMutation.isPending}
      />
    </div>
  );
};

export default SessionPreparationPage;
