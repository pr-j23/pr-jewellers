import classNames from 'classnames';
import { useMemo } from 'react';
import ProductCard from '../components/products/ProductCard';
import Button from '../components/shared/Button';
import Dropdown from '../components/shared/Dropdown';
import UpdateRecordsForm from '../components/UpdateRecordsForm';
import {
  apiType,
  categorySearchIndex,
  categorySlugLookup,
  subCategoryMap,
  topLevelCategories,
} from '../mockData';
import { ProductFormLabel, ProductFormMode } from '../constants/product';
import { useProductForm } from '../hooks';

const hierarchicalCategoryData = {
  parents: topLevelCategories,
  subCategoryMap,
  searchIndex: categorySearchIndex,
  labelLookup: categorySlugLookup,
};

export default function AddProduct() {
  const {
    state: {
      product,
      previewImages,
      selectedApiType,
      selectedApiTypeValue,
      notAvailable,
      isSubmitting,
      imagesToDelete,
      healthCheck,
      categoryDropdownConfig,
    },
    actions: { setPreviewImages, setImagesToDelete, setProduct },
    handlers: {
      handleSubmit,
      handleChange,
      handleCategoryChange,
      handleMetalTypeChange,
      handleHealthClick,
      handleApiTypeDropdownSelection,
    },
    utils: { isFormValid, validationErrors, touched, handleFieldBlur },
    editableProductDetails,
    user,
    navigate,
  } = useProductForm();

  const categoryConfig = useMemo(
    () => ({
      ...categoryDropdownConfig,
      hierarchicalData: hierarchicalCategoryData,
    }),
    [categoryDropdownConfig]
  );

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  return (
    <div className="w-full px-4 py-8">
      <div className="mb-8 flex gap-4 items-center">
        <div className="text-xl font-serif font-semibold underline">Update Data</div>
        <Button
          label={healthCheck?.isLoading ? 'Loading' : 'Health Check'}
          classN={classNames(
            'w-fit my-4 transition-colors text-white font-bold py-2 px-4 rounded-md',
            healthCheck?.data?.status && 'bg-green-600',
            healthCheck?.error && 'bg-red-600',
            !healthCheck?.data?.status && !healthCheck?.error && 'bg-gray-300'
          )}
          onClick={handleHealthClick}
        />
      </div>
      <div className="w-44 mb-4">
        <Dropdown
          options={apiType}
          handleSelection={handleApiTypeDropdownSelection}
          initialOption={
            editableProductDetails
              ? ProductFormLabel[ProductFormMode.EDIT]
              : 'Select'
          }
        />
      </div>
      {((selectedApiTypeValue === ProductFormMode.EDIT && editableProductDetails) ||
        selectedApiTypeValue === ProductFormMode.ADD) && (
        <div className="w-full flex flex-col sm:flex-row gap-12">
          <UpdateRecordsForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            isFormValid={isFormValid}
            isSubmitting={isSubmitting}
            previewImages={previewImages}
            setPreviewImages={setPreviewImages}
            product={product}
            setProduct={setProduct}
            handleCategoryChange={handleCategoryChange}
            handleMetalTypeChange={handleMetalTypeChange}
            selectedApiTypeLabel={selectedApiType?.label}
            selectedApiTypeValue={selectedApiTypeValue}
            editableProductDetails={editableProductDetails}
            setImagesToDelete={setImagesToDelete}
            categoryDropdownConfig={categoryConfig}
            errors={validationErrors}
            touched={touched}
            onBlurField={handleFieldBlur}
          />
          {previewImages?.length > 0 && (
            <div className="w-[85%] sm:w-[25%]">
              <div className="text-xl font-bold mb-4">Product Preview</div>
              <ProductCard
                product={{
                  ...product,
                  images: previewImages,
                }}
                type={selectedApiType?.value}
              />
            </div>
          )}
        </div>
      )}
      {notAvailable && <div>Not available</div>}
    </div>
  );
}
