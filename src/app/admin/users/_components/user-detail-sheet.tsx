import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Eye,
  User as UserIcon,
  Mail,
  Calendar,
  MapPin,
  Clock,
  Shield,
  CheckCircle2,
  XCircle,
  Settings,
  Activity,
  TrendingUp,
  Star,
  Briefcase,
  Globe,
  DollarSign,
  Users,
  Loader2,
} from 'lucide-react';
import { useComprehensiveAdminUser } from '@/hooks/query/admin-queries';
import { ComprehensiveUser } from '@/services/api/admin-api';
// Using the User interface from the users-columns to maintain compatibility
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: boolean;
  isActive?: boolean;
  verified: boolean;
  dummyPassword?: boolean;
  profilePic?: string;
  createdAt: string;
  updatedAt: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  languages?: string[];
  astrologyCategories?: string[];
  coachingCategories?: string[];
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  taxIdentification?: string;
  additionalComments?: string;
  adminNotes?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  timeZone?: string;
  offerTalkShow?: boolean;
  talkShowDay?: string;
  talkShowTime?: string;
  profilePictureKey?: string | null;
}

interface UserDetailSheetProps {
  user: User;
  onToggleStatus: (user: User) => void;
  isLoading?: boolean;
}

export function UserDetailSheet({
  user,
  onToggleStatus,
  isLoading = false,
}: UserDetailSheetProps) {
  // Fetch comprehensive user data
  const {
    data: comprehensiveUserResponse,
    isLoading: isLoadingComprehensive,
    error: comprehensiveError,
  } = useComprehensiveAdminUser(user.id);

  const comprehensiveUser = comprehensiveUserResponse?.data?.data?.user;
  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: 'bg-red-500/20 text-red-400 border-red-500/30',
      ASTROMEGISTUS: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      ASTROMEGISTUS_COACH: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      PAID: 'bg-green-500/20 text-green-400 border-green-500/30',
      GUEST: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[role] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      ADMIN: 'Admin',
      ASTROMEGISTUS: 'Astrologer',
      ASTROMEGISTUS_COACH: 'Coach',
      PAID: 'Paid User',
      GUEST: 'Guest',
    };
    return labels[role] || role;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 p-1"
          title="View User Details"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[600px] lg:w-[800px] sm:max-w-[90vw] lg:max-w-[800px] bg-emerald-green border-white/20 p-4 sm:p-6 overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-white text-lg sm:text-xl">User Details</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)] sm:h-[calc(100vh-120px)]">
          <div className="space-y-4 sm:space-y-8 pr-2 sm:pr-6 pb-4 sm:pb-6">
            {/* Loading State */}
            {isLoadingComprehensive && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-white/70">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Loading comprehensive profile data...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {comprehensiveError && (
              <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <span className="text-red-400 font-medium">
                    Failed to load comprehensive profile data
                  </span>
                </div>
                <div className="text-red-200/70 text-sm mt-1">
                  Showing basic profile information only.
                </div>
              </div>
            )}

            {/* Use comprehensive data if available, fallback to basic user data */}
            {(() => {
              const displayUser = comprehensiveUser || user;
              return (
                <>
                  {/* Profile Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <UserIcon className="h-5 w-5" />
                      Profile Information
                    </h3>
                    <div className="flex items-start space-x-6 p-6 bg-white/5 rounded-lg">
                      <div className="w-20 h-20 rounded-full border-2 border-white/30 overflow-hidden flex-shrink-0">
                        {displayUser.profilePic ? (
                          <img
                            src={displayUser.profilePic}
                            alt={displayUser.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-2xl">
                            {displayUser.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="text-2xl font-bold text-white">
                            {displayUser.name}
                          </div>
                          <div className="text-white/70 flex items-center gap-2 mt-1">
                            <Mail className="h-4 w-4" />
                            {displayUser.email}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-white/60" />
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(displayUser.role)}`}
                            >
                              {getRoleLabel(displayUser.role)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {displayUser.verified ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-green-400" />
                                <span className="text-green-400 text-sm">
                                  Verified
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-orange-400" />
                                <span className="text-orange-400 text-sm">
                                  Pending
                                </span>
                              </>
                            )}
                          </div>
                          {/* Profile Completeness */}
                          {/* {comprehensiveUser?.professionalSummary && (
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span className="text-yellow-400 text-sm">
                                {
                                  comprehensiveUser.professionalSummary
                                    .profileCompleteness
                                }
                                % Complete
                              </span>
                            </div>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics - Only show if user has meaningful activity */}
                  {comprehensiveUser?.metrics &&
                    (() => {
                      const hasMetrics =
                        (comprehensiveUser.metrics.totalBookings &&
                          comprehensiveUser.metrics.totalBookings > 0) ||
                        (comprehensiveUser.metrics.availableTimeSlots &&
                          comprehensiveUser.metrics.availableTimeSlots > 0) ||
                        (comprehensiveUser.metrics.estimatedRevenue &&
                          comprehensiveUser.metrics.estimatedRevenue > 0) ||
                        (comprehensiveUser.metrics.completionRate &&
                          comprehensiveUser.metrics.completionRate > 0);

                      if (!hasMetrics) return null;

                      return (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Performance Metrics
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {comprehensiveUser.metrics.totalBookings > 0 && (
                              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <div className="text-blue-400 text-sm">
                                  Total Bookings
                                </div>
                                <div className="text-2xl font-bold text-white">
                                  {comprehensiveUser.metrics.totalBookings}
                                </div>
                              </div>
                            )}
                            {comprehensiveUser.metrics.completionRate > 0 && (
                              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <div className="text-green-400 text-sm">
                                  Completion Rate
                                </div>
                                <div className="text-2xl font-bold text-white">
                                  {comprehensiveUser.metrics.completionRate}%
                                </div>
                              </div>
                            )}
                            {comprehensiveUser.metrics.availableTimeSlots >
                              0 && (
                              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                <div className="text-purple-400 text-sm">
                                  Available Slots
                                </div>
                                <div className="text-2xl font-bold text-white">
                                  {comprehensiveUser.metrics.availableTimeSlots}
                                </div>
                              </div>
                            )}
                            {comprehensiveUser.metrics.estimatedRevenue > 0 && (
                              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <div className="text-yellow-400 text-sm">
                                  Est. Revenue
                                </div>
                                <div className="text-2xl font-bold text-white">
                                  ${comprehensiveUser.metrics.estimatedRevenue}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                  {/* Account Status */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Account Status
                    </h3>
                    <div className="p-6 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">
                            Account Status
                          </div>
                          <div className="text-white/70 text-sm">
                            {displayUser.status
                              ? 'User account is active'
                              : 'User account is inactive'}
                          </div>
                          {/* Account Age */}
                          {comprehensiveUser?.metrics &&
                            comprehensiveUser.metrics.accountAge > 0 && (
                              <div className="text-white/50 text-xs mt-1">
                                Account age:{' '}
                                {comprehensiveUser.metrics.accountAge} days
                                {comprehensiveUser.metrics
                                  .hasRecentActivity && (
                                  <span className="text-green-400 ml-2">
                                    • Recently Active
                                  </span>
                                )}
                              </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-sm font-medium ${displayUser.status ? 'text-green-400' : 'text-red-400'}`}
                          >
                            {displayUser.status ? 'Active' : 'Inactive'}
                          </span>
                          <Switch
                            checked={displayUser.status}
                            onCheckedChange={() =>
                              onToggleStatus(displayUser as any)
                            }
                            disabled={isLoading}
                            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500 [&>*]:bg-white [&>*]:data-[state=checked]:bg-white [&>*]:data-[state=unchecked]:bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Details */}
                  {(displayUser.gender ||
                    displayUser.dateOfBirth ||
                    displayUser.timeOfBirth ||
                    displayUser.placeOfBirth ||
                    displayUser.timeZone) && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">
                        Personal Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {displayUser.gender && (
                          <div className="p-5 bg-white/5 rounded-lg">
                            <label className="text-sm text-white/70">
                              Gender
                            </label>
                            <div className="text-white font-medium capitalize">
                              {displayUser.gender}
                            </div>
                          </div>
                        )}
                        {displayUser.dateOfBirth && (
                          <div className="p-5 bg-white/5 rounded-lg">
                            <label className="text-sm text-white/70 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Date of Birth
                            </label>
                            <div className="text-white font-medium">
                              {formatDate(displayUser.dateOfBirth)}
                            </div>
                          </div>
                        )}
                        {displayUser.timeOfBirth && (
                          <div className="p-5 bg-white/5 rounded-lg">
                            <label className="text-sm text-white/70 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Time of Birth
                            </label>
                            <div className="text-white font-medium">
                              {displayUser.timeOfBirth}
                            </div>
                          </div>
                        )}
                        {displayUser.placeOfBirth && (
                          <div className="p-5 bg-white/5 rounded-lg">
                            <label className="text-sm text-white/70 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              Place of Birth
                            </label>
                            <div className="text-white font-medium">
                              {displayUser.placeOfBirth}
                            </div>
                          </div>
                        )}
                        {displayUser.timeZone && (
                          <div className="p-5 bg-white/5 rounded-lg">
                            <label className="text-sm text-white/70">
                              Time Zone
                            </label>
                            <div className="text-white font-medium">
                              {displayUser.timeZone}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  {(displayUser.phoneNumber ||
                    displayUser.address ||
                    displayUser.city ||
                    displayUser.state ||
                    displayUser.zipCode) && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {displayUser.phoneNumber && (
                          <div className="p-5 bg-white/5 rounded-lg">
                            <label className="text-sm text-white/70">
                              Phone Number
                            </label>
                            <div className="text-white font-medium">
                              {displayUser.phoneNumber}
                            </div>
                          </div>
                        )}
                        {displayUser.address && (
                          <div className="p-5 bg-white/5 rounded-lg">
                            <label className="text-sm text-white/70">
                              Address
                            </label>
                            <div className="text-white font-medium">
                              {displayUser.address}
                            </div>
                          </div>
                        )}
                        {displayUser.city && (
                          <div className="p-5 bg-white/5 rounded-lg">
                            <label className="text-sm text-white/70">
                              City
                            </label>
                            <div className="text-white font-medium">
                              {displayUser.city}
                            </div>
                          </div>
                        )}
                        {displayUser.state && (
                          <div className="p-5 bg-white/5 rounded-lg">
                            <label className="text-sm text-white/70">
                              State
                            </label>
                            <div className="text-white font-medium">
                              {displayUser.state}
                            </div>
                          </div>
                        )}
                        {displayUser.zipCode && (
                          <div className="p-5 bg-white/5 rounded-lg">
                            <label className="text-sm text-white/70">
                              ZIP Code
                            </label>
                            <div className="text-white font-medium">
                              {displayUser.zipCode}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Professional Information */}
                  {((displayUser.languages &&
                    displayUser.languages.length > 0) ||
                    (displayUser.astrologyCategories &&
                      displayUser.astrologyCategories.length > 0) ||
                    (displayUser.coachingCategories &&
                      displayUser.coachingCategories.length > 0) ||
                    displayUser.offerTalkShow) && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Professional Information
                      </h3>
                      <div className="space-y-4">
                        {displayUser.languages &&
                          displayUser.languages.length > 0 && (
                            <div className="p-5 bg-white/5 rounded-lg">
                              <label className="text-sm text-white/70">
                                Languages
                              </label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {displayUser.languages.map(
                                  (language, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-sm"
                                    >
                                      {language}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        {displayUser.astrologyCategories &&
                          displayUser.astrologyCategories.length > 0 && (
                            <div className="p-5 bg-white/5 rounded-lg">
                              <label className="text-sm text-white/70">
                                Astrology Categories
                              </label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {displayUser.astrologyCategories.map(
                                  (category, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-sm"
                                    >
                                      {category}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        {displayUser.coachingCategories &&
                          displayUser.coachingCategories.length > 0 && (
                            <div className="p-5 bg-white/5 rounded-lg">
                              <label className="text-sm text-white/70">
                                Coaching Categories
                              </label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {displayUser.coachingCategories.map(
                                  (category, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-sm"
                                    >
                                      {category}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        {displayUser.offerTalkShow && (
                          <div className="p-5 bg-white/5 rounded-lg">
                            <label className="text-sm text-white/70">
                              Talk Show Schedule
                            </label>
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-sm">
                                  Offers Talk Show
                                </span>
                              </div>
                              {(displayUser.talkShowDay || displayUser.talkShowTime) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                  {displayUser.talkShowDay && (
                                    <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                      <label className="text-xs text-orange-400/70">
                                        Day
                                      </label>
                                      <div className="text-orange-300 font-medium">
                                        {displayUser.talkShowDay}
                                      </div>
                                    </div>
                                  )}
                                  {displayUser.talkShowTime && (
                                    <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                      <label className="text-xs text-orange-400/70">
                                        Time
                                      </label>
                                      <div className="text-orange-300 font-medium">
                                        {displayUser.talkShowTime}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Financial Information */}
                  {(displayUser.bankAccountNumber ||
                    displayUser.bankRoutingNumber ||
                    displayUser.taxIdentification) && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Financial Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {displayUser.bankAccountNumber && (
                          <div className="p-5 bg-white/5 rounded-lg border border-yellow-500/20">
                            <label className="text-sm text-white/70">
                              Bank Account
                            </label>
                            <div className="text-white font-mono text-sm">
                              {displayUser.bankAccountNumber}
                            </div>
                          </div>
                        )}
                        {displayUser.bankRoutingNumber && (
                          <div className="p-5 bg-white/5 rounded-lg border border-yellow-500/20">
                            <label className="text-sm text-white/70">
                              Routing Number
                            </label>
                            <div className="text-white font-mono text-sm">
                              {displayUser.bankRoutingNumber}
                            </div>
                          </div>
                        )}
                        {displayUser.taxIdentification && (
                          <div className="p-5 bg-white/5 rounded-lg border border-yellow-500/20">
                            <label className="text-sm text-white/70">
                              Tax ID
                            </label>
                            <div className="text-white font-mono text-sm">
                              {displayUser.taxIdentification}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Account Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      Account Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-white/5 rounded-lg">
                        <label className="text-sm text-white/70">
                          Verification Status
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          {displayUser.verified ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-green-400" />
                              <span className="text-green-400 font-medium">
                                Verified
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-orange-400" />
                              <span className="text-orange-400 font-medium">
                                Pending Verification
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="p-5 bg-white/5 rounded-lg">
                        <label className="text-sm text-white/70">
                          Account Type
                        </label>
                        <div className="text-white font-medium">
                          {displayUser.dummyPassword
                            ? 'Temporary Access'
                            : 'Full Account'}
                        </div>
                      </div>
                      <div className="p-5 bg-white/5 rounded-lg">
                        <label className="text-sm text-white/70">
                          Created Date
                        </label>
                        <div className="text-white font-medium">
                          {formatDateTime(displayUser.createdAt)}
                        </div>
                      </div>
                      <div className="p-5 bg-white/5 rounded-lg">
                        <label className="text-sm text-white/70">
                          Last Updated
                        </label>
                        <div className="text-white font-medium">
                          {formatDateTime(displayUser.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Notes and Comments */}
                  {(displayUser.adminNotes ||
                    displayUser.additionalComments) && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">
                        Admin Notes & Comments
                      </h3>
                      <div className="space-y-4">
                        {displayUser.adminNotes && (
                          <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <label className="text-sm text-blue-400 font-medium">
                              Admin Notes
                            </label>
                            <div className="text-white/90 mt-2 whitespace-pre-wrap">
                              {displayUser.adminNotes}
                            </div>
                          </div>
                        )}
                        {displayUser.additionalComments && (
                          <div className="p-5 bg-white/5 rounded-lg">
                            <label className="text-sm text-white/70 font-medium">
                              Additional Comments
                            </label>
                            <div className="text-white/90 mt-2 whitespace-pre-wrap">
                              {displayUser.additionalComments}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Recent Bookings */}
                  {comprehensiveUser?.bookings &&
                    comprehensiveUser.bookings.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Briefcase className="h-5 w-5" />
                          Recent Bookings
                        </h3>
                        <div className="space-y-3">
                          {comprehensiveUser.bookings
                            .slice(0, 5)
                            .map((booking, index) => (
                              <div
                                key={booking.id}
                                className="p-4 bg-white/5 rounded-lg"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium text-white">
                                      {booking.product.name}
                                    </div>
                                    <div className="text-white/70 text-sm">
                                      {booking.selectedDate &&
                                        new Date(
                                          booking.selectedDate
                                        ).toLocaleDateString()}
                                      {booking.selectedTime &&
                                        ` at ${booking.selectedTime}`}
                                    </div>
                                  </div>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                      booking.status === 'COMPLETED'
                                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                        : booking.status === 'PENDING'
                                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                                    }`}
                                  >
                                    {booking.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                  {/* Service Offerings */}
                  {comprehensiveUser?.services &&
                    comprehensiveUser.services.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Star className="h-5 w-5" />
                          Service Offerings
                        </h3>
                        <div className="space-y-3">
                          {comprehensiveUser.services
                            .slice(0, 5)
                            .map((service, index) => (
                              <div
                                key={service.id}
                                className="p-4 bg-white/5 rounded-lg"
                              >
                                <div className="font-medium text-white">
                                  {service.title}
                                </div>
                                {service.description && (
                                  <div className="text-white/70 text-sm mt-1">
                                    {service.description}
                                  </div>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs">
                                    {service.category}
                                  </span>
                                  <span className="text-white/50 text-xs">
                                    Created:{' '}
                                    {new Date(
                                      service.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                  {/* Upcoming Time Slots */}
                  {comprehensiveUser?.upcomingTimeSlots &&
                    comprehensiveUser.upcomingTimeSlots.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Available Time Slots
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {comprehensiveUser.upcomingTimeSlots
                            .slice(0, 6)
                            .map((slot) => (
                              <div
                                key={slot.id}
                                className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                              >
                                <div className="font-medium text-green-400">
                                  {new Date(slot.date).toLocaleDateString()}
                                </div>
                                <div className="text-white text-sm">
                                  {slot.time} ({slot.duration} min)
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                  {/* Professional Summary - Only show if user has professional data */}
                  {comprehensiveUser?.professionalSummary &&
                    (() => {
                      const hasData =
                        (comprehensiveUser.professionalSummary.languageCount &&
                          comprehensiveUser.professionalSummary.languageCount >
                            0) ||
                        (comprehensiveUser.professionalSummary
                          .astrologySpecialties &&
                          comprehensiveUser.professionalSummary
                            .astrologySpecialties > 0) ||
                        (comprehensiveUser.professionalSummary
                          .coachingSpecialties &&
                          comprehensiveUser.professionalSummary
                            .coachingSpecialties > 0) ||
                        comprehensiveUser.professionalSummary.hasContactInfo ||
                        comprehensiveUser.professionalSummary
                          .hasFinancialInfo ||
                        comprehensiveUser.professionalSummary.offersWebinars ||
                        comprehensiveUser.professionalSummary.offersTalkShow;

                      if (!hasData) return null;

                      return (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Professional Summary
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {comprehensiveUser.professionalSummary
                              .languageCount > 0 && (
                              <div className="p-4 bg-white/5 rounded-lg text-center">
                                <div className="text-2xl font-bold text-blue-400">
                                  {
                                    comprehensiveUser.professionalSummary
                                      .languageCount
                                  }
                                </div>
                                <div className="text-white/70 text-sm">
                                  Languages
                                </div>
                              </div>
                            )}
                            {comprehensiveUser.professionalSummary
                              .astrologySpecialties > 0 && (
                              <div className="p-4 bg-white/5 rounded-lg text-center">
                                <div className="text-2xl font-bold text-purple-400">
                                  {
                                    comprehensiveUser.professionalSummary
                                      .astrologySpecialties
                                  }
                                </div>
                                <div className="text-white/70 text-sm">
                                  Astrology Skills
                                </div>
                              </div>
                            )}
                            {comprehensiveUser.professionalSummary
                              .coachingSpecialties > 0 && (
                              <div className="p-4 bg-white/5 rounded-lg text-center">
                                <div className="text-2xl font-bold text-emerald-400">
                                  {
                                    comprehensiveUser.professionalSummary
                                      .coachingSpecialties
                                  }
                                </div>
                                <div className="text-white/70 text-sm">
                                  Coaching Skills
                                </div>
                              </div>
                            )}
                            {/* {comprehensiveUser.professionalSummary
                              .profileCompleteness > 0 && (
                              <div className="p-4 bg-white/5 rounded-lg text-center">
                                <div className="text-2xl font-bold text-yellow-400">
                                  {
                                    comprehensiveUser.professionalSummary
                                      .profileCompleteness
                                  }
                                  %
                                </div>
                                <div className="text-white/70 text-sm">
                                  Complete
                                </div>
                              </div>
                            )} */}
                          </div>
                          {(comprehensiveUser.professionalSummary
                            .hasContactInfo ||
                            comprehensiveUser.professionalSummary
                              .hasFinancialInfo ||
                            comprehensiveUser.professionalSummary
                              .offersWebinars ||
                            comprehensiveUser.professionalSummary
                              .offersTalkShow) && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {comprehensiveUser.professionalSummary
                                .hasContactInfo && (
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-sm">
                                  Contact Info ✓
                                </span>
                              )}
                              {comprehensiveUser.professionalSummary
                                .hasFinancialInfo && (
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-sm">
                                  Financial Info ✓
                                </span>
                              )}
                              {comprehensiveUser.professionalSummary
                                .offersWebinars && (
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-sm">
                                  Webinars ✓
                                </span>
                              )}
                              {comprehensiveUser.professionalSummary
                                .offersTalkShow && (
                                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-sm">
                                  Talk Show ✓
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                  {/* Additional Information */}
                  {displayUser.dummyPassword && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">
                        Security Notices
                      </h3>
                      <div className="p-5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <span className="text-yellow-400 font-medium">
                            User has a temporary password
                          </span>
                        </div>
                        <div className="text-yellow-200/70 text-sm mt-1">
                          This user may need to reset their password on first
                          login.
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
