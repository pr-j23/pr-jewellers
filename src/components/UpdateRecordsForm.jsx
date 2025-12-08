import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { MdOutlineCancel, MdOutlineEdit } from 'react-icons/md';
import { formFields } from '../mockData';
import { formInputclassN, toTitleCase } from '../utils';
import Button from './shared/Button';
import Dropdown from './shared/Dropdown';
import ImageUploader from './shared/ImageUploader';

function UpdateRecordsForm({
  handleSubmit,
  handleChange,
  isFormValid,
  isSubmitting,
  previewImages,
  setPreviewImages,
  product,
  setProduct,
  handleCategoryChange,
  handleMetalTypeChange,
  selectedApiType,
  editableProductDetails,
  setImagesToDelete,
  categoryDropdownConfig = null,
  errors = {},
  touched = {},
  onBlurField = null,
}) {
  const [editableField, setEditableField] = useState(null);

  const buttonLabel = useMemo(() => {
    if (isSubmitting) return 'Saving...';

    switch (selectedApiType) {
      case 'Edit Product':
        return 'Save Changes';
      case 'Add Product':
        return 'Add Product';
      default:
        return 'Submit';
    }
  }, [isSubmitting, selectedApiType]);

  const initialCategoryValue = useMemo(() => {
    if (categoryDropdownConfig?.initialOption) {
      return categoryDropdownConfig.initialOption;
    }
    if (selectedApiType === 'Edit Product') {
      return toTitleCase(product.category);
    }

    return 'Select Category';
  }, [categoryDropdownConfig?.initialOption, selectedApiType, product.category]);

  const initialMetalTypeValue = useMemo(() => {
    if (selectedApiType === 'Edit Product') {
      return toTitleCase(product.metal_type);
    }
    return 'Select Metal Type';
  }, [selectedApiType, product.metal_type]);

  const renderField = (type, label, value, options) => {
    const isGlobalEditMode = selectedApiType === 'Edit Product';
    const isFieldEditable = editableField === value;
    const fieldError = errors?.[value];
    const isTouched = touched?.[value];
    const subCategoryErrorVisible =
      value === 'category' &&
      errors?.sub_category &&
      (touched?.sub_category || selectedApiType === 'Add Product');
    const showError = Boolean(fieldError && (isTouched || selectedApiType === 'Add Product'));

    const renderEditButton = () =>
      isGlobalEditMode && (
        <div className="flex gap-2 items-center">
          <Button
            label={<MdOutlineEdit />}
            onClick={() => setEditableField(value)}
            classN={classNames('bg-gray-800 text-white hover:text-gray-500 p-2 rounded-full')}
            isDisabled={isFieldEditable}
          />
          <Button
            label={<MdOutlineCancel className="h-8 w-8" />}
            onClick={() => {
              setProduct(prev => ({
                ...prev,
                [value]: editableProductDetails[value],
              }));
              setEditableField(null);
            }}
            classN={classNames('text-red-500 hover:text-red-800')}
            isDisabled={!isFieldEditable}
          />
        </div>
      );

    switch (type) {
      case 'textarea':
        return (
          <div className="flex flex-col">
            <textarea
              required
              placeholder={`Enter ${label}`}
              className={classNames(
                formInputclassN.common,
                !isFieldEditable && isGlobalEditMode
                  ? formInputclassN.inactive
                  : formInputclassN.active
              )}
              rows="3"
              value={product[value]}
              onChange={e => handleChange(e, value)}
              onBlur={onBlurField ? () => onBlurField(value) : undefined}
              disabled={!isFieldEditable && isGlobalEditMode}
            />
            {renderEditButton()}
            {showError && <p className="text-sm text-red-600 mt-1">{fieldError}</p>}
          </div>
        );

      case 'select':
        return (
          <div className="flex flex-col">
            <Dropdown
              options={options}
              handleSelection={value === 'category' ? handleCategoryChange : handleMetalTypeChange}
              initialOption={value === 'category' ? initialCategoryValue : initialMetalTypeValue}
              disabled={!isFieldEditable && isGlobalEditMode}
              type={selectedApiType}
              searchable={value === 'category' && !categoryDropdownConfig?.hierarchicalData}
              hierarchicalData={value === 'category' ? categoryDropdownConfig?.hierarchicalData : null}
              selectedValue={value === 'category' ? categoryDropdownConfig?.selectedValue : undefined}
              showAllOption={value === 'category' ? categoryDropdownConfig?.showAllOption !== false : true}
              blockParentSelectionWithChildren={
                value === 'category' ? categoryDropdownConfig?.blockParentSelectionWithChildren : false
              }
            />
            {renderEditButton()}
            {showError && <p className="text-sm text-red-600 mt-1">{fieldError}</p>}
            {subCategoryErrorVisible && (
              <p className="text-sm text-red-600 mt-1">{errors.sub_category}</p>
            )}
          </div>
        );

      case 'text':
      default:
        return (
          <div className="flex flex-col">
            <input
              type={type}
              required
              placeholder={`Enter ${label}`}
              className={classNames(
                formInputclassN.common,
                !isFieldEditable && isGlobalEditMode
                  ? formInputclassN.inactive
                  : formInputclassN.active
              )}
              value={product[value]}
              onChange={e => handleChange(e, value)}
              onBlur={onBlurField ? () => onBlurField(value) : undefined}
              disabled={!isFieldEditable && isGlobalEditMode}
            />
            {renderEditButton()}
            {showError && <p className="text-sm text-red-600 mt-1">{fieldError}</p>}
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full sm:w-[60%] lg:w-[45%]">
      {formFields?.map(({ label, value, type, options }) => (
        <div key={value} className="grid grid-cols-2 items-baseline">
          <label className="block text-gray-700 font-bold mb-2">{label}</label>
          {renderField(type, label, value, options)}
        </div>
      ))}
      <ImageUploader
        previewImages={previewImages}
        setPreviewImages={setPreviewImages}
        setProduct={setProduct}
        setImagesToDelete={setImagesToDelete}
      />
      {errors?.images && (touched?.images || selectedApiType === 'Add Product') && (
        <p className="text-sm text-red-600 -mt-2">{errors.images}</p>
      )}
      <div className="w-full flex justify-end">
        <Button
          label={buttonLabel}
          isDisabled={isSubmitting || (selectedApiType === 'Add Product' && !isFormValid)} // Disable button during submission or invalid form
          classN={classNames(
            'w-full sm:w-fit my-4 bg-purple-600 transition-colors text-white font-bold py-2 px-4 rounded-md',
            isFormValid && 'hover:bg-purple-700',
            isSubmitting && 'opacity-50 cursor-not-allowed'
          )}
          buttonType="submit"
        />
      </div>
    </form>
  );
}

export default UpdateRecordsForm;
