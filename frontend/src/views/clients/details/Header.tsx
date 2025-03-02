// frontend/src/views/clients/details/Header.tsx
import { MailOutlined } from '@ant-design/icons';
import { updateClient } from '@api/services/clients';
import { ROUTE_PATHS } from '@config/routePaths';
import type Client from '@interfaces/client';
import { Flex, Typography, Input, Button, Form } from 'antd';
import AddContract from 'components/common/modal/create/AddContract';
import HeaderDetailsLayout from 'components/layouts/headerDetails/HeaderDetails';
import type { FieldConfig } from 'components/layouts/headerDetails/types';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { WithExtends } from '@api/types/extends';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

interface HeaderProps {
  client: WithExtends<Client, 'contracts' | 'permissions'> | null;
  onEditSuccess: (updatedClient: WithExtends<Client, 'contracts' | 'permissions'>) => void;
  onDelete: () => void;
  refresh: () => void;
  permissions?: { canBeDeleted: boolean; canBeUpdated: Record<string, boolean> };
}

const { Text } = Typography;

const fields: FieldConfig<WithExtends<Client, 'contracts' | 'permissions'>>[] = [
  {
    key: 'name',
    label: 'Nom',
    render: (data) => (
      <Text strong style={{ fontSize: 16 }}>
        {data.name}
      </Text>
    ),
    editConfig: {
      rules: [{ required: true, message: 'Nom est obligatoire' }],
      renderInput: () => <Input placeholder="Nom du client" />,
    },
  },
  {
    key: 'email',
    label: 'Emails',
    render: (data) => (
      <Flex vertical gap={4}>
        {data.email.map((email, index) => (
          <Flex key={index} gap={8} align="center">
            <MailOutlined />
            <Text>{email}</Text>
          </Flex>
        ))}
      </Flex>
    ),
    editConfig: {
      rules: [
        {
          validator: async (_, emails) => {
            if (!emails || emails.length === 0) {
              return Promise.reject(new Error('Au moins un email est requis'));
            }
          },
        },
      ],
      renderInput: () => (
        <Form.List name="email" initialValue={['']}>
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item required={false} key={field.key}>
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
      ),
    },
  },
  {
    key: 'createdAt',
    label: 'Date de création',
    render: (data) => <Text type="secondary">{new Date(data.createdAt).toLocaleDateString('fr-FR')}</Text>,
  },
];

const Header: React.FC<HeaderProps> = ({ client, onEditSuccess, onDelete, refresh, permissions }) => {
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const clientId = client?.id;

  return (
    <>
      <HeaderDetailsLayout<WithExtends<Client, 'contracts' | 'permissions'>>
        title="Client"
        icon="clients"
        data={client}
        id={clientId ?? ''}
        fields={fields}
        updateService={updateClient}
        extraButtons={[
          <Button key="add-contract" onClick={() => setAddModalVisible(true)}>
            Ajouter un contrat
          </Button>,
        ]}
        onDelete={onDelete}
        onEdit={onEditSuccess}
        onBack={() => navigate(ROUTE_PATHS.private.clients.root)}
        permissions={permissions}
      />
      <AddContract
        clientId={client?.id}
        visible={addModalVisible}
        setVisible={setAddModalVisible}
        onSuccess={() => {
          setAddModalVisible(false);
          refresh();
        }}
      />
    </>
  );
};

export default Header;
