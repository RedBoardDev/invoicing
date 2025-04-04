import { MessageContext } from '@contexts/MessageContext';
import { useContext } from 'react';

export const useMessage = () => {
  const messageApi = useContext(MessageContext);
  if (!messageApi) throw new Error('MessageContext not initialized');
  return messageApi;
};
