'use client';

import React, { FC, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import CustomCheckbox from '@/components/common/custom-checkbox/custom-checkbox';
import { useAstrologers } from '@/hooks/query/user-queries';
import AstrologerProfileCard from '../../manual-reading/_components/astrologer-profile-card';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';
import { User } from '@/services/api/user-api';
import { useBooking } from '../../_components/booking-context';
import { useCreateRandomCoachingBooking } from '@/hooks/mutation/booking-mutation/booking-mutation';

interface Step1ChooseCoachProps {
  onNext: (choice: 'auto' | 'manual') => void;
  onPrev?: () => void;
}

const Step1ChooseCoach: FC<Step1ChooseCoachProps> = ({ onNext, onPrev }) => {
  // Get booking context to store selected coach and initialize state
  const { data: bookingData, updateData } = useBooking();
  
  const [isAutoMatch, setIsAutoMatch] = useState(bookingData.selectionType === 'auto');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCoach, setSelectedCoach] = useState<User | null>(null); // Will be set in useEffect when coaches load
  const [validationError, setValidationError] = useState('');
  
  // Random coaching booking mutation for auto-match
  const { mutateAsync: createRandomCoachingBooking, isPending: isCreatingRandomCoachingBooking } = useCreateRandomCoachingBooking();
  // Fetch coaches from API with pagination
  const {
    data: coachesData,
    isLoading,
    error,
    isError,
    refetch,
  } = useAstrologers('ASTROMEGISTUS_COACH', {
    limit: 6, // Show 6 coaches per page
    page: currentPage,
  });

  const coaches = coachesData?.data?.data?.users || [];
  const pagination = coachesData?.data?.data?.pagination;

  // Restore selected coach from context when coaches load
  useEffect(() => {
    if (coaches.length > 0 && bookingData.selectedProvider) {
      const savedCoach = coaches.find(coach => coach.id === bookingData.selectedProvider);
      if (savedCoach) {
        setSelectedCoach(savedCoach);
        const index = coaches.findIndex(coach => coach.id === bookingData.selectedProvider);
        setSelectedIndex(index >= 0 ? index : null);
      }
    }
  }, [coaches, bookingData.selectedProvider]);

  const handleNext = async (choice: 'auto' | 'manual') => {
    if (choice === 'manual' && !selectedCoach) {
      setValidationError('Please select a coach to continue');
      return;
    }

    setValidationError('');

    try {
      if (choice === 'auto') {
        // Call random coaching booking API for auto-match
        const randomCoachingBookingPayload = {
          sessionId: bookingData.productId, // Using productId as sessionId for coaching
        };

        const response = await createRandomCoachingBooking(randomCoachingBookingPayload);
        
        // Store the auto-assigned coach details
        updateData({
          selectedProvider: response.data.providerId || null,
          selectedProviderName: 'Auto-Assigned Coach',
          selectionType: choice,
          bookingId: response.data.id,
          sessionTitle: 'Coaching Session',
          sessionDescription: 'Live coaching session with auto-assigned coach',
          status: 'confirmed',
        });
      } else {
        // Manual selection - store selected coach in booking context
        updateData({
          selectedProvider: selectedCoach!.id,
          selectedProviderName: selectedCoach!.name,
          selectionType: choice,
        });
      }

      onNext(choice);
    } catch (error) {
      console.error('Error creating coaching booking:', error);
      setValidationError('Failed to create coaching booking. Please try again.');
    }
  };

  return (
    <section className="w-full">
      <header className="mb-3">
        <h2 className="text-size-large md:text-size-heading font-semibold">
          Choose Your Coach
        </h2>
        <p className="text-sm">
          You need to select 1 coach for your coaching session.
        </p>
      </header>

      <div className="border flex flex-col gap-4 md:flex-row items-center justify-between border-gray-200 bg-grey-light-50 p-8">
        <div>
          <CustomCheckbox
            checked={isAutoMatch}
            onChange={setIsAutoMatch}
            label="Auto-Match Me With Available Coaches"
            labelClassNames="font-semibold text-size-secondary"
          />

          <p className="mt-2 text-sm leading-5 ml-7">
            Let our system automatically assign the best available coaches based
            on your coaching needs and preferred time slots.
          </p>
        </div>

        <button className="border-emerald-green cursor-pointer p-3 pb-2 uppercase text-white font-medium text-sm bg-emerald-green hover:bg-emerald-green/90 transition px-3">
          Recommended
        </button>
      </div>
      <div>
        <h3 className="font-semibold my-6 text-size-large md:text-size-heading">
          Or choose manually
        </h3>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <SpinnerLoader />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">
              Failed to load coaches. Please try again.
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          </div>
        )}

        {/* Coaches Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:gap-x-12 md:gap-y-4 mb-12 place-items-center md:grid-cols-2">
            {coaches.length > 0 ? (
              coaches.map((coach: User, index: number) => (
                <AstrologerProfileCard
                  key={coach.id || index}
                  name={coach.name}
                  role={coach.astrologerType || 'Coach'}
                  availability="Available"
                  imageUrl={coach.profilePic || '/images/no-image.png'}
                  isChecked={selectedCoach?.id === coach.id}
                  onSelect={() => {
                    setSelectedCoach(coach);
                    setSelectedIndex(index);
                    setValidationError(''); // Clear validation error when selecting
                  }}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-500">
                  No coaches available at the moment.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && !error && pagination && pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-2 sm:gap-6 mb-8">
            <Button
              onClick={() => {
                setCurrentPage((prev) => Math.max(1, prev - 1));
                setSelectedCoach(null);
                setSelectedIndex(null);
              }}
              className="!h-12"
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>

            <span className="text-lg text-gray-600">
              Page {currentPage} of {pagination.pages}
            </span>

            <Button
              onClick={() => {
                setCurrentPage((prev) => Math.min(pagination.pages, prev + 1));
                setSelectedCoach(null);
                setSelectedIndex(null);
              }}
              disabled={currentPage === pagination.pages}
              variant="outline"
              size="sm"
              className="!h-12"
            >
              Next
            </Button>
          </div>
        )}

        {/* Validation Error */}
        {validationError && (
          <div className="text-center py-4">
            <p className="text-red-500 text-sm">{validationError}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        {onPrev && (
          <Button
            onClick={onPrev}
            variant={'outline'}
            className="border-black h-12 hover:bg-grey-light-50 md:max-w-[10rem] w-full px-2"
          >
            Back
          </Button>
        )}
        <Button
          onClick={() => handleNext(isAutoMatch ? 'auto' : 'manual')}
          variant={'outline'}
          className="bg-emerald-green h-12 hover:bg-emerald-green/90 md:max-w-[10rem] w-full px-2 text-white"
          disabled={isCreatingRandomCoachingBooking}
        >
          {isCreatingRandomCoachingBooking ? <SpinnerLoader /> : 'Next'}
        </Button>
      </div>
    </section>
  );
};

export default Step1ChooseCoach;
