import { FilePdfOutlined } from '@ant-design/icons';
import { ROUTE_PATHS } from '@config/routePaths';
import { STATUS_COLORS } from '@enums/invoiceStatus';
import Invoice from '@interfaces/invoice';
import { formatDate } from '@utils';
import { Typography, Button, Input, InputNumber, Select, Tag, DatePicker } from 'antd';
import AddInvoice from 'components/common/modal/create/AddInvoice';
import HeaderDetailsLayout from 'components/layouts/headerDetails/HeaderDetails';
import type { FieldConfig } from 'components/layouts/headerDetails/types';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  invoice: Invoice | null;
  refreshItems: () => void;
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
  {
    key: 'totalAmount',
    label: 'Montant Total',
    render: (data) => (
      <Text type="success">
        {data.totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
      </Text>
    ),
    editConfig: {
      rules: [
        { required: true, message: 'Le montant est obligatoire' },
        { type: 'number', min: 0, message: 'Doit être positif' },
      ],
      renderInput: () => (
        <InputNumber
          style={{ width: '100%' }}
          formatter={(value) => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
          parser={(value) => value!.replace(/€\s?| /g, '')}
        />
      ),
    },
  },
  {
    key: 'status',
    label: 'Statut',
    render: (data) => (
      <Tag color={STATUS_COLORS[data.status]}>
        {data.status.toUpperCase()}
      </Tag>
    ),
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
    render: (data) => data.sendDate
      ? formatDate(data.sendDate, 'DD/MM/YYYY')
      : <Text type="secondary">-</Text>,
    editConfig: {
      renderInput: () => <DatePicker format="DD/MM/YYYY" />,
    },
  },
  {
    key: 'pdfUrl',
    label: 'Lien PDF',
    render: (data) => data.pdfUrl
      ? <a href={data.pdfUrl} target="_blank"><FilePdfOutlined /></a>
      : <Text type="secondary">-</Text>,
    editConfig: {
      rules: [{ type: 'url', message: 'URL invalide' }],
      renderInput: () => <Input placeholder="https://..." />,
    },
  },
];

const Header: React.FC<HeaderProps> = ({ invoice, refreshItems }) => {
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const contractId = invoice?.id;

  return (
    <>
      <HeaderDetailsLayout<Invoice>
        title="Facture"
        icon="contract"
        data={invoice}
        editEndpoint={`/api/invoices/${contractId}`}
        fields={fields}
        extraButtons={[]}
        onBack={() => navigate(ROUTE_PATHS.private.invoices.root)}
        onDelete={() => {
          refreshItems();
        }}
        onEdit={() => {
          refreshItems();
        }}
      />
      <AddInvoice
        contractId={invoice?.id}
        visible={addModalVisible}
        setVisible={setAddModalVisible}
        onSuccess={() => {
          setAddModalVisible(false);
          refreshItems();
        }}
      />
    </>
  );
};

export default Header;
