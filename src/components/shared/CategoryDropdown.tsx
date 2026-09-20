import classNames from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { formInputclassN } from '../../utils';
import type {
  CategoryHierarchyData,
  CategoryMeta,
  DropdownOption,
  HierarchySearchEntry,
} from '../../types/product';

type LabelMeta = CategoryMeta;

export type CategoryDropdownProps = {
  hierarchicalData: CategoryHierarchyData;
  handleSelection: (option: DropdownOption, query?: string) => void;
  initialOption: string;
  selectedValue?: string | null;
  showAllOption?: boolean;
  blockParentSelectionWithChildren?: boolean;
  disabled?: boolean;
  noResultsText?: string;
};

const CategoryDropdown = ({
  hierarchicalData,
  handleSelection,
  initialOption,
  selectedValue = null,
  showAllOption = true,
  blockParentSelectionWithChildren = false,
  disabled = false,
  noResultsText = 'No Results',
}: CategoryDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [hoveredParentSlug, setHoveredParentSlug] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const parentOptions = hierarchicalData?.parents || [];
  const subCategoryMap = hierarchicalData?.subCategoryMap || {};
  const hierarchySearchIndex: HierarchySearchEntry[] = hierarchicalData?.searchIndex || [];
  const labelLookup = hierarchicalData?.labelLookup || {};

  const hierarchicalSelectedMeta: LabelMeta | null = selectedValue
    ? labelLookup[selectedValue] || null
    : null;

  const derivedSelectionParentSlug = useMemo(() => {
    if (hierarchicalSelectedMeta?.type === 'child') return hierarchicalSelectedMeta.parentSlug;
    if (hierarchicalSelectedMeta?.type === 'parent') return hierarchicalSelectedMeta.value;
    return '';
  }, [hierarchicalSelectedMeta]);

  const activeParentSlug = hoveredParentSlug || derivedSelectionParentSlug;

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!dropdownOpen) {
      setQuery('');
    }
  }, [dropdownOpen]);

  useEffect(() => {
    if (!selectedValue) {
      setSelectedLabel(initialOption);
      return;
    }

    const meta = labelLookup[selectedValue];
    if (!meta) {
      setSelectedLabel(initialOption);
      return;
    }

    if (meta.type === 'child') {
      setSelectedLabel(`${meta.parentName} › ${meta.rawLabel}`);
    } else {
      setSelectedLabel(meta.label);
    }
  }, [initialOption, labelLookup, selectedValue]);

  const hierarchySearchResults = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return hierarchySearchIndex.filter(entry =>
      entry.searchTerms?.some(term => term.includes(lowerQuery))
    );
  }, [hierarchySearchIndex, query]);

  const handleHierarchySelection = (meta: LabelMeta | null) => {
    if (!meta?.value) return;

    if (
      blockParentSelectionWithChildren &&
      meta.type === 'parent' &&
      (subCategoryMap[meta.value] || []).length
    ) {
      setHoveredParentSlug(meta.value);
      setQuery('');
      return;
    }

    const formattedLabel =
      meta.type === 'child'
        ? `${meta.parentName ?? meta.label} › ${meta.rawLabel ?? meta.label}`
        : meta.label || meta.rawLabel || meta.value;

    handleSelection({ value: meta.value, label: formattedLabel, meta }, query);
    setSelectedLabel(formattedLabel);
    setDropdownOpen(false);
  };

  const panelParentSlug = hoveredParentSlug || null;
  const activeParent = panelParentSlug
    ? parentOptions.find(parent => parent.slug === panelParentSlug)
    : null;
  const activeChildren = panelParentSlug ? subCategoryMap[panelParentSlug] || [] : [];
  const showSubPanel = Boolean(activeParent && activeChildren.length);

  const displayLabel = selectedLabel || initialOption;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) setDropdownOpen(prev => !prev);
        }}
        className={classNames(
          'flex items-center justify-between',
          formInputclassN.common,
          disabled ? formInputclassN.inactive : formInputclassN.active
        )}
      >
        <span>{displayLabel}</span>
        <span className="ml-2">{dropdownOpen ? <FaCaretUp /> : <FaCaretDown />}</span>
      </button>

      {dropdownOpen && !disabled && (
        <div
          className="absolute left-0 mt-2 bg-white shadow-2xl rounded-lg z-20 border border-gray-100 w-full min-w-[16rem] overflow-visible"
          onMouseLeave={() => {
            hoverTimeoutRef.current = setTimeout(() => setHoveredParentSlug(null), 100);
          }}
        >
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search categories"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
          </div>
          {query ? (
            <ul className="max-h-64 overflow-y-auto">
              {hierarchySearchResults.length ? (
                hierarchySearchResults.map(result => (
                  <li
                    key={result.value}
                    className="px-4 py-3 text-sm cursor-pointer hover:bg-gray-100"
                    onClick={() => handleHierarchySelection(result.meta)}
                  >
                    <p className="font-medium text-gray-800">{result.label}</p>
                    {result.type === 'child' && result.meta.parentName && (
                      <p className="text-xs text-gray-500">{result.meta.parentName}</p>
                    )}
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 text-sm text-gray-500">{noResultsText}</li>
              )}
            </ul>
          ) : (
            <div className="relative">
              <ul
                className="min-w-[12rem] max-h-64 overflow-y-auto divide-y divide-gray-100"
                onMouseEnter={() => {
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current);
                    hoverTimeoutRef.current = null;
                  }
                }}
              >
                {showAllOption && labelLookup?.all && (
                  <li
                    key="all-products"
                    className="px-4 py-3 text-sm cursor-pointer hover:bg-gray-50"
                    onClick={() => handleHierarchySelection(labelLookup.all)}
                  >
                    All Products
                  </li>
                )}
                {parentOptions.map(parent => {
                  const hasChildren = (subCategoryMap[parent.slug] || []).length > 0;
                  const isActive = parent.slug === activeParentSlug;
                  const parentSelectable = !(blockParentSelectionWithChildren && hasChildren);
                  return (
                    <li
                      key={parent.slug}
                      className={classNames(
                        'px-4 py-3 text-sm cursor-pointer transition-colors flex items-center justify-between gap-2',
                        isActive ? 'bg-purple-50 text-purple-700 font-semibold' : 'hover:bg-gray-50'
                      )}
                      onMouseEnter={() => setHoveredParentSlug(parent.slug)}
                      onFocus={() => setHoveredParentSlug(parent.slug)}
                      onClick={() =>
                        parentSelectable &&
                        parent.slug &&
                        handleHierarchySelection(labelLookup[parent.slug])
                      }
                    >
                      <span>{parent.name}</span>
                      {hasChildren && <span className="text-xs text-purple-600">›</span>}
                    </li>
                  );
                })}
              </ul>
              {showSubPanel && (
                <div
                  className="absolute top-0 left-full z-30 ml-2 w-56 bg-white border border-gray-100 rounded-lg shadow-xl p-3"
                  onMouseEnter={() => {
                    if (hoverTimeoutRef.current) {
                      clearTimeout(hoverTimeoutRef.current);
                      hoverTimeoutRef.current = null;
                    }
                  }}
                  onMouseLeave={() => {
                    hoverTimeoutRef.current = setTimeout(() => setHoveredParentSlug(null), 150);
                  }}
                >
                  <p className="text-xs uppercase text-gray-400 mb-2">{activeParent?.name}</p>
                  <ul className="space-y-1 max-h-64 overflow-y-auto">
                    {activeChildren.map(child => (
                      <li key={child.slug}>
                        <button
                          type="button"
                          onClick={() =>
                            child.slug && handleHierarchySelection(labelLookup[child.slug])
                          }
                          className="w-full text-left text-sm px-3 py-2 rounded hover:bg-gray-100"
                        >
                          {child.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
