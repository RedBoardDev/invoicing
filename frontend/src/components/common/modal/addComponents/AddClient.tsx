import {} from 'react';
import { Form, Input } from 'antd';
import { AddModal } from 'components/common/modal/AddModal';
import type React from 'react';
import type Client from '@interfaces/clients';

interface AddContractsProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddContracts: React.FC<AddContractsProps> = ({ visible, setVisible }) => {
  return (
    <AddModal<Client>
      visible={visible}
      onCancel={() => setVisible(false)}
      onSuccess={() => setVisible(false)}
      endpoint="/clients"
      title="Nouveau client">
      {() => (
        <>
          <Form.Item
            name="name"
            label="Nom du client"
            rules={[{ required: true, message: 'Ce champ est obligatoire' }]}>
            <Input placeholder="Nom de l'entreprise" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email du client"
            rules={[
              { required: true, message: 'Ce champ est obligatoire' },
              { type: 'email', message: 'Veuillez entrer un email valide' },
            ]}>
            <Input placeholder="Email de l'entreprise" />
          </Form.Item>
        </>
      )}
    </AddModal>
  );
};

export default AddContracts;
