import { FilePdfOutlined } from '@ant-design/icons';
import { ROUTE_PATHS } from '@config/routePaths';
import { STATUS_COLORS } from '@enums/invoiceStatus';
import { useMessage } from '@hooks/useMessage';
import type Invoice from '@interfaces/invoice';
import { formatDate } from '@utils';
import { Typography, Input, Select, Tag, DatePicker, Button, Modal } from 'antd';
import AddInvoice from 'components/common/modal/create/invoice/AddInvoice';
import HeaderDetailsLayout from 'components/layouts/headerDetails/HeaderDetails';
import type { FieldConfig } from 'components/layouts/headerDetails/types';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  invoice: Invoice | null;
  onEditSuccess: (updatedInvoice: Invoice) => void;
  onDelete: () => void;
  refresh: () => void;
}

const { Text } = Typography;

const fields: FieldConfig<Invoice>[] = [
  {
    key: 'invoiceNumber',
    label: 'N° Facture',
    render: (data) => <Text strong>#{data.invoiceNumber}</Text>,
    editConfig: {
      rules: [{ required: true, message: 'Le numéro de facture est obligatoire' }],
      renderInput: () => <Input placeholder="FAC-0001" />,
    },
  },
  // {
  //   key: 'totalAmount',
  //   label: 'Montant Total',
  //   render: (data) => (
  //     <Text type="success">{data.totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</Text>
  //   ),
  //   editConfig: {
  //     rules: [
  //       { required: true, message: 'Le montant est obligatoire' },
  //       { type: 'number', min: 0, message: 'Doit être positif' },
  //     ],
  //     renderInput: () => (
  //       <InputNumber
  //         style={{ width: '100%' }}
  //         formatter={(value) => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
  //         parser={(value) => value!.replace(/€\s?| /g, '')}
  //       />
  //     ),
  //   },
  // },
  {
    key: 'status',
    label: 'Statut',
    render: (data) => <Tag color={STATUS_COLORS[data.status]}>{data.status.toUpperCase()}</Tag>,
    editConfig: {
      rules: [{ required: true, message: 'Le statut est obligatoire' }],
      renderInput: () => (
        <Select>
          {Object.keys(STATUS_COLORS).map((status) => (
            <Select.Option key={status} value={status}>
              {status.toUpperCase()}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  },
  {
    key: 'dueDate',
    label: 'Échéance',
    render: (data) => formatDate(data.dueDate, 'DD/MM/YYYY'),
    editConfig: {
      rules: [{ required: true, message: "La date d'échéance est obligatoire" }],
      renderInput: () => <DatePicker format="DD/MM/YYYY" />,
    },
  },
  {
    key: 'sendDate',
    label: 'Envoyée le',
    render: (data) => (data.sendDate ? formatDate(data.sendDate, 'DD/MM/YYYY') : <Text type="secondary">-</Text>),
    editConfig: {
      renderInput: () => <DatePicker format="DD/MM/YYYY" />,
    },
  },
  {
    key: 'pdfUrl',
    label: 'Lien PDF',
    render: (data) =>
      data.pdfUrl ? (
        <a href={data.pdfUrl} target="_blank" rel="noreferrer">
          <FilePdfOutlined />
        </a>
      ) : (
        <Text type="secondary">-</Text>
      ),
    editConfig: {
      rules: [{ type: 'url', message: 'URL invalide' }],
      renderInput: () => <Input placeholder="https://..." />,
    },
  },
];

const Header: React.FC<HeaderProps> = ({ invoice, onEditSuccess, onDelete, refresh }) => {
  const messageApi = useMessage();
  const navigate = useNavigate();

  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const contractId = invoice?.id;

  const handleValidateInvoice = async () => {
    if (!contractId) return;

    setIsValidating(true);
    try {
      const response = await fetch(`http://localhost:3000/invoices/${contractId}/validate`, {
        // TODO voir pk il fail
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Échec de la validation de la facture');
      messageApi.success('Facture validée avec succès');
      setConfirmModalVisible(false);
      refresh();
    } catch (error) {
      messageApi.error('Erreur lors de la validation de la facture');
    } finally {
      setIsValidating(false);
    }
  };

  const showConfirmModal = () => {
    setConfirmModalVisible(true);
  };

  const handleCancelValidation = () => {
    setConfirmModalVisible(false);
  };

  return (
    <>
      <HeaderDetailsLayout<Invoice>
        title="Facture"
        icon="contract"
        data={invoice}
        editEndpoint={`/invoices/${contractId}`}
        fields={fields}
        extraButtons={[
          <Button
            type="primary"
            key="validate-invoice"
            onClick={showConfirmModal}
            disabled={!invoice || invoice.status === 'VALIDATED'}>
            Valider
          </Button>,
          // TODO pour envoyer enfaite il faut déjà check si c'est valider, si non, messageApi 'faut valider avant' sinon on redirige sur la suite
          <Button key="send-invoice" onClick={() => console.log('Send invoice')}>
            Envoyer
          </Button>,
          // TODO ajouter un button de preview pdf (ouvrir dans un nouvel onglet ?)
        ]}
        onDelete={onDelete}
        onEdit={onEditSuccess}
        onBack={() => navigate(ROUTE_PATHS.private.invoices.root)}
      />
      <Modal
        title="Confirmation de validation"
        open={confirmModalVisible}
        onOk={handleValidateInvoice}
        onCancel={handleCancelValidation}
        okText="Oui, valider"
        cancelText="Non, annuler"
        confirmLoading={isValidating}
        okButtonProps={{ danger: true }}>
        <Text>
          Êtes-vous sûr de vouloir valider cette facture ? Une fois validée, elle ne pourra plus être modifiée.
        </Text>
      </Modal>
      <AddInvoice
        contractId={invoice?.id}
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
