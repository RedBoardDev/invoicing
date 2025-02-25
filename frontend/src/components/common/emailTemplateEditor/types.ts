import type { InputRef } from 'antd';
import type React from 'react';

export interface EmailTemplate {
  id?: string;
  name: string;
  subject: string;
  content: string;
}

export interface EmailTemplateModalProps {
  visible: boolean;
  template: EmailTemplate | null;
  onClose: () => void;
  onSuccess: () => void;
}

export interface CursorPositions {
  subject: number;
  content: number;
}

export interface FormRefs {
  subjectRef: React.RefObject<InputRef | null>;
  contentRef: React.RefObject<InputRef | null>;
}
