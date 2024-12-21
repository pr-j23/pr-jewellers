import { useEffect } from 'react';

/**
 * A custom hook to detect clicks outside of a specified element.
 *
 * @param {RefObject} ref - The reference to the element to detect clicks outside of.
 * @param {Function} callback - The callback to be executed when a click occurs outside the element.
 */
function useOutsideClick(ref, callback) {
  useEffect(() => {
    /**
     * Handles the click event.
     *
     * @param {MouseEvent} event - The mouse event.
     */
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [ref, callback]);
}

export default useOutsideClick;
