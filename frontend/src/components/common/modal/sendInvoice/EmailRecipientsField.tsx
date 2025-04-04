import type React from 'react';
import { Form, Input, Button, Typography, Tag, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface EmailRecipientsFieldProps {
  availableEmails: string[];
}

const EmailRecipientsField: React.FC<EmailRecipientsFieldProps> = ({ availableEmails }) => {
  const [form] = Form.useForm(); // Form local pour synchronisation avec le parent

  const handleAddEmail = (email: string, add: (value?: string) => void) => {
    const currentEmails = form.getFieldValue('recipientEmail') || [];
    if (!currentEmails.includes(email)) {
      add(email);
    }
  };

  return (
    <Form.Item
      label="Destinataires"
      name="recipientEmail"
      rules={[
        {
          validator: (_, value: string[]) =>
            value && value.length > 0
              ? Promise.resolve()
              : Promise.reject(new Error('Au moins un destinataire est requis')),
        },
      ]}>
      <Form.List name="recipientEmail">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <Space key={field.key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                <Form.Item
                  {...field}
                  rules={[
                    { required: true, message: 'Email requis' },
                    { type: 'email', message: 'Email invalide' },
                  ]}
                  style={{ marginBottom: 0 }}>
                  <Input placeholder={`Email ${index + 1}`} style={{ width: 300 }} />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(field.name)} />
              </Space>
            ))}
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ width: 300 }}>
                Ajouter un email
              </Button>
              {availableEmails.length > 0 && (
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Emails disponibles :
                  </Text>
                  <Space wrap style={{ marginTop: 4 }}>
                    {availableEmails.map((email) => {
                      const currentEmails = form.getFieldValue('recipientEmail') || [];
                      const isSelected = currentEmails.includes(email);
                      return (
                        <Tag
                          key={email}
                          color={isSelected ? 'blue' : 'default'}
                          style={{ cursor: isSelected ? 'default' : 'pointer' }}
                          onClick={!isSelected ? () => handleAddEmail(email, add) : undefined}>
                          {email}
                        </Tag>
                      );
                    })}
                  </Space>
                </div>
              )}
            </Space>
          </>
        )}
      </Form.List>
    </Form.Item>
  );
};

export default EmailRecipientsField;
