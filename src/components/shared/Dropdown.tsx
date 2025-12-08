import classNames from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { formInputclassN, toTitleCase } from '../../utils';
import type {
  CategoryHierarchyData,
  CategoryMeta,
  DropdownOption,
  HierarchySearchEntry,
} from '../../types/product';

type LabelMeta = CategoryMeta;

export type DropdownProps = {
  options?: DropdownOption[];
  handleSelection: (option: DropdownOption, query?: string) => void;
  initialOption: string;
  disabled?: boolean;
  type?: string;
  searchable?: boolean;
  inputPlaceholder?: string;
  noResultsText?: string;
  autoFocusSearch?: boolean;
  hierarchicalData?: CategoryHierarchyData | null;
  selectedValue?: string | null;
  showAllOption?: boolean;
  blockParentSelectionWithChildren?: boolean;
};

const Dropdown = ({
  options = [],
  handleSelection,
  initialOption,
  disabled = false,
  type,
  searchable = false,
  inputPlaceholder = 'Type to search...',
  noResultsText = 'No Results',
  autoFocusSearch = false,
  hierarchicalData = null,
  selectedValue = null,
  showAllOption = true,
  blockParentSelectionWithChildren = false,
}: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);
  const isHierarchical = Boolean(hierarchicalData);

  const parentOptions = hierarchicalData?.parents || [];
  const subCategoryMap = hierarchicalData?.subCategoryMap || {};
  const hierarchySearchIndex: HierarchySearchEntry[] = hierarchicalData?.searchIndex || [];
  const labelLookup = hierarchicalData?.labelLookup || {};

  const [hoveredParentSlug, setHoveredParentSlug] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hierarchicalSelectedMeta: LabelMeta | null =
    isHierarchical && selectedValue ? labelLookup[selectedValue] || null : null;

  const derivedSelectionParentSlug = useMemo(() => {
    if (!isHierarchical) return '';
    if (hierarchicalSelectedMeta?.type === 'child') return hierarchicalSelectedMeta.parentSlug;
    if (hierarchicalSelectedMeta?.type === 'parent') return hierarchicalSelectedMeta.value;
    return '';
  }, [hierarchicalSelectedMeta, isHierarchical]);

  const activeParentSlug = hoveredParentSlug || derivedSelectionParentSlug;

  const filteredOptions = useMemo(() => {
    if (isHierarchical) return options;
    if (!searchable || !query.trim()) return options;

    const lowerQuery = query.toLowerCase();
    return options.filter(option => option?.label?.toLowerCase().includes(lowerQuery));
  }, [isHierarchical, options, query, searchable]);

  const filteredLength = filteredOptions.length;

  useEffect(() => {
    if (isHierarchical) return;
    if (highlightedIndex >= filteredLength) {
      setHighlightedIndex(0);
    }
  }, [filteredLength, highlightedIndex, isHierarchical]);

  const handleSelectOption = (option: DropdownOption | null, localQuery = '') => {
    if (disabled || !option) return;
    handleSelection(option, localQuery || query);
    setSelectedLabel(option?.label);
    setDropdownOpen(false);
  };

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
    if (isHierarchical) return;
    if (!dropdownOpen) {
      setQuery('');
      setHighlightedIndex(0);
      setIsScrollable(false);
      return;
    }

    const listElement = listRef.current;
    if (!listElement) return;

    const updateScrollableState = () => {
      setIsScrollable(prev => {
        const next = listElement.scrollHeight > listElement.clientHeight;
        return prev === next ? prev : next;
      });
    };

    updateScrollableState();
    listElement.addEventListener('scroll', updateScrollableState);
    window.addEventListener('resize', updateScrollableState);

    return () => {
      listElement.removeEventListener('scroll', updateScrollableState);
      window.removeEventListener('resize', updateScrollableState);
    };
  }, [dropdownOpen, filteredLength, isHierarchical]);

  useEffect(() => {
    if (!isHierarchical) return;
    if (!dropdownOpen) {
      setQuery('');
    }
  }, [dropdownOpen, isHierarchical]);

  useEffect(() => {
    if (!isHierarchical) return;
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
  }, [initialOption, isHierarchical, labelLookup, selectedValue]);

  const hierarchySearchResults = useMemo(() => {
    if (!isHierarchical || !query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return hierarchySearchIndex.filter(entry =>
      entry.searchTerms?.some(term => term.includes(lowerQuery))
    );
  }, [hierarchySearchIndex, isHierarchical, query]);

  const handleHierarchySelection = (meta: LabelMeta | null) => {
    if (!meta) return;
    if (!meta.value) return;

    if (
      isHierarchical &&
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

    handleSelectOption({ value: meta.value, label: formattedLabel, meta });
  };

  const panelParentSlug = hoveredParentSlug || null;
  const activeParent =
    isHierarchical && panelParentSlug
      ? parentOptions.find(parent => parent.slug === panelParentSlug)
      : null;
  const activeChildren =
    isHierarchical && panelParentSlug ? subCategoryMap[panelParentSlug] || [] : [];
  const showSubPanel = Boolean(activeParent && activeChildren.length);

  const displayLabel = useMemo(() => {
    if (type === 'Edit Product') return initialOption;
    if (isHierarchical) return selectedLabel || initialOption;
    return toTitleCase(selectedLabel || initialOption);
  }, [initialOption, isHierarchical, selectedLabel, type]);

  const renderHierarchicalDropdown = () => (
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
  );

  const renderDefaultDropdown = () => (
    <div
      className={`absolute mt-2 bg-white shadow-lg rounded w-full z-10 transition-all duration-300 ease-in-out overflow-hidden ${
        dropdownOpen && !disabled ? 'max-h-72' : 'max-h-0'
      }`}
    >
      {searchable && !disabled && (
        <div className="p-3 border-b border-gray-200 bg-white">
          <input
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setHighlightedIndex(0);
            }}
            onKeyDown={e => {
              if (!filteredOptions.length) return;

              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedIndex(prev => (prev + 1) % filteredOptions.length);
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedIndex(prev => (prev - 1 < 0 ? filteredOptions.length - 1 : prev - 1));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                handleSelectOption(filteredOptions[highlightedIndex]);
              } else if (e.key === 'Escape') {
                e.preventDefault();
                closeDropdown();
              }
            }}
            placeholder={inputPlaceholder}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            autoFocus={autoFocusSearch}
          />
        </div>
      )}
      <ul
        ref={listRef}
        className={classNames('max-h-60 overflow-y-auto', isScrollable && 'pb-4')}
        role="listbox"
      >
        {filteredOptions?.length ? (
          filteredOptions.map((option, index) => {
            const isHighlighted = searchable && index === highlightedIndex;
            return (
              <li
                key={option?.value}
                className={classNames(
                  'px-4 py-2 cursor-pointer hover:bg-gray-200',
                  isHighlighted && 'bg-gray-100'
                )}
                role="option"
                aria-selected={isHighlighted}
                onClick={() => handleSelectOption(option)}
              >
                {option.label}
              </li>
            );
          })
        ) : (
          <li className="px-4 py-3 text-sm text-gray-500 select-none">{noResultsText}</li>
        )}
      </ul>
    </div>
  );

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
      {dropdownOpen &&
        !disabled &&
        (isHierarchical ? renderHierarchicalDropdown() : renderDefaultDropdown())}
    </div>
  );
};

export default Dropdown;
