import classNames from "classnames";
import React, { useMemo, useState } from "react";
import { MdOutlineCancel, MdOutlineEdit } from "react-icons/md";
import { formFields } from "../mockData";
import { formInputclassN, toTitleCase } from "../utils";
import Button from "./shared/Button";
import Dropdown from "./shared/Dropdown";
import ImageUploader from "./shared/ImageUploader";

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
  selectedApiType,
}) {
  const [editableField, setEditableField] = useState(null);

  const buttonLabel = useMemo(() => {
    if (isSubmitting) return "Saving...";

    switch (selectedApiType) {
      case "Edit Product":
        return "Save Changes";
      case "Add Product":
        return "Add Product";
      default:
        return "Submit";
    }
  }, [isSubmitting, selectedApiType]);

  const initialCategoryValue = useMemo(() => {
    if (selectedApiType === "Edit Product") {
      return toTitleCase(product.category);
    }

    return "Select Category";
  }, [selectedApiType]);

  const renderField = (type, label, value, options) => {
    const isGlobalEditMode = selectedApiType === "Edit Product";
    const isFieldEditable = editableField === value;

    const renderEditButton = () =>
      isGlobalEditMode && (
        <div className="flex gap-2 items-center">
          <Button
            label={<MdOutlineEdit />}
            onClick={() => setEditableField(value)}
            classN={classNames(
              "bg-gray-800 text-white hover:text-gray-500 p-2 rounded-full"
            )}
            isDisabled={isFieldEditable}
          />
          <Button
            label={<MdOutlineCancel className="h-8 w-8" />}
            onClick={() => setEditableField(null)}
            classN={classNames("text-red-500 hover:text-red-800")}
            isDisabled={!isFieldEditable}
          />
        </div>
      );

    switch (type) {
      case "textarea":
        return (
          <div className="flex items-center gap-2">
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
              onChange={(e) => handleChange(e, value)}
              disabled={!isFieldEditable && isGlobalEditMode}
            />
            {renderEditButton()}
          </div>
        );

      case "select":
        return (
          <div className="flex items-center gap-2">
            <Dropdown
              options={options}
              handleSelection={handleCategoryChange}
              initialOption={initialCategoryValue}
              disabled={!isFieldEditable && isGlobalEditMode}
            />
            {renderEditButton()}
          </div>
        );

      case "text":
      default:
        return (
          <div className="flex items-center gap-2">
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
              onChange={(e) => handleChange(e, value)}
              disabled={!isFieldEditable && isGlobalEditMode}
            />
            {renderEditButton()}
          </div>
        );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full sm:w-[60%] lg:w-[45%]"
    >
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
      />
      <div className="w-full flex justify-end">
        <Button
          label={buttonLabel}
          isDisabled={isSubmitting || !isFormValid()} // Disable button during submission or invalid form
          classN={classNames(
            "w-full sm:w-fit my-4 bg-purple-600 transition-colors text-white font-bold py-2 px-4 rounded-md",
            isFormValid() && "hover:bg-purple-700",
            isSubmitting && "opacity-50 cursor-not-allowed"
          )}
          buttonType="submit"
        />
      </div>
    </form>
  );
}

export default UpdateRecordsForm;
