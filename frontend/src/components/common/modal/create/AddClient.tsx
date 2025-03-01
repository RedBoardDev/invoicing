import { Form, Input } from 'antd';
import { AddModal } from 'components/common/modal/create/component/AddModal';
import type React from 'react';
import type Client from '@interfaces/client';
import { createClient } from '@api/services/clients';

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
      createService={createClient}>
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
            <Input placeholder="Email de l’entreprise" />
          </Form.Item>
        </>
      )}
    </AddModal>
  );
};

export default AddClient;
