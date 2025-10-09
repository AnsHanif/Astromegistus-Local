import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Clock, Radio, User, Calendar } from 'lucide-react';
import { useBookingDetails } from '@/hooks/query/booking-queries';
import SectionLoader from '@/components/common/section-loader';

interface ReadingDetailSheetProps {
  bookingId: string;
  triggerClassName?: string;
}

const STATUS_COLORS = {
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  CONFIRMED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  COMPLETED: 'bg-green-500/20 text-green-400 border-green-500/30',
  CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const READING_TYPE_COLORS = {
  AUTOMATED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  MANUAL: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

export function ReadingDetailSheet({ bookingId, triggerClassName }: ReadingDetailSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Only fetch data when sheet is opened
  const { data: reading, isLoading, error } = useBookingDetails(bookingId, isOpen);

  const getStatusColor = (status: string) => {
    return (
      STATUS_COLORS[status as keyof typeof STATUS_COLORS] ||
      'bg-gray-500/20 text-gray-400 border-gray-500/30'
    );
  };

  const getTypeColor = (type: string) => {
    return (
      READING_TYPE_COLORS[type as keyof typeof READING_TYPE_COLORS] ||
      'bg-gray-500/20 text-gray-400 border-gray-500/30'
    );
  };

  const formatPrice = (reading: any) => {
    const price =
      reading.type === 'AUTOMATED'
        ? reading.product.automatedPrice
        : reading.product.livePrice;
    return `$${price.toFixed(2)}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className={triggerClassName || "flex items-center justify-center gap-2 flex-1 bg-transparent text-golden-glow border border-golden-glow px-2 cursor-pointer"}
          onClick={() => setIsOpen(true)}
        >
          <Eye className="h-5 w-5" />
          View Details
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[600px] lg:w-[800px] sm:max-w-[90vw] lg:max-w-[800px] bg-emerald-green border-white/20 p-4 sm:p-6 overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-white text-lg sm:text-xl">
            Reading Details
          </SheetTitle>
        </SheetHeader>

        {isLoading && (
          <div className="h-[300px] sm:h-[400px]">
            <SectionLoader
              message="Loading reading details..."
              className="h-full"
              size={32}
              color="#D4AF37"
            />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-[300px] sm:h-[400px]">
            <div className="text-red-400 text-center">
              <p className="text-sm sm:text-base">Failed to load reading details</p>
              <p className="text-xs sm:text-sm text-white/60 mt-2">Please try again</p>
            </div>
          </div>
        )}

        {reading && (
          <ScrollArea className="h-[calc(100vh-80px)] sm:h-[calc(100vh-120px)] pr-2">
            <div className="space-y-4 sm:space-y-8 pr-2 sm:pr-4 pb-4 sm:pb-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-6 bg-white/5 rounded-lg">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/30 overflow-hidden flex-shrink-0">
                      {reading.user.profilePic ? (
                        <img
                          src={reading.user.profilePic}
                          alt={reading.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {reading.user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-white text-sm sm:text-base">
                        {reading.user.name}
                      </div>
                      <div className="text-xs sm:text-sm text-white/70 truncate">
                        {reading.user.email}
                      </div>
                      {reading.user.dateOfBirth && (
                        <div className="text-xs text-white/50 mt-1">
                          Born: {new Date(reading.user.dateOfBirth).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  Product Information
                </h3>
                <div className="p-4 sm:p-6 bg-white/5 rounded-lg space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-xs sm:text-sm text-white/70">Product Name</label>
                    <div className="text-white font-medium text-sm sm:text-base">
                      {reading.product.name}
                    </div>
                  </div>
                  {reading.product.description && (
                    <div>
                      <label className="text-sm text-white/70">Description</label>
                      <div className="text-white/90 text-sm">
                        {reading.product.description}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-white/70">Duration</label>
                    <div className="text-white flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {reading.product.duration}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/70">Categories</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {reading.product.categories.map((category: string) => (
                        <span
                          key={category}
                          className="px-2 py-1 bg-white/10 text-white/80 rounded text-xs"
                        >
                          {category.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  Order Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-5 bg-white/5 rounded-lg">
                    <label className="text-xs sm:text-sm text-white/70">Type</label>
                    <div className="mt-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(reading.type)}`}
                      >
                        {reading.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 bg-white/5 rounded-lg">
                    <label className="text-sm text-white/70">Status</label>
                    <div className="mt-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(reading.status)}`}
                      >
                        {reading.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 bg-white/5 rounded-lg">
                    <label className="text-sm text-white/70">Price</label>
                    <div className="text-white font-medium text-lg">
                      {formatPrice(reading)}
                    </div>
                  </div>
                  <div className="p-5 bg-white/5 rounded-lg">
                    <label className="text-sm text-white/70">Created</label>
                    <div className="text-white">
                      {new Date(reading.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scheduling Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Scheduling
                </h3>
                <div className="p-4 bg-white/5 rounded-lg">
                  {reading.selectedDate ? (
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm text-white/70">Date</label>
                        <div className="text-white">
                          {new Date(reading.selectedDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-white/70">Time</label>
                        <div className="text-white">
                          {reading.selectedTime} {reading.userTimezone && `(${reading.userTimezone})`}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-white/50">Not scheduled</div>
                  )}
                </div>
              </div>

              {/* Meeting Information */}
              {/* {reading.meetingLink && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Radio className="h-5 w-5" />
                    Meeting Information
                  </h3>
                  <div className="p-4 bg-white/5 rounded-lg space-y-2">
                    <div>
                      <label className="text-sm text-white/70">Meeting ID</label>
                      <div className="text-white font-mono text-sm">
                        {reading.meetingId}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-white/70">Status</label>
                      <div className="text-white">
                        {reading.meetingStatus || 'Scheduled'}
                      </div>
                    </div>
                  </div>
                </div>
              )} */}

              {/* Persons Information */}
              {/* {reading.persons && reading.persons.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Person Details
                  </h3>
                  {reading.persons.map((person: any) => (
                    <div
                      key={person.id}
                      className="p-4 bg-white/5 rounded-lg space-y-3"
                    >
                      <div>
                        <label className="text-sm text-white/70">Full Name</label>
                        <div className="text-white font-medium">
                          {person.fullName}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-white/70">
                            Date of Birth
                          </label>
                          <div className="text-white">
                            {new Date(person.dateOfBirth).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-white/70">
                            Time of Birth
                          </label>
                          <div className="text-white">
                            {person.timeOfBirth || 'Not specified'}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-white/70">
                          Place of Birth
                        </label>
                        <div className="text-white">
                          {person.placeOfBirth || 'Not specified'}
                        </div>
                      </div>

                      {person.questions && person.questions.length > 0 && (
                        <div className="mt-4">
                          <label className="text-sm text-white/70">Questions & Answers</label>
                          <div className="mt-2 space-y-2">
                            {person.questions.map((qa: any) => (
                              <div key={qa.id} className="p-3 bg-white/5 rounded">
                                <div className="text-white/90 text-sm font-medium">
                                  Q: {qa.questionText}
                                </div>
                                <div className="text-white/70 text-sm mt-1">
                                  A: {qa.answer || 'No answer provided'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )} */}

              {/* Provider Information */}
              {reading.provider && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Assigned Provider
                  </h3>
                  <div className="p-6 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full border-2 border-white/30 overflow-hidden">
                        {reading.provider.profilePic ? (
                          <img
                            src={reading.provider.profilePic}
                            alt={reading.provider.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                            {reading.provider.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {reading.provider.name}
                        </div>
                        <div className="text-sm text-white/70">
                          {reading.provider.email}
                        </div>
                        <div className="text-xs text-white/50 capitalize">
                          {reading.provider.role.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {reading.notes && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Notes</h3>
                  <div className="p-5 bg-white/5 rounded-lg">
                    <div className="text-white/90">{reading.notes}</div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}