'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { CareerHeroBG } from '@/components/assets';
import { Button } from '@/components/ui/button';
import { useJobs } from '@/hooks/query/job-queries';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CareerPage() {
  const [activeTab, setActiveTab] = useState<'freelance' | 'employment'>('freelance');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: jobsResponse, isLoading, error } = useJobs({
    category: activeTab,
    page: currentPage,
    limit: 6,
  });

  const jobs = jobsResponse?.data?.data?.jobs || [];
  const pagination = jobsResponse?.data?.data?.pagination;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return '1 Day Ago';
    } else if (diffDays < 7) {
      return `${diffDays} Days Ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} Week${weeks > 1 ? 's' : ''} Ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} Month${months > 1 ? 's' : ''} Ago`;
    }
  };

  const handleTabChange = (tab: 'freelance' | 'employment') => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when switching tabs
  };

  return (
    <div className="">
      <h1 className="text-5xl text-center font-bold leading-tight px-4 sm:px-12 py-8 md:py-16">
        Innovators Wanted; Join <br />
        The Wises Revolution
      </h1>

      <img
        src={CareerHeroBG.src}
        alt="Innovators Wanted; Join The Wises Revolution"
        className="w-full h-auto object-contain"
        loading="eager"
      />

      <div className="px-4 sm:px-12 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Job & Career Openings
        </h2>

        <div className="mb-8">
          <div className="flex gap-4 sm:gap-8">
            <button
              onClick={() => handleTabChange('freelance')}
              className={`px-3 py-2 sm:px-4 sm:py-3 font-semibold text-size-secondary sm:text-size-medium transition-colors ${
                activeTab === 'freelance'
                  ? 'bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark bg-clip-text text-transparent'
                  : 'text-charcoal hover:text-golden-glow'
              }`}
            >
              Freelance
            </button>
            <button
              onClick={() => handleTabChange('employment')}
              className={`px-3 py-2 sm:px-4 sm:py-3 font-semibold text-size-secondary sm:text-size-medium transition-colors ${
                activeTab === 'employment'
                  ? 'bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark bg-clip-text text-transparent'
                  : 'text-charcoal hover:text-golden-glow'
              }`}
            >
              Employment
            </button>
          </div>
          <div className="border-b border-charcoal mt-2"></div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-charcoal">
              <Loader2 className="h-6 w-6 animate-spin" />
              Loading jobs...
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-red-500">
              Error loading jobs. Please try again later.
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-charcoal">
              No {activeTab} jobs available at the moment.
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="shadow-lg p-6 flex flex-col relative min-h-[350px]"
                >
                  <div className="pb-24 overflow-hidden">
                    <p className="text-grey text-sm font-normal mb-4">
                      {formatDate(job.createdAt)}
                    </p>
                    <h3 className="text-xl md:text-2xl font-semibold">
                      {job.title}
                    </h3>

                    <div className="flex gap-2 my-2 flex-wrap">
                      {job.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-size-tertiary font-normal px-3 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-base font-normal my-6 whitespace-pre-line">
                      {job.description.split('\n').filter(line => line.trim() !== '').join('\n')}
                    </p>
                  </div>

                  <div className="border-b border-[#D9D9D9] absolute bottom-24 left-6 right-6"></div>

                  <a
                    href={`mailto:hr@astromegistus.com?subject=Job Application - ${job.title}&body=Hello,%0D%0A%0D%0AI am interested in applying for the ${job.title} position.%0D%0A%0D%0AThank you for your consideration.%0D%0A%0D%0ABest regards,`}
                    className="w-full xs:w-44 h-12 md:h-12 bg-emerald-green text-white mx-auto absolute bottom-6 left-6 right-6 flex items-center justify-center rounded-md font-medium hover:bg-emerald-green/90 transition-colors"
                  >
                    Apply Now
                  </a>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    let pageNum;
                    if (pagination.pages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-white'
                            : 'text-charcoal hover:bg-charcoal hover:text-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= pagination.pages}
                  className="border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
