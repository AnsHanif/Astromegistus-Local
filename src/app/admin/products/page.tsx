'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/common/search-bar/search-bar';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import ConfirmationModal from '@/components/common/confirmation-modal';
import ProductFormModal from '@/components/common/product-form-modal';
import ProductSectionsModal from '@/components/common/product-sections-modal';
import { Plus, Edit, Trash2, Package, Loader2, X, FileText } from 'lucide-react';
import {
  useCreateProduct,
  useCreateProductWithImage,
  useUpdateProduct,
  useUpdateProductWithImage,
  useDeleteProduct,
  useEnableProduct,
  useDisableProduct,
} from '@/hooks/mutation/admin-mutation/admin-mutations';
import { useAdminProducts as useAdminProductsQuery } from '@/hooks/query/admin-queries';
import { useUpdateProductSections, useGetProductSections } from '@/hooks/mutation/product-sections-mutations';
import { s3ImageAPI } from '@/services/api/s3-image-api';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [page, setPage] = useState(1);
  const limit = 6;
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] =
    useState(false);
  const [isSectionsModalOpen, setIsSectionsModalOpen] = useState(false);
  const [selectedProductForSections, setSelectedProductForSections] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<{
    id: string;
    name: string;
    description: string;
    productType?: 'READING' | 'LIVE_SESSIONS' | 'BOTH';
    automatedPrice?: number;
    livePrice: number;
    categories: (
      | 'CORE_INTEGRATIVE'
      | 'NATAL_READING'
      | 'PREDICTIVE'
      | 'CAREER'
      | 'HORARY'
      | 'SYNASTRY'
      | 'ASTROCARTOGRAPHY'
      | 'ELECTIONAL'
      | 'SOLAR_RETURN'
      | 'DRACONIC_NATAL_OVERLAY'
      | 'NATAL'
    )[];
    duration: string;
    imageUrl: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  } | null>(null);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [togglingProductId, setTogglingProductId] = useState<string | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filterStatus, filterType, debouncedSearchTerm]);

  // React Query hooks
  const queryParams = {
    page,
    limit,
    search: debouncedSearchTerm,
    status:
      filterStatus === 'All'
        ? undefined
        : (filterStatus as 'Active' | 'Inactive'),
    category:
      filterType === 'All'
        ? undefined
        : (filterType as
            | 'CHART_READING'
            | 'LIVE_READING'
            | 'COACHING_SESSION'
            | 'ASTROLOGY_COURSE'
            | 'CONSULTATION'
            | 'OTHER'),
  };

  console.log('Query params being sent to API:', queryParams);

  const {
    data: productsResponse,
    isLoading,
    error,
  } = useAdminProductsQuery({
    page,
    limit,
    search: debouncedSearchTerm,
    status:
      filterStatus === 'All'
        ? undefined
        : (filterStatus as 'Active' | 'Inactive'),
    category:
      filterType === 'All'
        ? undefined
        : (filterType as
            | 'CORE_INTEGRATIVE'
            | 'NATAL_READING'
            | 'PREDICTIVE'
            | 'CAREER'
            | 'HORARY'
            | 'SYNASTRY'
            | 'ASTROCARTOGRAPHY'
            | 'ELECTIONAL'
            | 'SOLAR_RETURN'
            | 'DRACONIC_NATAL_OVERLAY'
            | 'NATAL'),
  });
  const createProductMutation = useCreateProduct();
  const createProductWithImageMutation = useCreateProductWithImage();
  const updateProductMutation = useUpdateProduct();
  const updateProductWithImageMutation = useUpdateProductWithImage();
  const deleteProductMutation = useDeleteProduct();
  const enableProductMutation = useEnableProduct();
  const disableProductMutation = useDisableProduct();
  const updateProductSectionsMutation = useUpdateProductSections();

  // Get product sections data for the selected product
  const {
    data: productSectionsData,
    isLoading: sectionsLoading,
    error: sectionsError
  } = useGetProductSections(selectedProductForSections || '');

  // Extract products array from response, handle different response structures
  const rawProducts = Array.isArray(productsResponse)
    ? productsResponse
    : (productsResponse as any)?.data?.data?.products &&
        Array.isArray((productsResponse as any).data.data.products)
      ? (productsResponse as any).data.data.products
      : [];

  const pagination = (productsResponse as any)?.data?.data?.pagination;

  // Transform products to ensure pricing fields are properly mapped
  const products: {
    id: string;
    name: string;
    description: string;
    productType?: 'READING' | 'LIVE_SESSIONS' | 'BOTH';
    automatedPrice?: number;
    livePrice: number;
    categories: (
      | 'CORE_INTEGRATIVE'
      | 'NATAL_READING'
      | 'PREDICTIVE'
      | 'CAREER'
      | 'HORARY'
      | 'SYNASTRY'
      | 'ASTROCARTOGRAPHY'
      | 'ELECTIONAL'
      | 'SOLAR_RETURN'
      | 'DRACONIC_NATAL_OVERLAY'
      | 'NATAL'
    )[];
    duration: string;
    imageUrl: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }[] = rawProducts.map((product: any) => {
    // Extract prices from pricing object if it exists
    const automatedPrice = typeof product.automatedPrice === 'number'
      ? product.automatedPrice
      : (typeof product.pricing?.automated === 'object'
          ? product.pricing.automated.originalPrice
          : product.pricing?.automated);

    const livePrice = typeof product.livePrice === 'number'
      ? product.livePrice
      : (typeof product.pricing?.live === 'object'
          ? product.pricing.live.originalPrice
          : product.pricing?.live ?? 0);

    return {
      ...product,
      automatedPrice,
      livePrice,
    };
  });

  console.log('Products response:', productsResponse);
  console.log('Processed products array:', products);
  console.log('Filter status:', filterStatus);
  console.log('Filter type:', filterType);
  console.log('Search term:', debouncedSearchTerm);

  // Server-side filtering is now handled by the API, but add client-side fallback for status
  const filteredProducts = products.filter((product) => {
    // Client-side status filtering as fallback
    const matchesStatus =
      filterStatus === 'All' ||
      (product.isActive ? 'Active' : 'Inactive') === filterStatus;
    return matchesStatus;
  });

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CORE_INTEGRATIVE':
        return 'bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black';
      case 'NATAL_READING':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'PREDICTIVE':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'CAREER':
        return 'bg-emerald-green text-white';
      case 'HORARY':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'SYNASTRY':
        return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'ASTROCARTOGRAPHY':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'ELECTIONAL':
        return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
      case 'SOLAR_RETURN':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'DRACONIC_NATAL_OVERLAY':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'NATAL':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getProductTypePill = (
    productType?: 'READING' | 'LIVE_SESSIONS' | 'BOTH'
  ) => {
    if (!productType) return null;
    const label =
      productType === 'READING'
        ? 'Reading'
        : productType === 'LIVE_SESSIONS'
          ? 'Live Sessions'
          : 'Both';
    const pillClass =
      productType === 'READING'
        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
        : productType === 'LIVE_SESSIONS'
          ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
          : 'bg-teal-500/20 text-teal-300 border-teal-500/30';

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${pillClass}`}
      >
        {label}
      </span>
    );
  };

  const handleAddProduct = async (
    productData: {
      name: string;
      description: string;
      productType?: 'READING' | 'LIVE_SESSIONS' | 'BOTH';
      automatedPrice?: number;
      livePrice: number;
      categories: (
        | 'CORE_INTEGRATIVE'
        | 'NATAL_READING'
        | 'PREDICTIVE'
        | 'CAREER'
        | 'HORARY'
        | 'SYNASTRY'
        | 'ASTROCARTOGRAPHY'
        | 'ELECTIONAL'
        | 'SOLAR_RETURN'
        | 'DRACONIC_NATAL_OVERLAY'
        | 'NATAL'
      )[];
      duration: string;
      imageUrl: string;
      isActive: boolean;
    },
    imageFile?: File | null
  ) => {
    try {
      // If there's an image file, use the multipart form data mutation
      if (imageFile) {
        await createProductWithImageMutation.mutateAsync({
          name: productData.name,
          description: productData.description,
          productType: productData.productType,
          automatedPrice: productData.automatedPrice,
          livePrice: productData.livePrice,
          categories: productData.categories,
          duration: productData.duration,
          image: imageFile,
          isActive: productData.isActive,
        });
      } else {
        // No image, use regular mutation
        await createProductMutation.mutateAsync(productData);
      }

      // Clear pending image file
      setPendingImageFile(null);
      setIsAddProductModalOpen(false);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleEditProduct = (product: {
    id: string;
    name: string;
    description: string;
    automatedPrice?: number;
    livePrice: number;
    categories: (
      | 'CORE_INTEGRATIVE'
      | 'NATAL_READING'
      | 'PREDICTIVE'
      | 'CAREER'
      | 'HORARY'
      | 'SYNASTRY'
      | 'ASTROCARTOGRAPHY'
      | 'ELECTIONAL'
      | 'SOLAR_RETURN'
      | 'DRACONIC_NATAL_OVERLAY'
      | 'NATAL'
    )[];
    duration: string;
    imageUrl: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }) => {
    if (product && product.id) {
      setEditingProduct(product);
      setIsEditProductModalOpen(true);
    }
  };

  const handleUpdateProduct = async (
    productData: {
      name: string;
      description: string;
      productType?: 'READING' | 'LIVE_SESSIONS' | 'BOTH';
      automatedPrice?: number;
      livePrice: number;
      categories: (
        | 'CORE_INTEGRATIVE'
        | 'NATAL_READING'
        | 'PREDICTIVE'
        | 'CAREER'
        | 'HORARY'
        | 'SYNASTRY'
        | 'ASTROCARTOGRAPHY'
        | 'ELECTIONAL'
        | 'SOLAR_RETURN'
        | 'DRACONIC_NATAL_OVERLAY'
        | 'NATAL'
      )[];
      duration: string;
      imageUrl: string;
      isActive?: boolean;
    },
    imageFile?: File | null
  ) => {
    if (editingProduct) {
      try {
        // If there's an image file, use the multipart form data mutation
        if (imageFile) {
          await updateProductWithImageMutation.mutateAsync({
            id: editingProduct.id,
            data: {
              name: productData.name,
              description: productData.description,
              productType: productData.productType,
              automatedPrice: productData.automatedPrice,
              livePrice: productData.livePrice,
              categories: productData.categories,
              duration: productData.duration,
              image: imageFile,
              isActive: productData.isActive,
            },
          });
        } else {
          // No image, use regular mutation
          // Filter out null/empty values to avoid backend validation errors
          const cleanData = Object.fromEntries(
            Object.entries(productData).filter(([_, value]) => {
              if (value === null || value === undefined) return false;
              if (typeof value === 'string' && value.trim() === '')
                return false;
              return true;
            })
          );

          await updateProductMutation.mutateAsync({
            id: editingProduct.id,
            data: cleanData,
          });
        }

        setIsEditProductModalOpen(false);
        setEditingProduct(null);
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };

  const handleDeleteProduct = (product: { id: string; name: string }) => {
    setProductToDelete(product);
    setIsDeleteProductModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await deleteProductMutation.mutateAsync(productToDelete.id);
        setIsDeleteProductModalOpen(false);
        setProductToDelete(null);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEnableProduct = (product: { id: string; name: string }) => {
    setTogglingProductId(product.id);
    enableProductMutation.mutate(product.id, {
      onSettled: () => setTogglingProductId(null)
    });
  };

  const handleDisableProduct = (product: { id: string; name: string }) => {
    setTogglingProductId(product.id);
    disableProductMutation.mutate(product.id, {
      onSettled: () => setTogglingProductId(null)
    });
  };

  const handleManageSections = (productId: string) => {
    setSelectedProductForSections(productId);
    setIsSectionsModalOpen(true);
  };

  const handleSectionsSubmit = async (sections: any) => {
    if (!selectedProductForSections) return;

    try {
      await updateProductSectionsMutation.mutateAsync({
        productId: selectedProductForSections,
        sections,
      });
      setIsSectionsModalOpen(false);
      setSelectedProductForSections(null);
    } catch (error) {
      console.error('Error saving sections:', error);
    }
  };

  const handleDeleteProductImage = async (
    productId: string,
    imageUrl?: string
  ) => {
    try {
      // Use smart delete function that handles both key and ID deletion
      await s3ImageAPI.smartDeleteProductImage(productId, imageUrl);
      console.log('Product image deleted successfully');

      // Update the product to remove the image URL
      await updateProductMutation.mutateAsync({
        id: productId,
        data: { imageUrl: '' },
      });
    } catch (error) {
      console.error('Error deleting product image:', error);
    }
  };
  console.log('filteredProducts', filteredProducts);
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Product Management</h1>
          <p className="text-white/70 mt-2 text-sm sm:text-base">
            Manage astrology readings and services
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            className="bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark hover:from-golden-glow-dark hover:via-golden-glow hover:to-pink-shade text-black font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
            onClick={() => setIsAddProductModalOpen(true)}
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="text-sm sm:text-base">Add Product</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-emerald-green/10 border-white/10">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search products..."
                value={searchTerm}
                onSearch={setSearchTerm}
                className="[&_input]:bg-white/5 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-white/50 [&_svg]:text-white/50 [&_input]:focus:border-white/40 [&_input]:focus:ring-0 [&_input]:focus:outline-none [&_input]:rounded-lg [&_input]:h-10 sm:[&_input]:h-12"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* <CustomSelect
                options={[
                  { label: 'All Status', value: 'All' },
                  { label: 'Active', value: 'Active' },
                  { label: 'Inactive', value: 'Inactive' },
                ]}
                selectedValue={filterStatus}
                onSelect={setFilterStatus}
                placeholder="All Status"
                variant="large"
                triggerClassName="bg-white/5 border-white/20 text-white hover:bg-white/10 focus:border-white/40 focus:ring-0 focus:outline-none h-10 sm:h-12 min-h-[40px] sm:min-h-[48px] rounded-lg min-w-[120px] sm:min-w-[140px] w-full sm:w-auto"
                contentClassName="bg-emerald-green border-white/20 shadow-lg rounded-lg"
                itemClassName="text-white hover:bg-white/10 focus:bg-white/10"
              /> */}
              <CustomSelect
                options={[
                  { label: 'All Types', value: 'All' },
                  { label: 'Core / Integrative', value: 'CORE_INTEGRATIVE' },
                  { label: 'Natal Reading', value: 'NATAL_READING' },
                  { label: 'Predictive', value: 'PREDICTIVE' },
                  { label: 'Career', value: 'CAREER' },
                  { label: 'Horary', value: 'HORARY' },
                  { label: 'Synastry', value: 'SYNASTRY' },
                  { label: 'Astrocartography', value: 'ASTROCARTOGRAPHY' },
                  { label: 'Electional', value: 'ELECTIONAL' },
                  { label: 'Solar Return', value: 'SOLAR_RETURN' },
                  {
                    label: 'Draconic + Natal Overlay',
                    value: 'DRACONIC_NATAL_OVERLAY',
                  },
                  { label: 'Natal', value: 'NATAL' },
                ]}
                selectedValue={filterType}
                onSelect={setFilterType}
                placeholder="All Types"
                variant="large"
                maxHeight="max-h-56 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                triggerClassName="bg-white/5 border-white/20 text-white hover:bg-white/10 focus:border-white/40 focus:ring-0 focus:outline-none h-10 sm:h-12 min-h-[40px] sm:min-h-[48px] rounded-lg min-w-[120px] sm:min-w-[140px] w-full sm:w-auto"
                contentClassName="bg-emerald-green border-white/20 shadow-lg rounded-lg"
                itemClassName="text-white hover:bg-white/10 focus:bg-white/10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-white/70">
            <Loader2 className="h-6 w-6 animate-spin" />
            Loading products...
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-red-400">
            Error loading products. Please try again.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map(
            (product) => (
              console.log('product', product.imageUrl),
              (
                <Card
                  key={product.id}
                  className="bg-emerald-green/10 border-white/10 hover:bg-emerald-green/20 transition-colors h-full flex flex-col"
                >
                  {/* Product Image - Top of card */}
                  <div className="w-full h-40 bg-gradient-to-br from-golden-glow/20 to-pink-shade/20 flex items-center justify-center rounded-t-lg relative">
                    {product.imageUrl ? (
                      <>
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-t-lg"
                          onError={(e) => {
                            // If image fails, show dummy
                            e.currentTarget.style.display = 'none';
                            const nextSibling = e.currentTarget
                              .nextElementSibling as HTMLElement;
                            if (nextSibling) {
                              nextSibling.style.display = 'flex';
                            }
                          }}
                        />

                      </>
                    ) : null}
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        product.imageUrl ? 'hidden' : 'flex'
                      }`}
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-2 bg-white/10 rounded-full flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-white/50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            ></path>
                          </svg>
                        </div>
                        <p className="text-white/70 text-sm">No Image</p>
                      </div>
                    </div>
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-white text-lg mb-3 line-clamp-2 leading-tight">
                          {product.name}
                        </CardTitle>
                        
                        {/* Categories and Product Type Section */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0 mr-3">
                            <div className="text-xs text-white/50 mb-1">Categories</div>
                            <div className="flex flex-wrap gap-1">
                              {product.categories.map((category, index) => (
                                <span
                                  key={index}
                                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                                    category
                                  )}`}
                                >
                                  {category.replace('_', ' ')}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="text-xs text-white/50 mb-1">Type</div>
                            {getProductTypePill(product.productType)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-white/70 text-sm mb-4 line-clamp-3 flex-shrink-0">
                      {product.description}
                    </p>

                    <div className="space-y-2 mb-4 flex-shrink-0">
                      {typeof product.automatedPrice === 'number' &&
                        product.automatedPrice > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-white/50 text-sm">
                              Automated
                            </span>
                            <span className="text-white font-semibold">
                              ${product.automatedPrice}
                            </span>
                          </div>
                        )}

                      {typeof product.livePrice === 'number' &&
                        product.livePrice > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-white/50 text-sm">Live</span>
                            <span className="text-white font-semibold">
                              ${product.livePrice}
                            </span>
                          </div>
                        )}

                      <div className="flex justify-between items-center">
                        <span className="text-white/50 text-sm">Duration</span>
                        <span className="text-white text-sm">
                          {product.duration}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-white/50 text-sm">Created</span>
                        <span className="text-white text-sm">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 border border-white/20 text-white hover:bg-white/10 bg-transparent h-8"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 bg-transparent h-8 px-3"
                        onClick={() => handleManageSections(product.id)}
                        title="Manage Detail Page Sections"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Detail Page
                      </Button>
                      {/* {product.isActive ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 bg-transparent h-8 px-2"
                          onClick={() => handleDisableProduct(product)}
                          disabled={togglingProductId === product.id}
                          title="Disable Product"
                        >
                          {togglingProductId === product.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <span className="text-xs">Disable</span>
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="border border-green-500/30 text-green-400 hover:bg-green-500/10 bg-transparent h-8 px-2"
                          onClick={() => handleEnableProduct(product)}
                          disabled={togglingProductId === product.id}
                          title="Enable Product"
                        >
                          {togglingProductId === product.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <span className="text-xs">Enable</span>
                          )}
                        </Button>
                      )} */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="border border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent h-8 w-8 p-0"
                        onClick={() => handleDeleteProduct(product)}
                        disabled={deleteProductMutation.isPending}
                        title="Delete Product"
                      >
                        {deleteProductMutation.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            )
          )}
        </div>
      )}

      {filteredProducts.length === 0 && (
        <Card className="bg-emerald-green/10 border-white/10">
          <CardContent className="p-12 text-center">
            <div className="text-white/50 mb-4">
              <Package className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-sm">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <Card className="bg-emerald-green/10 border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t border-white/10 bg-gradient-to-r from-emerald-green/5 to-emerald-green/10">
            <div className="text-xs sm:text-sm text-white/70 font-medium text-center sm:text-left">
              Showing{' '}
              <span className="text-white font-semibold">
                {(page - 1) * limit + 1}
              </span>{' '}
              to{' '}
              <span className="text-white font-semibold">
                {Math.min(page * limit, pagination.total)}
              </span>{' '}
              of{' '}
              <span className="text-white font-semibold">{pagination.total}</span>{' '}
              results
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="!h-8 sm:!h-10 bg-white/5 border-white/20 text-white hover:bg-white/15 hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg px-2 sm:px-4 py-1 sm:py-2 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </Button>

              <div className="hidden sm:flex items-center gap-1 mx-2">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let pageNumber;
                  if (pagination.pages <= 5) {
                    pageNumber = i + 1;
                  } else if (page <= 3) {
                    pageNumber = i + 1;
                  } else if (page >= pagination.pages - 2) {
                    pageNumber = pagination.pages - 4 + i;
                  } else {
                    pageNumber = page - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant="ghost"
                      size="sm"
                      onClick={() => setPage(pageNumber)}
                      className={
                        page === pageNumber
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg border border-emerald-400/50 rounded-lg min-w-[40px] h-10 hover:from-emerald-600 hover:to-emerald-700'
                          : 'bg-white/5 border border-white/20 text-white hover:bg-white/15 hover:border-white/30 rounded-lg min-w-[40px] h-10 transition-all duration-200'
                      }
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>

              {/* Mobile page indicator */}
              <div className="sm:hidden mx-2 text-xs text-white/70">
                {page} / {pagination.pages}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.pages}
                className="!h-8 sm:!h-10 bg-white/5 border-white/20 text-white hover:bg-white/15 hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg px-2 sm:px-4 py-1 sm:py-2 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Add Product Modal */}
      <ProductFormModal
        isOpen={isAddProductModalOpen}
        onClose={() => {
          setIsAddProductModalOpen(false);
          setPendingImageFile(null);
        }}
        onSubmit={handleAddProduct}
        onImageFileChange={setPendingImageFile}
        title="Add New Product"
        mode="add"
        isLoading={
          createProductMutation.isPending ||
          createProductWithImageMutation.isPending
        }
      />

      {/* Edit Product Modal */}
      <ProductFormModal
        isOpen={isEditProductModalOpen && !!editingProduct}
        onClose={() => {
          setIsEditProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleUpdateProduct}
        title="Edit Product"
        mode="edit"
        initialData={editingProduct || undefined}
        isLoading={
          updateProductMutation.isPending ||
          updateProductWithImageMutation.isPending
        }
      />

      {/* Delete Product Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteProductModalOpen}
        onClose={() => {
          setIsDeleteProductModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDeleteProduct}
        title="Delete Product"
        message="Are you sure you want to delete"
        confirmText="Delete Product"
        cancelText="Cancel"
        isLoading={deleteProductMutation.isPending}
        variant="delete"
        itemName={productToDelete?.name}
      />

      {/* Product Sections Modal */}
      <ProductSectionsModal
        isOpen={isSectionsModalOpen}
        onClose={() => {
          setIsSectionsModalOpen(false);
          setSelectedProductForSections(null);
        }}
        productId={selectedProductForSections || ''}
        onSubmit={handleSectionsSubmit}
        initialData={productSectionsData}
        isLoading={updateProductSectionsMutation.isPending || sectionsLoading}
      />
    </div>
  );
}
