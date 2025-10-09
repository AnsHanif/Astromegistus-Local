'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Modal from '@/components/common/modal';
import { Plus, X, Edit, Trash2, FileText, ChevronUp, ChevronDown } from 'lucide-react';

interface CoachingSection {
  id?: string;
  title: string;
  description?: string;
  order: number;
}

interface CoachingSectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  coachingId: string;
  onSubmit: (sections: {
    keyBenefits: CoachingSection[];
    whatYouWillLearn: CoachingSection[];
    whatsIncluded: CoachingSection[];
  }) => Promise<void>;
  initialData?: {
    keyBenefits: CoachingSection[];
    whatYouWillLearn: CoachingSection[];
    whatsIncluded: CoachingSection[];
  };
  isLoading?: boolean;
}

const CoachingSectionsModal: React.FC<CoachingSectionsModalProps> = ({
  isOpen,
  onClose,
  coachingId,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [keyBenefits, setKeyBenefits] = useState<CoachingSection[]>([]);
  const [whatYouWillLearn, setWhatYouWillLearn] = useState<CoachingSection[]>([]);
  const [whatsIncluded, setWhatsIncluded] = useState<CoachingSection[]>([]);
  const [editingItem, setEditingItem] = useState<{
    type: 'keyBenefits' | 'whatYouWillLearn' | 'whatsIncluded';
    index: number;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (initialData) {
      setKeyBenefits(initialData.keyBenefits || []);
      setWhatYouWillLearn(initialData.whatYouWillLearn || []);
      setWhatsIncluded(initialData.whatsIncluded || []);
    } else {
      setKeyBenefits([]);
      setWhatYouWillLearn([]);
      setWhatsIncluded([]);
    }
  }, [initialData, isOpen]);

  const addItem = (type: 'keyBenefits' | 'whatYouWillLearn' | 'whatsIncluded') => {
    const newItem: CoachingSection = {
      title: '',
      description: '',
      order: 0,
    };

    switch (type) {
      case 'keyBenefits':
        newItem.order = keyBenefits.length;
        setKeyBenefits([...keyBenefits, newItem]);
        setEditingItem({ type, index: keyBenefits.length });
        break;
      case 'whatYouWillLearn':
        newItem.order = whatYouWillLearn.length;
        setWhatYouWillLearn([...whatYouWillLearn, newItem]);
        setEditingItem({ type, index: whatYouWillLearn.length });
        break;
      case 'whatsIncluded':
        newItem.order = whatsIncluded.length;
        setWhatsIncluded([...whatsIncluded, newItem]);
        setEditingItem({ type, index: whatsIncluded.length });
        break;
    }
  };

  const updateItem = (
    type: 'keyBenefits' | 'whatYouWillLearn' | 'whatsIncluded',
    index: number,
    field: 'title' | 'description',
    value: string
  ) => {
    switch (type) {
      case 'keyBenefits':
        const newKeyBenefits = [...keyBenefits];
        newKeyBenefits[index] = { ...newKeyBenefits[index], [field]: value };
        setKeyBenefits(newKeyBenefits);
        break;
      case 'whatYouWillLearn':
        const newWhatYouWillLearn = [...whatYouWillLearn];
        newWhatYouWillLearn[index] = { ...newWhatYouWillLearn[index], [field]: value };
        setWhatYouWillLearn(newWhatYouWillLearn);
        break;
      case 'whatsIncluded':
        const newWhatsIncluded = [...whatsIncluded];
        newWhatsIncluded[index] = { ...newWhatsIncluded[index], [field]: value };
        setWhatsIncluded(newWhatsIncluded);
        break;
    }
  };

  const removeItem = (
    type: 'keyBenefits' | 'whatYouWillLearn' | 'whatsIncluded',
    index: number
  ) => {
    switch (type) {
      case 'keyBenefits':
        const newKeyBenefits = keyBenefits.filter((_, i) => i !== index);
        setKeyBenefits(newKeyBenefits.map((item, i) => ({ ...item, order: i })));
        break;
      case 'whatYouWillLearn':
        const newWhatYouWillLearn = whatYouWillLearn.filter((_, i) => i !== index);
        setWhatYouWillLearn(newWhatYouWillLearn.map((item, i) => ({ ...item, order: i })));
        break;
      case 'whatsIncluded':
        const newWhatsIncluded = whatsIncluded.filter((_, i) => i !== index);
        setWhatsIncluded(newWhatsIncluded.map((item, i) => ({ ...item, order: i })));
        break;
    }
    setEditingItem(null);
  };

  const moveItem = (
    type: 'keyBenefits' | 'whatYouWillLearn' | 'whatsIncluded',
    index: number,
    direction: 'up' | 'down'
  ) => {
    const items = type === 'keyBenefits' ? keyBenefits :
                  type === 'whatYouWillLearn' ? whatYouWillLearn : whatsIncluded;

    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= items.length) return;

    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];

    // Update order numbers
    const updatedItems = newItems.map((item, i) => ({ ...item, order: i }));

    switch (type) {
      case 'keyBenefits':
        setKeyBenefits(updatedItems);
        break;
      case 'whatYouWillLearn':
        setWhatYouWillLearn(updatedItems);
        break;
      case 'whatsIncluded':
        setWhatsIncluded(updatedItems);
        break;
    }
  };

  const handleSubmit = async () => {
    await onSubmit({
      keyBenefits: keyBenefits.filter(item => item.title.trim()),
      whatYouWillLearn: whatYouWillLearn.filter(item => item.title.trim()),
      whatsIncluded: whatsIncluded.filter(item => item.title.trim()),
    });
  };

  const renderSection = (
    items: CoachingSection[],
    type: 'keyBenefits' | 'whatYouWillLearn' | 'whatsIncluded',
    title: string
  ) => (
    <Card className="bg-emerald-green/10 border-white/10">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white text-base font-medium">
            {title}
          </CardTitle>
          <Button
            type="button"
            onClick={() => addItem(type)}
            size="sm"
            className="bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black h-7 px-3"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {items.map((item, index) => (
            <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1 mt-1">
                    <Button
                      type="button"
                      onClick={() => moveItem(type, index, 'up')}
                      disabled={index === 0}
                      variant="ghost"
                      className="h-5 w-5 p-0 text-white/40 hover:text-white/70 disabled:opacity-20"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      onClick={() => moveItem(type, index, 'down')}
                      disabled={index === items.length - 1}
                      variant="ghost"
                      className="h-5 w-5 p-0 text-white/40 hover:text-white/70 disabled:opacity-20"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex-1 space-y-2">
                    {editingItem?.type === type && editingItem?.index === index ? (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-white/80">
                            Title
                          </Label>
                          <Input
                            value={item.title}
                            onChange={(e) => {
                              updateItem(type, index, 'title', e.target.value);
                              const errorKey = `${type}-${index}`;
                              if (fieldErrors[errorKey]) {
                                setFieldErrors(prev => {
                                  const newErrors = { ...prev };
                                  delete newErrors[errorKey];
                                  return newErrors;
                                });
                              }
                            }}
                            placeholder="Enter title..."
                            className={`bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-golden-glow/50 focus:ring-1 focus:ring-golden-glow/20 h-8 text-sm ${fieldErrors[`${type}-${index}`] ? 'border-red-500/50' : ''}`}
                            autoFocus
                          />
                          {fieldErrors[`${type}-${index}`] && (
                            <p className="text-red-400 text-xs mt-1">{fieldErrors[`${type}-${index}`]}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-white/80">
                            Description (Optional)
                          </Label>
                          <Textarea
                            value={item.description || ''}
                            onChange={(e) => updateItem(type, index, 'description', e.target.value)}
                            placeholder="Enter description..."
                            rows={2}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-golden-glow/50 focus:ring-1 focus:ring-golden-glow/20 resize-none text-sm"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <Button
                            type="button"
                            onClick={() => {
                              const errorKey = `${type}-${index}`;
                              if (!item.title.trim()) {
                                setFieldErrors(prev => ({
                                  ...prev,
                                  [errorKey]: 'Please enter a title'
                                }));
                                return;
                              }
                              setFieldErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors[errorKey];
                                return newErrors;
                              });
                              setEditingItem(null);
                            }}
                            size="sm"
                            className="bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black h-7 px-3"
                          >
                            Save
                          </Button>
                          <Button
                            type="button"
                            onClick={() => removeItem(type, index)}
                            variant="destructive"
                            size="sm"
                            className="h-7 w-7 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm font-medium truncate">
                            {item.title || 'Untitled'}
                          </h4>
                          {item.description && (
                            <p className="text-white/60 text-xs mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <Button
                          type="button"
                          onClick={() => setEditingItem({ type, index })}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-white/40 hover:text-white/70 hover:bg-white/10 flex-shrink-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {items.length === 0 && (
            <div className="text-center py-6 text-white/40 text-sm">
              No {title.toLowerCase()} added yet. Click "Add" to create one.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Coaching Sections"
      icon={<FileText className="h-5 w-5" />}
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div className="space-y-4">
          {renderSection(keyBenefits, 'keyBenefits', 'Key Benefits')}
          {renderSection(whatYouWillLearn, 'whatYouWillLearn', 'What You Will Learn')}
          {renderSection(whatsIncluded, 'whatsIncluded', "What's Included")}
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/10 mt-6">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="flex-1 border-white/30 text-white hover:bg-white/5 bg-transparent h-10"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black h-10 font-medium"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CoachingSectionsModal;