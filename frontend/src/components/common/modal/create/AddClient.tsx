import { Form, Input, Button } from 'antd';
import { AddModal } from 'components/common/modal/create/component/AddModal';
import type React from 'react';
import type Client from '@interfaces/client';
import { createClient } from '@api/services/clients';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

interface AddClientProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
}

const AddClient: React.FC<AddClientProps> = ({ visible, setVisible, onSuccess }) => {
  return (
    <AddModal<Client>
      visible={visible}
      onCancel={() => setVisible(false)}
      onSuccess={() => {
        setVisible(false);
        onSuccess();
      }}
      title="Nouveau client"
      createService={(data) => createClient(data as { name: string; email: string[] })}
      initialValues={{ email: [''] }}
    >
      {() => (
        <>
          <Form.Item
            name="name"
            label="Nom du client"
            rules={[{ required: true, message: 'Ce champ est obligatoire' }]}>
            <Input placeholder="Nom de l'entreprise" />
          </Form.Item>

          <Form.List
            name="email"
            rules={[
              {
                validator: async (_, emails) => {
                  if (!emails || emails.length === 0) {
                    return Promise.reject(new Error('Au moins un email est requis'));
                  }
                },
              },
            ]}>
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item label={index === 0 ? 'Email(s) du client' : ''} required={false} key={field.key}>
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        { required: true, message: '' },
                        { type: 'email', message: 'Veuillez entrer un email valide' },
                      ]}
                      noStyle>
                      <Input
                        placeholder={index === 0 ? 'email par défaut' : 'email supplémentaire'}
                        style={{ width: '90%' }}
                      />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined style={{ marginLeft: 8 }} onClick={() => remove(field.name)} />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} style={{ width: '90%' }} icon={<PlusOutlined />}>
                    Ajouter un email
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </>
      )}
    </AddModal>
  );
};

export default AddClient;
