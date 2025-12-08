import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { MdOutlineCancel, MdOutlineEdit } from 'react-icons/md';
import { formFields } from '../utils/mockData';
import { formInputclassN, toTitleCase } from '../utils';
import { ProductFormMode, ProductFormLabel } from '../utils/productConstants';
import Button from './shared/Button';
import Dropdown, { type DropdownProps } from './shared/Dropdown';
import ImageUploader from './shared/ImageUploader';
import type { DropdownOption, DropdownConfig, ImagePreview, Product } from '../types/product';

export type CategoryDropdownConfig = DropdownConfig & {
  hierarchicalData?: DropdownProps['hierarchicalData'];
};

type ProductFormModeValue = (typeof ProductFormMode)[keyof typeof ProductFormMode];

type UpdateRecordsFormProps = {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Product
  ) => void;
  isFormValid: boolean;
  isSubmitting: boolean;
  previewImages: Array<string | ImagePreview>;
  setPreviewImages: React.Dispatch<React.SetStateAction<Array<string | ImagePreview>>>;
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
  handleCategoryChange: (option: DropdownOption) => void;
  handleMetalTypeChange: (option: DropdownOption) => void;
  selectedApiTypeLabel?: string | null;
  selectedApiTypeValue: ProductFormModeValue;
  editableProductDetails: Product | null;
  setImagesToDelete: React.Dispatch<React.SetStateAction<string[]>>;
  categoryDropdownConfig?: CategoryDropdownConfig | null;
  errors?: Record<string, string>;
  touched?: Record<string, boolean>;
  onBlurField?: (field: keyof Product) => void;
};

type FormField = (typeof formFields)[number];

