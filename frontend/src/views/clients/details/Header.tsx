import { MailOutlined } from '@ant-design/icons';
import { ROUTE_PATHS } from '@config/routePaths';
import type Client from '@interfaces/client';
import { Flex, Typography, Input, Button } from 'antd';
import AddContract from 'components/common/modal/create/AddContract';
import HeaderDetailsLayout from 'components/layouts/headerDetails/HeaderDetails';
import type { FieldConfig } from 'components/layouts/headerDetails/types';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  client: Client | null;
  onEditSuccess: (updatedClient: Client) => void;
  onDelete: () => void;
  refresh: () => void;
}

const { Text } = Typography;

const fields: FieldConfig<Client>[] = [
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
    label: 'Email',
    render: (data) => (
      <Flex gap={8} align="center">
        <MailOutlined />
        <Text>{data.email}</Text>
      </Flex>
    ),
    editConfig: {
      rules: [
        { required: true, message: 'Email est obligatoire' },
        { type: 'email', message: 'Format invalide' },
      ],
      renderInput: () => <Input type="email" placeholder="exemple@domaine.com" />,
    },
  },
  {
    key: 'createdAt',
    label: 'Date de création',
    render: (data) => <Text type="secondary">{new Date(data.createdAt).toLocaleDateString('fr-FR')}</Text>,
  },
];

const Header: React.FC<HeaderProps> = ({ client, onEditSuccess, onDelete, refresh }) => {
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const clientId = client?.id;

  return (
    <>
      <HeaderDetailsLayout<Client>
        title="Client"
        icon="contract"
        data={client}
        editEndpoint={`/clients/${clientId}`}
        fields={fields}
        extraButtons={[
          <Button key="add-contract" onClick={() => setAddModalVisible(true)}>
            Ajouter un contrat
          </Button>,
        ]}
        onDelete={onDelete}
        onEdit={onEditSuccess}
        onBack={() => navigate(ROUTE_PATHS.private.clients.root)}
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
