import { useCallback, useState } from "react";

export interface UseDisclosureReturn {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	onOpenChange: () => void;
}

/**
 * A custom hook for managing disclosure states (open/closed).
 * Commonly used for modals, drawers, dropdowns, etc.
 *
 * @param initial - Initial state of the disclosure (default: false)
 *
 * @returns {Object} Disclosure utils
 * @returns {boolean} isOpen - Current state
 * @returns {() => void} onOpen - Function to open
 * @returns {() => void} onClose - Function to close
 * @returns {() => void} onOpenChange - Function to toggle state
 *
 * @example
 * ```tsx
 * const { isOpen, onOpen, onClose } = useDisclosure();
 *
 * return (
 *   <>
 *     <Button onClick={onOpen}>Open Modal</Button>
 *     <Modal open={isOpen} onClose={onClose}>
 *       Content
 *     </Modal>
 *   </>
 * );
 * ```
 */
export function useDisclosure(initial = false): UseDisclosureReturn {
	const [isOpen, setIsOpen] = useState(initial);

	const onOpen = useCallback(() => setIsOpen(true), []);
	const onClose = useCallback(() => setIsOpen(false), []);
	const onOpenChange = useCallback(() => setIsOpen((prev) => !prev), []);

	return { isOpen, onOpen, onClose, onOpenChange };
}
