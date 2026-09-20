import classNames from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { formInputclassN, toTitleCase } from '../../utils';
import type { DropdownOption } from '../../types/product';

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
}: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);

  const filteredOptions = useMemo(() => {
    if (!searchable || !query.trim()) return options;

    const lowerQuery = query.toLowerCase();
    return options.filter(option => option?.label?.toLowerCase().includes(lowerQuery));
  }, [options, query, searchable]);

  const filteredLength = filteredOptions.length;

  useEffect(() => {
    if (highlightedIndex >= filteredLength) {
      setHighlightedIndex(0);
    }
  }, [filteredLength, highlightedIndex]);

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
    };
  }, []);

  useEffect(() => {
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
  }, [dropdownOpen, filteredLength]);

  const displayLabel = useMemo(() => {
    if (type === 'Edit Product') return initialOption;
    return toTitleCase(selectedLabel || initialOption);
  }, [initialOption, selectedLabel, type]);

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
                  setHighlightedIndex(prev =>
                    prev - 1 < 0 ? filteredOptions.length - 1 : prev - 1
                  );
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
    </div>
  );
};

export default Dropdown;
