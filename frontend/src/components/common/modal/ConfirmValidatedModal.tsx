import type React from 'react';
import { Modal, Typography } from 'antd';

const { Text } = Typography;

interface ConfirmValidatedModalProps {
  action: 'validate' | 'markAsPaid' | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  invoiceNumber?: string;
}

const ConfirmValidatedModal: React.FC<ConfirmValidatedModalProps> = ({
  action,
  onConfirm,
  onCancel,
  isLoading,
  invoiceNumber,
}) => {
  const titles = {
    validate: 'Confirmation de validation',
    markAsPaid: 'Confirmation de paiement',
  };

  const messages = {
    validate: (
      <>
        <Text>
          Vous êtes sur le point de transformer ce brouillon en facture officielle. Cela lui attribuera un numéro{' '}
          {invoiceNumber ? <Text strong>{`#${invoiceNumber}`}</Text> : 'prochainement généré'} et vous permettra de
          l’envoyer à votre client.
        </Text>
        <Text style={{ display: 'block', marginTop: 8 }}>
          Cette action n’est pas réversible. Vous ne pourrez plus modifier ou effacer cette facture. Confirmez-vous
          cette action ?
        </Text>
      </>
    ),
    markAsPaid: (
      <Text>Êtes-vous sûr de vouloir marquer cette facture comme payée ? Cette action ne peut pas être annulée.</Text>
    ),
  };

  return (
    <Modal
      title={action ? titles[action] : ''}
      open={!!action}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Oui, confirmer"
      cancelText="Non, annuler"
      confirmLoading={isLoading}
      okButtonProps={{ danger: true }}>
      {action && messages[action]}
    </Modal>
  );
};

export default ConfirmValidatedModal;
