import {
  categories,
  sortOptions,
  metalTypeFilterOptions,
  topLevelCategories,
  subCategoryMap,
  categorySearchIndex,
  categorySlugLookup,
} from '../../utils/mockData';
import type { CategoryHierarchyData } from '../../types/product';
import type { SortType } from '../../hooks/useProducts';
import Dropdown from '../shared/Dropdown';
import type { DropdownOption } from '../../types/product';

type ProductFilterProps = {
  selectedCategory: string;
  selectedSort: SortType;
  selectedMetalType: string;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: SortType) => void;
  onMetalTypeChange: (value: string) => void;
};

const ProductFilter = ({
  selectedCategory,
  selectedSort,
  selectedMetalType,
  onCategoryChange,
  onSortChange,
  onMetalTypeChange,
}: ProductFilterProps) => {
  const categoryLabel = (() => {
    if (!selectedCategory || selectedCategory === 'all') return 'All Products';
    const meta = categorySlugLookup[selectedCategory];
    if (!meta) return 'All Products';
    return meta.type === 'child' ? `${meta.parentName} › ${meta.rawLabel}` : meta.label;
  })();

  const hierarchicalCategoryData: CategoryHierarchyData = {
    parents: topLevelCategories,
    subCategoryMap,
    searchIndex: categorySearchIndex,
    labelLookup: categorySlugLookup,
  };

const dropdowns: Array<{
  label: string;
  id: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  initialOption: string;
  searchable?: boolean;
  hierarchicalData?: CategoryHierarchyData | null;
  selectedValue?: string | null;
}> = [
    {
      label: 'Category',
      id: 'category',
      value: selectedCategory,
      options: categories.map<DropdownOption>(cat => ({
        value: cat.slug,
        label: cat.name,
      })),
      onChange: onCategoryChange,
      initialOption: categoryLabel,
      searchable: false,
      hierarchicalData: hierarchicalCategoryData,
      selectedValue: selectedCategory,
    },
    {
      label: 'Metal Type',
      id: 'metal-type',
      value: selectedMetalType,
      options: metalTypeFilterOptions,
      onChange: onMetalTypeChange,
      initialOption: 'All Metals',
    },
    {
      label: 'Sort By',
      id: 'sort',
      value: selectedSort,
      options: sortOptions,
      onChange: (value: string) => onSortChange(value as SortType),
      initialOption: 'Default',
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 sm:grid-cols-3 lg:flex lg:justify-center gap-6">
      {dropdowns.map(
        ({
          label,
          id,
          value,
          options,
          onChange,
          initialOption,
          searchable: dropdownSearchable,
          hierarchicalData,
          selectedValue,
        }) => (
          <div key={id} className="flex flex-col gap-2 w-full sm:max-w-52 lg:min-w-48">
            <label htmlFor={id} className="font-semibold text-gray-700 text-sm">
              {label}
            </label>
            <Dropdown
              options={options}
              handleSelection={option => onChange?.(option.value)}
              initialOption={
                hierarchicalData
                  ? initialOption
                  : options.find(opt => opt.value === value)?.label || initialOption
              }
              searchable={hierarchicalData ? false : dropdownSearchable ?? false}
              hierarchicalData={hierarchicalData}
              selectedValue={hierarchicalData ? selectedValue ?? null : null}
            />
          </div>
        )
      )}
    </div>
  );
};

export default ProductFilter;
