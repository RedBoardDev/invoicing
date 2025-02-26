import { FilePdfOutlined, EyeOutlined } from '@ant-design/icons';
import { ROUTE_PATHS } from '@config/routePaths';
import { STATUS_COLORS } from '@enums/invoiceStatus';
import type Invoice from '@interfaces/invoice';
import { formatDate } from '@utils';
import { Typography, Tag, DatePicker, Button, Modal } from 'antd';
import HeaderDetailsLayout from 'components/layouts/headerDetails/HeaderDetails';
import type { FieldConfig } from 'components/layouts/headerDetails/types';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoiceActions } from './useInvoiceActions';
import SendInvoiceModal from 'components/common/modal/sendInvoice/SendInvoiceModal';

const { Text } = Typography;

// TODO en update on peux modifier: dueDate et a voir quoi d'autre mais je pense pas bcp plus (voir le schemas du update dans le backend)
const fields: FieldConfig<Invoice>[] = [
  {
    key: 'invoiceNumber',
    label: 'N° Facture',
    render: (data) => <Text strong>#{data.invoiceNumber}</Text>,
  },
  {
    key: 'status',
    label: 'Statut',
    render: (data) => <Tag color={STATUS_COLORS[data.status]}>{data.status.toUpperCase()}</Tag>,
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
  },
];

interface HeaderProps {
  invoice: Invoice | null;
  onEditSuccess: (updatedInvoice: Invoice) => void;
  onDelete: () => void;
  refresh: () => void;
}

interface ButtonConfig {
  key: string;
  label: string;
  action?: () => void;
  loading: boolean;
  disabled: boolean;
  primary?: boolean;
}

const Header: React.FC<HeaderProps> = ({ invoice, onEditSuccess, onDelete, refresh }) => {
  const navigate = useNavigate();
  const { validateInvoice, markAsPaid, isValidating, isSending, isMarkingAsPaid } = useInvoiceActions(invoice, refresh);

  const [confirmModalVisible, setConfirmModalVisible] = useState<'validate' | 'markAsPaid' | null>(null);
  const [sendModalVisible, setSendModalVisible] = useState(false);

  const closeSendModal = () => {
    setSendModalVisible(false);
  };

  const showConfirmModal = (action: 'validate' | 'markAsPaid') => {
    setConfirmModalVisible(action);
  };

  const handleCancelConfirmation = () => {
    setConfirmModalVisible(null);
  };

  const handleConfirmAction = async () => {
    if (confirmModalVisible === 'validate') await validateInvoice();
    else if (confirmModalVisible === 'markAsPaid') await markAsPaid();
    setConfirmModalVisible(null);
  };

  const handleOpenInvoice = () => {
    if (invoice?.pdfUrl) window.open(invoice.pdfUrl, '_blank');
  };

  const getActionButtons = () => {
    const status = invoice?.status || 'UNKNOWN';
    const buttonConfigs: Record<string, ButtonConfig[]> = {
      DRAFT: [
        {
          key: 'validate-invoice',
          label: 'Valider',
          action: () => showConfirmModal('validate'),
          loading: isValidating,
          disabled: false,
          primary: true,
        },
        { key: 'send-invoice', label: 'Envoyer', loading: isSending, disabled: true },
        { key: 'mark-as-paid', label: 'Marquer comme payé', loading: isMarkingAsPaid, disabled: true, primary: true },
      ],
      VALIDATED: [
        { key: 'validate-invoice', label: 'Valider', loading: isValidating, disabled: true },
        {
          key: 'send-invoice',
          label: 'Envoyer',
          action: () => setSendModalVisible(true),
          loading: isSending,
          disabled: false,
          primary: true,
        },
        { key: 'mark-as-paid', label: 'Marquer comme payé', loading: isMarkingAsPaid, disabled: true, primary: true },
      ],
      SENT: [
        { key: 'validate-invoice', label: 'Valider', loading: isValidating, disabled: true },
        { key: 'send-invoice', label: 'Envoyer', loading: isSending, disabled: true },
        {
          key: 'mark-as-paid',
          label: 'Marquer comme payé',
          action: () => showConfirmModal('markAsPaid'),
          loading: isMarkingAsPaid,
          disabled: false,
          primary: true,
        },
      ],
      PAID: [
        { key: 'validate-invoice', label: 'Valider', loading: isValidating, disabled: true },
        { key: 'send-invoice', label: 'Envoyer', loading: isSending, disabled: true },
        { key: 'mark-as-paid', label: 'Marquer comme payé', loading: isMarkingAsPaid, disabled: true, primary: true },
      ],
      UNKNOWN: [
        { key: 'validate-invoice', label: 'Valider', loading: isValidating, disabled: true },
        { key: 'send-invoice', label: 'Envoyer', loading: isSending, disabled: true },
        { key: 'mark-as-paid', label: 'Marquer comme payé', loading: isMarkingAsPaid, disabled: true, primary: true },
      ],
    };

    return (buttonConfigs[status] || []).map(({ key, label, action, loading, disabled, primary }) => (
      <Button key={key} type={primary ? 'primary' : 'default'} onClick={action} loading={loading} disabled={disabled}>
        {label}
      </Button>
    ));
  };

  return (
    <>
      <HeaderDetailsLayout<Invoice>
        title="Facture"
        icon="contract"
        data={invoice}
        editEndpoint={`/invoices/${invoice?.id}`}
        fields={fields}
        extraButtons={[
          <Button key="view-invoice" icon={<EyeOutlined />} onClick={() => handleOpenInvoice()}>
            Voir la facture
          </Button>,
          ...getActionButtons(),
        ]}
        onDelete={onDelete}
        onEdit={onEditSuccess}
        onBack={() => navigate(ROUTE_PATHS.private.invoices.root)}
      />
      <SendInvoiceModal visible={sendModalVisible} invoice={invoice} onClose={closeSendModal} onSuccess={refresh} />
      <Modal
        title={confirmModalVisible === 'validate' ? 'Confirmation de validation' : 'Confirmation de paiement'}
        open={!!confirmModalVisible}
        onOk={handleConfirmAction}
        onCancel={handleCancelConfirmation}
        okText="Oui, confirmer"
        cancelText="Non, annuler"
        confirmLoading={isValidating || isMarkingAsPaid}
        okButtonProps={{ danger: true }}>
        <Text>
          {confirmModalVisible === 'validate'
            ? 'Êtes-vous sûr de vouloir valider cette facture ? Une fois validée, elle ne pourra plus être modifiée.'
            : 'Êtes-vous sûr de vouloir marquer cette facture comme payée ?'}
        </Text>
      </Modal>
    </>
  );
};

export default Header;
