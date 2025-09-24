import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, FileText, Loader2 } from 'lucide-react';
import { SessionOrder } from './sessions-table';
import {
  STATUS_COLORS,
  COACHING_CATEGORY_COLORS,
  COACHING_CATEGORY_LABELS,
} from '@/constants/orders';
import { handleFileClick, extractS3Key } from '@/utils/file-utils';

interface SessionDetailSheetProps {
  session: SessionOrder;
  loadingFiles: Set<string>;
  onFileClick: (file: any, index: number) => void;
}

export function SessionDetailSheet({
  session,
  loadingFiles,
  onFileClick,
}: SessionDetailSheetProps) {
  const getStatusColor = (status: string) => {
    return (
      STATUS_COLORS[status as keyof typeof STATUS_COLORS] ||
      'bg-gray-500/20 text-gray-400 border-gray-500/30'
    );
  };

  const getCategoryColor = (category: string) => {
    return (
      COACHING_CATEGORY_COLORS[
        category as keyof typeof COACHING_CATEGORY_COLORS
      ] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    );
  };

  const formatCategoryLabel = (category: string) => {
    return (
      COACHING_CATEGORY_LABELS[
        category as keyof typeof COACHING_CATEGORY_LABELS
      ] || category
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 p-1"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[800px] sm:max-w-[800px] bg-emerald-green border-white/20 p-6">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-white text-xl">
            Session Order Details
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-2">
          <div className="space-y-8 pr-4 pb-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-4 p-6 bg-white/5 rounded-lg">
                  <div className="w-12 h-12 rounded-full border-2 border-white/30 overflow-hidden">
                    {session.user.profilePic ? (
                      <img
                        src={session.user.profilePic}
                        alt={session.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {session.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {session.user.name}
                    </div>
                    <div className="text-sm text-white/70">
                      {session.user.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Session Information
              </h3>
              <div className="p-6 bg-white/5 rounded-lg space-y-4">
                <div>
                  <label className="text-sm text-white/70">Session Title</label>
                  <div className="text-white font-medium">
                    {session.session.title}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-white/70">Description</label>
                  <div className="text-white/90 text-sm">
                    {session.session.description}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-white/70">Duration</label>
                  <div className="text-white">{session.session.duration}</div>
                </div>
                <div>
                  <label className="text-sm text-white/70">Category</label>
                  <div className="mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(session.session.category)}`}
                    >
                      {formatCategoryLabel(session.session.category)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-white/70">Features</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {session.session.features.map(
                      (feature: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white/10 text-white/80 rounded text-xs"
                        >
                          {feature}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Order Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-white/5 rounded-lg">
                  <label className="text-sm text-white/70">Status</label>
                  <div className="mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}
                    >
                      {session.status}
                    </span>
                  </div>
                </div>
                <div className="p-5 bg-white/5 rounded-lg">
                  <label className="text-sm text-white/70">Price</label>
                  <div className="text-white font-medium text-lg">
                    ${session.session.price.toFixed(2)}
                  </div>
                </div>
                <div className="p-5 bg-white/5 rounded-lg">
                  <label className="text-sm text-white/70">Created</label>
                  <div className="text-white">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-5 bg-white/5 rounded-lg">
                  <label className="text-sm text-white/70">Updated</label>
                  <div className="text-white">
                    {new Date(session.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Scheduling Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Scheduling</h3>
              <div className="p-4 bg-white/5 rounded-lg">
                {session.selectedDate ? (
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm text-white/70">Date</label>
                      <div className="text-white">
                        {new Date(session.selectedDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-white/70">Time</label>
                      <div className="text-white">
                        {session.selectedTime} ({session.timezone})
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-white/50">Not scheduled</div>
                )}
                {session.completedAt && (
                  <div className="mt-2">
                    <label className="text-sm text-white/70">
                      Completed At
                    </label>
                    <div className="text-white">
                      {new Date(session.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Material Files */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Material Files
              </h3>
              <div className="p-6 bg-white/5 rounded-lg">
                {session.materialFiles &&
                Array.isArray(session.materialFiles) &&
                session.materialFiles.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-4 w-4 text-white/60" />
                      <span className="text-white font-medium">
                        {session.materialFiles.length} file
                        {session.materialFiles.length !== 1 ? 's' : ''} uploaded
                      </span>
                    </div>
                    <div className="space-y-2">
                      {session.materialFiles.map((file: any, index: number) => {
                        const fileKey = extractS3Key(file);
                        const loadingKey = `${fileKey}-${index}`;
                        const isLoading = loadingFiles.has(loadingKey);

                        return (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-white/5 rounded border border-white/10"
                          >
                            <FileText className="h-4 w-4 text-white/60 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              {typeof file === 'string' ? (
                                <button
                                  onClick={() => onFileClick(file, index)}
                                  disabled={isLoading}
                                  className="text-blue-400 hover:text-blue-300 text-sm break-all text-left disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                  {isLoading && (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  )}
                                  {file.split('/').pop() || `File ${index + 1}`}
                                </button>
                              ) : (
                                <div className="space-y-1">
                                  <div className="text-white text-sm font-medium">
                                    {file.filename ||
                                      file.name ||
                                      `File ${index + 1}`}
                                  </div>
                                  <button
                                    onClick={() => onFileClick(file, index)}
                                    disabled={isLoading}
                                    className="text-blue-400 hover:text-blue-300 text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                  >
                                    {isLoading && (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    )}
                                    {isLoading ? 'Loading...' : 'View File'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-white/50 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    No files uploaded
                  </div>
                )}
              </div>
            </div>

            {/* Provider Information */}
            {session.provider && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Assigned Provider
                </h3>
                <div className="p-6 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full border-2 border-white/30 overflow-hidden">
                      {session.provider.profilePic ? (
                        <img
                          src={session.provider.profilePic}
                          alt={session.provider.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                          {session.provider.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {session.provider.name}
                      </div>
                      <div className="text-sm text-white/70">
                        {session.provider.email}
                      </div>
                      <div className="text-xs text-white/50 capitalize">
                        {session.provider.role.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {session.notes && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Notes</h3>
                <div className="p-5 bg-white/5 rounded-lg">
                  <div className="text-white/90">{session.notes}</div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
