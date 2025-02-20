import { MailOutlined } from '@ant-design/icons';
import { ROUTE_PATHS } from '@config/routePaths';
import type Client from '@interfaces/client';
import { Flex, Typography, Input, Button } from 'antd';
import AddContract from 'components/common/modal/create/AddContract';
import HeaderDetailsLayout from 'components/layouts/headerDetails/HeaderDetails';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  client: Client | null;
  refreshContracts: () => void;
}

const { Text } = Typography;

const Header: React.FC<HeaderProps> = ({ client, refreshContracts }) => {
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const clientId = client?.id;

  return (
    <>
      <HeaderDetailsLayout<Client>
        title="Client"
        icon="contract"
        data={client}
        editEndpoint={`/api/clients/${clientId}`}
        fields={[
          {
            key: 'name',
            label: 'Nom',
            render: (data) => (
              <Text strong style={{ fontSize: 16 }}>
                {data.name}
              </Text>
            ),
            editConfig: {
              rules: [{ required: true, message: 'Le nom est obligatoire' }],
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
                { required: true, message: 'Email obligatoire' },
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
        ]}
        extraButtons={[
          <Button key="add-contract" onClick={() => setAddModalVisible(true)}>
            Ajouter un contrat
          </Button>,
        ]}
        onBack={() => navigate(ROUTE_PATHS.private.clients.root)}
        onDelete={() => {
          refreshContracts();
        }}
        onEdit={(updatedClient) => {
          refreshContracts();
        }}
      />
      <AddContract
        clientId={client?.id}
        visible={addModalVisible}
        setVisible={setAddModalVisible}
        onSuccess={() => {
          setAddModalVisible(false);
          refreshContracts();
        }}
      />
    </>
  );
};

export default Header;
