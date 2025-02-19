import { MailOutlined } from '@ant-design/icons';
import { ROUTE_PATHS } from '@config/routePaths';
import type Client from '@interfaces/clients';
import { Flex, Typography, Input } from 'antd';
import HeaderDetailsLayout from 'components/layouts/headerDetails/HeaderDetails';
import type React from 'react';
import { useNavigate } from 'react-router-dom';

interface ClientsDetailsProps {
  client: Client | null;
}

const { Text } = Typography;

const ClientsDetails: React.FC<ClientsDetailsProps> = ({ client }) => {
  const navigate = useNavigate();
  const clientId = client?.id;

  return (
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
      onBack={() => navigate(ROUTE_PATHS.private.clients.root)}
      onDelete={() => {
        // Implémenter la logique de suppression
      }}
      onSuccess={(updatedClient) => {
        // Logique de mise à jour
      }}
    />
  );
};

export default ClientsDetails;
