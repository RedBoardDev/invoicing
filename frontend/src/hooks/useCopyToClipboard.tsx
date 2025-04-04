import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useCallback, useState } from 'react';

type CopyToClipboardOptions = {
  successDuration?: number;
  errorDuration?: number;
  successMessage?: string;
  errorMessage?: string;
  unsupportedMessage?: string;
};

/**
 * A custom hook for copying text to the clipboard with success and error handling.
 *
 * @param {Object} [options] - Optional configuration for the hook.
 * @param {number} [options.successDuration=3] - Duration (in seconds) for which the success message is displayed.
 * @param {number} [options.errorDuration=5] - Duration (in seconds) for which the error message is displayed.
 * @param {string} [options.successMessage="Copied to clipboard"] - Message displayed on successful copy.
 * @param {string} [options.errorMessage="Failed to copy"] - Message displayed on copy failure.
 * @param {string} [options.unsupportedMessage="Clipboard API not supported"] - Message displayed when Clipboard API is not supported.
 *
 * @returns {Object} Clipboard utils
 * @returns {boolean} isCopied - Indicates if the text was successfully copied.
 * @returns {Error | null} error - Error object if the copy operation failed.
 * @returns {(text: string) => Promise<boolean>} copy - Function to copy the provided text to the clipboard.
 *
 * @example
 * ```tsx
 * const { isCopied, error, copy } = useCopyToClipboard();
 *
 * const handleCopy = async () => {
 *   const success = await copy("Hello, world!");
 *   if (success) {
 *     console.log("Text copied successfully!");
 *   } else {
 *     console.error("Failed to copy text:", error);
 *   }
 * };
 *
 * return (
 *   <Button onClick={handleCopy}>
 *     {isCopied ? "Copied!" : "Copy Text"}
 *   </Button>
 * );
 * ```
 */
export const useCopyToClipboard = (options?: CopyToClipboardOptions) => {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    successDuration = 3,
    errorDuration = 5,
    successMessage = 'Copied to clipboard',
    errorMessage = 'Failed to copy',
    unsupportedMessage = 'Clipboard API not supported',
  } = options || {};

  const copy = useCallback(
    async (text: string) => {
      try {
        if (!navigator?.clipboard) {
          throw new Error(unsupportedMessage);
        }

        await navigator.clipboard.writeText(text);

        message.success({
          content: successMessage,
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
          duration: successDuration,
        });

        setIsCopied(true);
        setError(null);

        setTimeout(() => setIsCopied(false), successDuration * 1000);

        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');

        message.error({
          content: errorMessage,
          icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
          duration: errorDuration,
        });

        setError(error);
        setIsCopied(false);

        return false;
      }
    },
    [successDuration, errorDuration, successMessage, errorMessage, unsupportedMessage],
  );

  return {
    isCopied,
    error,
    copy,
  };
};
