import React, { FC, useEffect, useState } from 'react';
import { ManualReading } from './manual-reading.interfaces';
import CustomCheckbox from '@/components/common/custom-checkbox/custom-checkbox';
// import Image from 'next/image';
import AstrologerProfileCard from './astrologer-profile-card';
import { Button } from '@/components/ui/button';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';
import { User } from '@/services/api/user-api';
import { useBooking } from '../../_components/booking-context';
import { useProductAstrologers } from '@/hooks/mutation/product-sections-mutations';
import { useAstrologers } from '@/hooks/query/user-queries';
import { useSearchParams } from 'next/navigation';

interface Step3ChooseAstrologerProps {
  onPrev?: () => void;
  onNext: (choice: 'auto' | 'manual') => void;
}

const Step3ChooseAstrologer: FC<Step3ChooseAstrologerProps> = ({
  onNext,
  onPrev,
}) => {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId') || '';
  const itemId = searchParams.get('itemId') || '';
  // Get booking context to store selected astrologer and initialize state
  const { data: bookingData, updateData } = useBooking();

  const [isAutoMatch, setIsAutoMatch] = useState(
    bookingData.selectionType === 'auto'
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAstrologer, setSelectedAstrologer] = useState<User | null>(
    null // Will be set in useEffect when astrologers load
  );
  const [validationError, setValidationError] = useState('');
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);

  // Mutation for getting astrologers - only calls when manually triggered
  const { mutateAsync: getAstrologers, isPending } = useProductAstrologers();

  const {
    data: astrologersData,
    isLoading,
    error,
  } = useAstrologers('ASTROMEGISTUS', {
    limit: 6,
    page: currentPage,
    productId: productId,
  });

  const astrologers: User[] = astrologersData?.data?.data?.users || [];
  const pagination = astrologersData?.data?.data?.pagination;

  // Restore selected astrologer from context when astrologers load
  useEffect(() => {
    if (astrologers.length > 0 && bookingData.selectedProvider) {
      const savedAstrologer = astrologers.find(
        (astro: User) => astro.id === bookingData.selectedProvider
      );
      if (savedAstrologer) {
        setSelectedAstrologer(savedAstrologer);
        const index = astrologers.findIndex(
          (astro: User) => astro.id === bookingData.selectedProvider
        );
        setSelectedIndex(index >= 0 ? index : null);
      }
    }
  }, [astrologers, bookingData.selectedProvider]);

  const handleNext = async (choice: 'auto' | 'manual') => {
    if (choice === 'manual' && !selectedAstrologer) {
      setValidationError('Please select an astrologer to continue');
      return;
    }

    setValidationError('');

    try {
      if (choice === 'auto') {
        setIsLoadingRandom(true);
        // Call the POST API to get astrologers for this product
        const response = await getAstrologers({
          // productId: bookingData.productId,
          productId: productId,
        });

        if (response.data?.astrologer) {
          // Store the randomly selected astrologer details
          updateData({
            selectedProvider: response.data?.astrologer?.id,
            selectedProviderName: response.data?.astrologer?.name,
            selectionType: choice,
            productId: productId,
            itemId: itemId,
          });
        }

        setIsLoadingRandom(false);
      } else {
        updateData({
          selectedProvider: selectedAstrologer!.id,
          selectedProviderName: selectedAstrologer!.name,
          selectionType: choice,
          productId: productId,
          itemId: itemId,
        });

        console.log('Updated booking data with manually selected astrologer:', {
          selectedProvider: selectedAstrologer!.id,
          selectedProviderName: selectedAstrologer!.name,
          selectionType: choice,
        });
      }

      onNext('manual');
    } catch (error) {
      console.error('Error selecting astrologer:', error);
      setValidationError('Failed to select astrologer. Please try again.');
      setIsLoadingRandom(false);
    }
  };

  return (
    <section className="w-full">
      <header className="mb-3">
        <h2 className="text-size-large md:text-size-heading font-semibold">
          Choose Your Astrologer
        </h2>
        <p className="text-sm">
          You need to select 1 astrologer for your reading.
        </p>
      </header>

      <div className="border flex flex-col gap-4 md:flex-row items-center justify-between border-gray-200 bg-grey-light-50 p-8">
        <div>
          <CustomCheckbox
            checked={isAutoMatch}
            onChange={setIsAutoMatch}
            label="Auto-Match Me With Available Astrologers"
            labelClassNames="font-semibold text-size-secondary"
          />

          <p className="mt-2 text-sm leading-5 ml-7">
            Let our system automatically assign the best available astrologers
            based on your reading type and preferred time slots.
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
        {/* {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">
              Failed to load astrologers. Please try again.
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          </div>
        )} */}

        {/* Astrologers Grid */}
        {!isLoading && !error && astrologersData && (
          <div className="grid grid-cols-1 md:gap-x-12 md:gap-y-4 mb-12 place-items-center md:grid-cols-2">
            {astrologers.length > 0 ? (
              astrologers.map((astro: User, index: number) => (
                <AstrologerProfileCard
                  key={astro.id || index}
                  name={astro.name}
                  role={astro.astrologerType || 'Astrologer'}
                  availability="Available"
                  imageUrl={astro.profilePic || '/images/no-image.png'}
                  isChecked={selectedAstrologer?.id === astro.id}
                  onSelect={() => {
                    setSelectedAstrologer(astro);
                    setSelectedIndex(index);
                    setValidationError(''); // Clear validation error when selecting
                  }}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-500">
                  No astrologers available at the moment.
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
                setSelectedAstrologer(null);
                setSelectedIndex(null);
              }}
              className="!h-12"
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {pagination.pages}
            </span>

            <Button
              onClick={() => {
                setCurrentPage((prev) => Math.min(pagination.pages, prev + 1));
                setSelectedAstrologer(null);
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
        <Button
          onClick={onPrev}
          variant={'outline'}
          className="border-black h-12 hover:bg-grey-light-50 md:max-w-[10rem] w-full px-2"
        >
          Back
        </Button>
        <Button
          onClick={
            isAutoMatch ? () => handleNext('auto') : () => handleNext('manual')
          }
          variant={'outline'}
          className="bg-emerald-green h-12 hover:bg-emerald-green/90 md:max-w-[10rem] w-full px-2 text-white"
          disabled={isLoadingRandom}
        >
          {isLoadingRandom ? <SpinnerLoader /> : 'Next'}
        </Button>
      </div>
    </section>
  );
};

export default Step3ChooseAstrologer;
