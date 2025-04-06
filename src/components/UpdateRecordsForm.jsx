import classNames from "classnames";
import React, { useMemo, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { formFields } from "../mockData";
import { toTitleCase } from "../utils";
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
  const [editableFields, setEditableFields] = useState({});
  const toggleEdit = (field) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

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
    if (product && selectedApiType?.label === "Edit Product") {
      return (
        <div className="flex items-center justify-between">
          <span className="text-gray-700">{product[value]}</span>
          <Button
            label={<MdOutlineEdit />}
            onClick={() => toggleEdit(value)}
            classN={classNames(
              "bg-gray-800 text-white hover:text-gray-500 p-2 rounded-full"
            )}
          />
        </div>
      );
    }
    switch (type) {
      case "textarea":
        return (
          <textarea
            required
            placeholder={`Enter ${label}`}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
            value={product[value]}
            onChange={(e) => handleChange(e, value)}
          />
        );

      case "select":
        return (
          <Dropdown
            options={options}
            handleSelection={handleCategoryChange}
            initialOption={initialCategoryValue}
          />
        );

      case "text":
      default:
        return (
          <input
            type={type}
            required
            placeholder={`Enter ${label}`}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={product[value]}
            onChange={(e) => handleChange(e, value)}
          />
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
