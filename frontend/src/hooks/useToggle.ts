import { useCallback, useState } from 'react';

export interface UseToggleReturn {
  value: boolean;
  toggle: () => void;
  setToggle: (value: boolean) => void;
}

/**
 * Custom hook for managing boolean state with toggle functionality
 *
 * @param initial - Initial boolean value (default: false)
 *
 * @returns {Object} Control utilities
 * @returns {boolean} value - Current state
 * @returns {() => void} toggle - Toggles the state
 * @returns {(value: boolean) => void} setValue - Direct state setter
 *
 * @example
 * const { value, toggle } = useToggle();
 * <button onClick={toggle}>{value ? 'On' : 'Off'}</button>
 */
export function useToggle(initial = false): UseToggleReturn {
  const [value, setToggle] = useState(initial);

  const toggle = useCallback(() => setToggle((v) => !v), []);

  return { value, toggle, setToggle };
}
