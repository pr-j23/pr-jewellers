export interface ImagePreview {
  id?: string;
  file?: File;
  preview?: string;
}

export interface Product {
  id?: string;
  product_id: string;
  name: string;
  description: string;
  images: Array<string | File | ImagePreview>;
  weight: number;
  category: string;
  sub_category: string;
  fixed_price: number;
  metal_type: string;
}

export interface CategoryMeta {
  value: string;
  label: string;
  type: 'parent' | 'child' | 'all';
  parentSlug?: string;
  parentName?: string;
  rawLabel?: string;
}

export interface DropdownOption {
  label: string;
  value: string;
  meta?: CategoryMeta | Record<string, unknown>;
}

export interface DropdownConfig {
  selectedValue?: string | null;
  initialOption?: string | null;
  showAllOption?: boolean;
  blockParentSelectionWithChildren?: boolean;
  hierarchicalData?: CategoryHierarchyData | null;
}

export interface ParentCategoryOption {
  slug: string;
  name: string;
  label?: string;
}

export interface ChildCategoryOption {
  slug: string;
  name: string;
  value: string;
  parentSlug?: string;
  description?: string;
}

export interface HierarchySearchEntry {
  value: string;
  label: string;
  type: CategoryMeta['type'];
  meta: CategoryMeta;
  searchTerms?: string[];
}

export interface CategoryHierarchyData {
  parents: ParentCategoryOption[];
  subCategoryMap: Record<string, ChildCategoryOption[]>;
  searchIndex: HierarchySearchEntry[];
  labelLookup: Record<string, CategoryMeta>;
}
