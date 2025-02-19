import { MailOutlined } from '@ant-design/icons';
import { ROUTE_PATHS } from '@config/routePaths';
import type Client from '@interfaces/clients';
import { Flex, Typography } from 'antd';
import HeaderDetailsLayout from 'components/layouts/headerDetails/HeaderDetailsLayout';
import type React from 'react';
import { useNavigate } from 'react-router-dom';

interface ClientsDetailsProps {
  client: Client | null;
}
const { Text } = Typography;

const ClientsDetails: React.FC<ClientsDetailsProps> = ({ client }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    console.log('Edit client:', client?.id);
  };

  const handleCreate = () => {
    console.log('Create new client');
  };

  return (
    <HeaderDetailsLayout<Client>
      title="Client"
      icon="contract"
      data={client}
      dataConfig={[
        {
          key: 'name',
          children: (data) => (
            <Text strong style={{ fontSize: 16 }}>
              {data.name}
            </Text>
          ),
        },
        {
          key: 'email',
          children: (data) => (
            <Flex gap={8} align="center">
              <MailOutlined />
              <Text>{data.email}</Text>
            </Flex>
          ),
        },
        {
          key: 'createdAt',
          children: (data) => <Text type="secondary">{new Date(data.createdAt).toLocaleDateString('fr-FR')}</Text>,
        },
      ]}
      onBack={() => navigate(ROUTE_PATHS.private.clients.root)}
      onEdit={() => {
        throw new Error('Function not implemented.');
      }}
      onDelete={() => {
        throw new Error('Function not implemented.');
      }}
    />
  );
};

export default ClientsDetails;
