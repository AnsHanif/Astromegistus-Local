'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Modal from '@/components/common/modal';
import { Plus, X, Edit, Trash2, FileText, ChevronUp, ChevronDown } from 'lucide-react';

interface ProductSection {
  id?: string;
  title: string;
  name?: string; // For charts which use 'name' instead of 'title'
  description?: string;
  order: number;
}

interface ProductSectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  onSubmit: (sections: {
    keyFocusAreas: ProductSection[];
    chartsUsed: ProductSection[];
    includedFeatures: ProductSection[];
  }) => Promise<void>;
  initialData?: {
    keyFocusAreas: ProductSection[];
    chartsUsed: ProductSection[];
    includedFeatures: ProductSection[];
  };
  isLoading?: boolean;
}

const ProductSectionsModal: React.FC<ProductSectionsModalProps> = ({
  isOpen,
  onClose,
  productId,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [keyFocusAreas, setKeyFocusAreas] = useState<ProductSection[]>([]);
  const [chartsUsed, setChartsUsed] = useState<ProductSection[]>([]);
  const [includedFeatures, setIncludedFeatures] = useState<ProductSection[]>([]);
  const [editingItem, setEditingItem] = useState<{
    type: 'keyFocusAreas' | 'chartsUsed' | 'includedFeatures';
    index: number;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});


  useEffect(() => {
    if (initialData) {
      setKeyFocusAreas(initialData.keyFocusAreas || []);
      setChartsUsed(initialData.chartsUsed || []);
      setIncludedFeatures(initialData.includedFeatures || []);
    } else {
      setKeyFocusAreas([]);
      setChartsUsed([]);
      setIncludedFeatures([]);
    }
  }, [initialData, isOpen]);

  const addItem = (type: 'keyFocusAreas' | 'chartsUsed' | 'includedFeatures') => {
    const newItem: ProductSection = {
      title: '',
      description: '',
      order: 0,
    };

    switch (type) {
      case 'keyFocusAreas':
        newItem.order = keyFocusAreas.length;
        setKeyFocusAreas([...keyFocusAreas, newItem]);
        setEditingItem({ type, index: keyFocusAreas.length });
        break;
      case 'chartsUsed':
        newItem.order = chartsUsed.length;
        setChartsUsed([...chartsUsed, newItem]);
        setEditingItem({ type, index: chartsUsed.length });
        break;
      case 'includedFeatures':
        newItem.order = includedFeatures.length;
        setIncludedFeatures([...includedFeatures, newItem]);
        setEditingItem({ type, index: includedFeatures.length });
        break;
    }
  };

  const updateItem = (
    type: 'keyFocusAreas' | 'chartsUsed' | 'includedFeatures',
    index: number,
    field: 'title' | 'description',
    value: string
  ) => {
    switch (type) {
      case 'keyFocusAreas':
        const newKeyFocusAreas = [...keyFocusAreas];
        newKeyFocusAreas[index] = { ...newKeyFocusAreas[index], [field]: value };
        setKeyFocusAreas(newKeyFocusAreas);
        break;
      case 'chartsUsed':
        const newChartsUsed = [...chartsUsed];
        newChartsUsed[index] = { ...newChartsUsed[index], [field]: value };
        setChartsUsed(newChartsUsed);
        break;
      case 'includedFeatures':
        const newIncludedFeatures = [...includedFeatures];
        newIncludedFeatures[index] = { ...newIncludedFeatures[index], [field]: value };
        setIncludedFeatures(newIncludedFeatures);
        break;
    }
  };

  const removeItem = (
    type: 'keyFocusAreas' | 'chartsUsed' | 'includedFeatures',
    index: number
  ) => {
    switch (type) {
      case 'keyFocusAreas':
        const newKeyFocusAreas = keyFocusAreas.filter((_, i) => i !== index);
        setKeyFocusAreas(newKeyFocusAreas.map((item, i) => ({ ...item, order: i })));
        break;
      case 'chartsUsed':
        const newChartsUsed = chartsUsed.filter((_, i) => i !== index);
        setChartsUsed(newChartsUsed.map((item, i) => ({ ...item, order: i })));
        break;
      case 'includedFeatures':
        const newIncludedFeatures = includedFeatures.filter((_, i) => i !== index);
        setIncludedFeatures(newIncludedFeatures.map((item, i) => ({ ...item, order: i })));
        break;
    }
    setEditingItem(null);
  };

  const moveItem = (
    type: 'keyFocusAreas' | 'chartsUsed' | 'includedFeatures',
    index: number,
    direction: 'up' | 'down'
  ) => {
    const items = type === 'keyFocusAreas' ? keyFocusAreas :
                  type === 'chartsUsed' ? chartsUsed : includedFeatures;

    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= items.length) return;

    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];

    // Update order numbers
    const updatedItems = newItems.map((item, i) => ({ ...item, order: i }));

    switch (type) {
      case 'keyFocusAreas':
        setKeyFocusAreas(updatedItems);
        break;
      case 'chartsUsed':
        setChartsUsed(updatedItems);
        break;
      case 'includedFeatures':
        setIncludedFeatures(updatedItems);
        break;
    }
  };

  const handleSubmit = async () => {
    await onSubmit({
      keyFocusAreas: keyFocusAreas.filter(item => item.title.trim()),
      chartsUsed: chartsUsed.filter(item => item.title.trim()),
      includedFeatures: includedFeatures.filter(item => item.title.trim()),
    });
  };

  const renderSection = (
    items: ProductSection[],
    type: 'keyFocusAreas' | 'chartsUsed' | 'includedFeatures',
    title: string
  ) => (
    <div className="space-y-4">
      <div className="flex justify-end">
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

      <div className="space-y-2">
        {items.map((item, index) => (
          <Card key={index} className="bg-emerald-green/10 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-1 mt-2">
                  <Button
                    type="button"
                    onClick={() => moveItem(type, index, 'up')}
                    disabled={index === 0}
                    variant="ghost"
                    className="h-6 w-6 p-0 text-white/50 hover:text-white disabled:opacity-30"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => moveItem(type, index, 'down')}
                    disabled={index === items.length - 1}
                    variant="ghost"
                    className="h-6 w-6 p-0 text-white/50 hover:text-white disabled:opacity-30"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>

                          <div className="flex-1 space-y-3">
                            {editingItem?.type === type && editingItem?.index === index ? (
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-white/90">
                                    {type === 'chartsUsed' ? 'Chart Name' : 'Title'}
                                  </label>
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
                                    placeholder={`Enter ${type === 'chartsUsed' ? 'chart name' : 'title'}...`}
                                    className={`bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 h-8 ${fieldErrors[`${type}-${index}`] ? 'border-red-500/50' : ''}`}
                                    autoFocus
                                  />
                                  {fieldErrors[`${type}-${index}`] && (
                                    <p className="text-red-400 text-xs mt-1">{fieldErrors[`${type}-${index}`]}</p>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-white/90">
                                    Description (Optional)
                                  </label>
                                  <Textarea
                                    value={item.description || ''}
                                    onChange={(e) => updateItem(type, index, 'description', e.target.value)}
                                    placeholder="Enter description..."
                                    rows={2}
                                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 resize-none text-sm"
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
                                          [errorKey]: `Please enter a ${type === 'chartsUsed' ? 'chart name' : 'title'}`
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
                              <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h4 className="text-white font-medium">
                                      {item.title || item.name || 'Untitled'}
                                    </h4>
                                    {item.description && (
                                      <p className="text-white/70 text-sm mt-1">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                  <Button
                                    type="button"
                                    onClick={() => setEditingItem({ type, index })}
                                    variant="ghost"
                                    size="sm"
                                    className="text-white/50 hover:text-white h-6 w-6 p-0"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
              </CardContent>
            </Card>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-white/50">
          No {title.toLowerCase()} added yet. Click "Add" to create one.
        </div>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Product Sections"
      icon={<FileText className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            Key Focus Areas
          </label>
          {renderSection(keyFocusAreas, 'keyFocusAreas', 'Key Focus Areas')}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            Charts Used
          </label>
          {renderSection(chartsUsed, 'chartsUsed', 'Charts Used')}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            What's Included
          </label>
          {renderSection(includedFeatures, 'includedFeatures', "What's Included")}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={onClose}
            variant="default"
            className="flex-1 border border-white/20 text-white hover:bg-white/10 bg-transparent rounded-2xl h-10 min-h-[40px]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black rounded-2xl h-10 min-h-[40px]"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductSectionsModal;