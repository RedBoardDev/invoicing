import type { MessageInstance } from "antd/es/message/interface";
import { createContext, useContext } from "react";

export const MessageContext = createContext<MessageInstance | null>(null);

export const useMessage = (): MessageInstance | null => {
  return useContext(MessageContext);
};