const UpdateRecordsForm = ({
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
  selectedApiTypeLabel = null,
  selectedApiTypeValue,
  editableProductDetails,
  setImagesToDelete,
  categoryDropdownConfig = null,
  errors = {},
  touched = {},
  onBlurField,
}: UpdateRecordsFormProps) => {
  const [editableField, setEditableField] = useState<keyof Product | null>(null);

  const buttonLabel = useMemo(() => {
    if (isSubmitting) return 'Saving...';

    switch (selectedApiTypeValue) {
      case ProductFormMode.EDIT:
        return 'Save Changes';
      case ProductFormMode.ADD:
        return ProductFormLabel[ProductFormMode.ADD];
      default:
        return 'Submit';
    }
  }, [isSubmitting, selectedApiTypeValue]);

  const initialCategoryValue = useMemo(() => {
    if (categoryDropdownConfig?.initialOption) {
      return categoryDropdownConfig.initialOption ?? 'Select Category';
    }
    if (selectedApiTypeValue === ProductFormMode.EDIT) {
      return toTitleCase(product.category) ?? 'Select Category';
    }

    return 'Select Category';
  }, [categoryDropdownConfig?.initialOption, selectedApiTypeValue, product.category]);

  const initialMetalTypeValue = useMemo(() => {
    if (selectedApiTypeValue === ProductFormMode.EDIT) {
      return toTitleCase(product.metal_type) ?? 'Select Metal Type';
    }
    return 'Select Metal Type';
  }, [selectedApiTypeValue, product.metal_type]);

  const renderEditButton = (field: keyof Product, isFieldEditable: boolean) => {
    if (selectedApiTypeValue !== ProductFormMode.EDIT) return null;
    return (
      <div className="flex gap-2 items-center">
        <Button
          label={<MdOutlineEdit />}
          onClick={() => setEditableField(field)}
          classN={classNames('bg-gray-800 text-white hover:text-gray-500 p-2 rounded-full')}
          isDisabled={isFieldEditable}
        />
        <Button
          label={<MdOutlineCancel className="h-8 w-8" />}
          onClick={() => {
            if (!editableProductDetails) return;
            setProduct(prev => ({
              ...prev,
              [field]: editableProductDetails[field],
            }));
            setEditableField(null);
          }}
          classN={classNames('text-red-500 hover:text-red-800')}
          isDisabled={!isFieldEditable}
        />
      </div>
    );
  };

  const renderField = (field: FormField) => {
    const { type, label, value, options } = field;
    const key = value as keyof Product;
    const isGlobalEditMode = selectedApiTypeValue === ProductFormMode.EDIT;
    const isFieldEditable = editableField === key;
    const fieldError = errors?.[value];
    const isTouched = touched?.[value];
    const subCategoryErrorVisible =
      value === 'category' &&
      errors?.sub_category &&
      (touched?.sub_category || selectedApiTypeValue === ProductFormMode.ADD);
    const showError = Boolean(
      fieldError && (isTouched || selectedApiTypeValue === ProductFormMode.ADD)
    );
    const blurHandlers = onBlurField
      ? {
          onBlur: () => onBlurField(key),
        }
      : {};

    if (type === 'textarea') {
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
            rows={3}
            value={(product[key] as string) || ''}
            onChange={e => handleChange(e, key)}
            disabled={!isFieldEditable && isGlobalEditMode}
            {...blurHandlers}
          />
          {renderEditButton(key, isFieldEditable)}
          {showError && <p className="text-sm text-red-600 mt-1">{fieldError}</p>}
        </div>
      );
    }

    if (type === 'select') {
      return (
        <div className="flex flex-col">
          <Dropdown
            options={(options as DropdownOption[]) || []}
            handleSelection={value === 'category' ? handleCategoryChange : handleMetalTypeChange}
            initialOption={value === 'category' ? initialCategoryValue : initialMetalTypeValue}
            disabled={!isFieldEditable && isGlobalEditMode}
            {...(selectedApiTypeLabel ? { type: selectedApiTypeLabel } : {})}
            searchable={value === 'category' && !categoryDropdownConfig?.hierarchicalData}
            hierarchicalData={
              value === 'category' ? (categoryDropdownConfig?.hierarchicalData ?? null) : null
            }
            selectedValue={
              value === 'category' ? categoryDropdownConfig?.selectedValue || null : null
            }
            showAllOption={
              value === 'category' ? categoryDropdownConfig?.showAllOption !== false : true
            }
            blockParentSelectionWithChildren={
              value === 'category'
                ? (categoryDropdownConfig?.blockParentSelectionWithChildren ?? false)
                : false
            }
          />
          {renderEditButton(key, isFieldEditable)}
          {showError && <p className="text-sm text-red-600 mt-1">{fieldError}</p>}
          {subCategoryErrorVisible && (
            <p className="text-sm text-red-600 mt-1">{errors.sub_category}</p>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        <input
          type={type}
          required
          placeholder={`Enter ${label}`}
          className={classNames(
            formInputclassN.common,
            !isFieldEditable && isGlobalEditMode ? formInputclassN.inactive : formInputclassN.active
          )}
          value={product[key] as string | number}
          onChange={e => handleChange(e, key)}
          disabled={!isFieldEditable && isGlobalEditMode}
          {...blurHandlers}
        />
        {renderEditButton(key, isFieldEditable)}
        {showError && <p className="text-sm text-red-600 mt-1">{fieldError}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full sm:w-[60%] lg:w-[45%]">
      {formFields?.map(field => (
        <div key={field.value} className="grid grid-cols-2 items-baseline">
          <label className="block text-gray-700 font-bold mb-2">{field.label}</label>
          {renderField(field)}
        </div>
      ))}
      <ImageUploader
        previewImages={previewImages}
        setPreviewImages={setPreviewImages}
        setProduct={setProduct}
        setImagesToDelete={setImagesToDelete}
      />
      {errors?.images && (touched?.images || selectedApiTypeValue === ProductFormMode.ADD) && (
        <p className="text-sm text-red-600 -mt-2">{errors.images}</p>
      )}
      <div className="w-full flex justify-end">
        <Button
          label={buttonLabel}
          isDisabled={
            isSubmitting || (selectedApiTypeValue === ProductFormMode.ADD && !isFormValid)
          }
          classN={classNames(
            'w-full sm:w-fit my-4 bg-purple-600 transition-colors text-white font-bold py-2 px-4 rounded-md',
            isFormValid && 'hover:bg-purple-700',
            isSubmitting && 'opacity-50 cursor-not-allowed'
          )}
          buttonType="submit"
          onClick={() => {}}
        />
      </div>
    </form>
  );
};

export default UpdateRecordsForm;
