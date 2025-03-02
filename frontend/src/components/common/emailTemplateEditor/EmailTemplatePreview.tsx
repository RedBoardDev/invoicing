import type React from 'react';
import { Typography } from 'antd';
import { EMAIL_VARIABLES_METADATA } from '@enums/emailVariables';
import styles from './styles.module.css';

const { Text } = Typography;

interface EmailTemplatePreviewProps {
  subject: string;
  content: string;
}

export const EmailTemplatePreview: React.FC<EmailTemplatePreviewProps> = ({ subject, content }) => {
  const renderPreview = (text: string): React.ReactNode => {
    const lines = text.split('\n');
    const result: React.ReactNode[] = [];

    lines.forEach((line, lineIndex) => {
      const regex = /\{\{(\w+)\}\}/g;
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null = null;

      while (true) {
        match = regex.exec(line);
        if (match === null) break;
        const variable = match[1] as keyof typeof EMAIL_VARIABLES_METADATA;
        const metadata = EMAIL_VARIABLES_METADATA[variable];

        if (match.index > lastIndex) {
          parts.push(line.slice(lastIndex, match.index));
        }

        parts.push(
          metadata ? (
            <span key={`${lineIndex}-${match.index}`} className={styles.previewVariable}>
              {metadata.example}
            </span>
          ) : (
            <span key={`${lineIndex}-${match.index}`} className={styles.previewUnknown}>
              {`{{${variable}}}`}
            </span>
          ),
        );
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < line.length) {
        parts.push(line.slice(lastIndex));
      }

      result.push(
        <div key={`${lineIndex}-${line}`} className={styles.previewLine}>
          {parts.length > 0 ? parts : line}
        </div>,
      );
    });

    return result;
  };

  return (
    <div className={styles.previewPanel}>
      <Text strong className={styles.previewTitle}>
        Aperçu
      </Text>
      <div className={styles.preview}>
        <Text strong>Sujet :</Text>
        <div className={styles.previewText}>{renderPreview(subject)}</div>
        <Text strong>Contenu :</Text>
        <div className={styles.previewText}>{renderPreview(content)}</div>
      </div>
    </div>
  );
};
