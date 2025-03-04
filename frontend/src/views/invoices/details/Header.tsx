import { EyeOutlined } from '@ant-design/icons';
import { ROUTE_PATHS } from '@config/routePaths';
import { InvoiceStatus, STATUS_COLORS, STATUS_LABELS } from '@enums/invoiceStatus';
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
import dayjs from 'dayjs';
import { getInvoicePdf, updateInvoice, getNextInvoiceNumber } from '@api/services/invoices';
import type { Permissions, WithExtends } from '@api/types/extends';
import ConfirmValidatedModal from 'components/common/modal/ConfirmValidatedModal';

const { Text } = Typography;

const fields: FieldConfig<WithExtends<Invoice, 'contract'>>[] = [
  {
    key: 'invoiceNumber',
    label: 'N° Facture',
    render: ({ invoiceNumber, status }) =>
      invoiceNumber ? (
        <Text strong>{`#${invoiceNumber}`}</Text>
      ) : (
        <Text>{status === InvoiceStatus.DRAFT ? 'Provisoire' : 'N/A'}</Text>
      ),
  },
  {
    key: 'status',
    label: 'Statut',
    render: (data) => <Tag color={STATUS_COLORS[data.status]}>{STATUS_LABELS[data.status]}</Tag>,
  },
  {
    key: 'dueDate',
    label: 'Échéance',
    render: (data) => (data.dueDate ? formatDate(data.dueDate, 'DD/MM/YYYY') : 'N/A'),
    editConfig: {
      rules: [{ required: true, message: "La date d'échéance est obligatoire" }],
      renderInput: () => <DatePicker format="DD/MM/YYYY" />,
      getValueProps: (value) => ({ value: value ? dayjs(value) : null }),
      normalize: (value) => (value ? value.toISOString() : null),
    },
  },
  {
    key: 'sendDate',
    label: 'Envoyée le',
    render: (data) => (data.sendDate ? formatDate(data.sendDate, 'DD/MM/YYYY') : <Text type="secondary">N/A</Text>),
  },
];

interface HeaderProps {
  invoice: WithExtends<Invoice, 'contract'> | null;
  onEditSuccess: (updatedInvoice: WithExtends<Invoice, 'contract'>) => void;
  onDelete: () => void;
  refresh: () => void;
  permissions?: Permissions;
}

interface ButtonConfig {
  key: string;
  label: string;
  action?: () => void;
  loading: boolean;
  disabled: boolean;
  primary?: boolean;
}

const Header: React.FC<HeaderProps> = ({ invoice, onEditSuccess, onDelete, refresh, permissions }) => {
  const navigate = useNavigate();
  const { validateInvoice, markAsPaid, isValidating, isMarkingAsPaid } = useInvoiceActions(invoice, refresh);

  const [confirmModalVisible, setConfirmModalVisible] = useState<'validate' | 'markAsPaid' | null>(null);
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [isViewingPdf, setIsViewingPdf] = useState(false);
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState<string | undefined>(undefined);

  const loadNextInvoiceNumber = async () => {
    try {
      const response = await getNextInvoiceNumber();
      console.log(response);
      if (!response.success)
        throw new Error(response.error || 'Erreur lors de la récupération du prochain numéro de facture');
      setNextInvoiceNumber(response.data.data.invoiceNumber);
    } catch (error) {
      console.error('Erreur lors de la récupération du prochain numéro de facture:', error);
      setNextInvoiceNumber(undefined);
    }
  };

  const handleViewPdf = async () => {
    if (!invoice?.id) return;
    setIsViewingPdf(true);
    try {
      const result = await getInvoicePdf(invoice.id);
      if (!result.success) throw new Error(result.error || 'Erreur lors de la récupération du PDF');
      const blob = result.data;
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Erreur lors de la visualisation du PDF:', error);
      Modal.error({ title: 'Erreur', content: 'Impossible de charger le PDF' });
    } finally {
      setIsViewingPdf(false);
    }
  };

  const closeSendModal = () => setSendModalVisible(false);

  const showConfirmModal = async (action: 'validate' | 'markAsPaid') => {
    if (action === 'validate') {
      await loadNextInvoiceNumber();
    }
    setConfirmModalVisible(action);
  };

  const handleCancelConfirmation = () => {
    setConfirmModalVisible(null);
    setNextInvoiceNumber(undefined);
  };

  const handleConfirmAction = async () => {
    if (confirmModalVisible === 'validate') await validateInvoice();
    else if (confirmModalVisible === 'markAsPaid') await markAsPaid();
    setConfirmModalVisible(null);
    setNextInvoiceNumber(undefined);
  };

  const getActionButtons = (): ButtonConfig[] => {
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
        {
          key: 'view-pdf',
          label: 'Voir PDF',
          action: handleViewPdf,
          loading: isViewingPdf,
          disabled: false,
        },
      ],
      VALIDATED: [
        {
          key: 'send-invoice',
          label: 'Envoyer',
          action: () => setSendModalVisible(true),
          loading: false,
          disabled: false,
          primary: true,
        },
        {
          key: 'view-pdf',
          label: 'Voir PDF',
          action: handleViewPdf,
          loading: isViewingPdf,
          disabled: false,
        },
      ],
      SENT: [
        {
          key: 'mark-as-paid',
          label: 'Marquer comme payé',
          action: () => showConfirmModal('markAsPaid'),
          loading: isMarkingAsPaid,
          disabled: false,
          primary: true,
        },
        {
          key: 'view-pdf',
          label: 'Voir PDF',
          action: handleViewPdf,
          loading: isViewingPdf,
          disabled: false,
        },
      ],
      PAID: [
        {
          key: 'view-pdf',
          label: 'Voir PDF',
          action: handleViewPdf,
          loading: isViewingPdf,
          disabled: false,
        },
      ],
      UNKNOWN: [],
    };

    return buttonConfigs[status] || [];
  };

  const invoiceId = invoice?.id;

  return (
    <>
      <HeaderDetailsLayout<WithExtends<Invoice, 'contract'>>
        title="Facture"
        icon="invoice"
        data={invoice}
        id={invoiceId ?? ''}
        updateService={updateInvoice}
        fields={fields}
        permissions={permissions}
        extraButtons={getActionButtons().map(({ key, label, action, loading, disabled, primary }) => (
          <Button
            key={key}
            type={primary ? 'primary' : 'default'}
            icon={key === 'view-pdf' ? <EyeOutlined /> : undefined}
            onClick={action}
            loading={loading}
            disabled={disabled}>
            {label}
          </Button>
        ))}
        onDelete={onDelete}
        onEdit={onEditSuccess}
        onBack={() => navigate(ROUTE_PATHS.private.invoices.root)}
      />
      <SendInvoiceModal visible={sendModalVisible} invoice={invoice} onClose={closeSendModal} onSuccess={refresh} />
      <ConfirmValidatedModal
        action={confirmModalVisible}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelConfirmation}
        isLoading={isValidating || isMarkingAsPaid}
        invoiceNumber={confirmModalVisible === 'validate' ? nextInvoiceNumber : undefined}
      />
    </>
  );
};

export default Header;
