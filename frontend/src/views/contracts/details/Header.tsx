import { ROUTE_PATHS } from '@config/routePaths';
import type Contract from '@interfaces/contract';
import { Typography, Button, Input, InputNumber } from 'antd';
import AddInvoice from 'components/common/modal/create/AddInvoice';
import HeaderDetailsLayout from 'components/layouts/headerDetails/HeaderDetails';
import type { FieldConfig } from 'components/layouts/headerDetails/types';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  contract: Contract | null;
  refreshInvoices: () => void;
}

const { Text } = Typography;

const fields: FieldConfig<Contract>[] = [
  {
    key: 'amountHT',
    label: 'Montant HT',
    render: (data) => <Text>{Number.parseFloat(data.amountHT).toLocaleString('fr-FR')} €</Text>,
    editConfig: {
      rules: [{ required: true, message: 'Le montant est obligatoire' }],
      renderInput: () => (
        <InputNumber
          style={{ width: '100%' }}
          formatter={(value) => `${value} €`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
          parser={(value) => value!.replace(/ €\s?| /g, '')}
        />
      ),
    },
  },
  {
    key: 'taxRate',
    label: 'Taux de TVA',
    render: (data) => <Text>{Number.parseFloat(data.taxRate).toLocaleString('fr-FR')} %</Text>,
    editConfig: {
      rules: [
        { required: true, message: 'Le taux est obligatoire' },
        { type: 'number', min: 0, max: 100, message: 'Doit être entre 0 et 100' },
      ],
      renderInput: () => <InputNumber min={0} max={100} style={{ width: '100%' }} />,
    },
  },
  {
    key: 'paymentDelay',
    label: 'Délai de paiement',
    render: (data) => <Text>{data.paymentDelay} jours</Text>,
    editConfig: {
      rules: [
        { required: true, message: 'Le délai est obligatoire' },
        { type: 'number', min: 1, message: 'Doit être positif' },
      ],
      renderInput: () => <InputNumber min={1} placeholder="Jours" style={{ width: '100%' }} />,
    },
  },
  {
    key: 'startDate',
    label: 'Date de début',
    render: (data) => <Text>{new Date(data.startDate).toLocaleDateString('fr-FR')}</Text>,
    editConfig: {
      rules: [{ required: true, message: 'La date de début est obligatoire' }],
      renderInput: () => <Input type="date" />,
    },
  },
  {
    key: 'endDate',
    label: 'Date de fin',
    render: (data) => <Text>{new Date(data.endDate).toLocaleDateString('fr-FR')}</Text>,
    editConfig: {
      rules: [{ required: true, message: 'La date de fin est obligatoire' }],
      renderInput: () => <Input type="date" />,
    },
  },
  {
    key: 'createdAt',
    label: 'Date de création',
    render: (data) => <Text type="secondary">{new Date(data.createdAt).toLocaleDateString('fr-FR')}</Text>,
  },
  {
    key: 'description',
    label: 'Description',
    render: (data) => <Text>{data.description}</Text>,
    editConfig: {
      rules: [{ required: true, message: 'La description est obligatoire' }],
      renderInput: () => <Input.TextArea placeholder="Description du contrat" />,
    },
  },
];

const Header: React.FC<HeaderProps> = ({ contract, refreshInvoices }) => {
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const contractId = contract?.id;

  return (
    <>
      <HeaderDetailsLayout<Contract>
        title="Contrat"
        icon="contract"
        data={contract}
        editEndpoint={`/api/contracts/${contractId}`}
        fields={fields}
        extraButtons={[
          <Button key="add-invoice" onClick={() => setAddModalVisible(true)}>
            Ajouter une facture
          </Button>,
        ]}
        onBack={() => navigate(ROUTE_PATHS.private.contracts.root)}
        onDelete={() => {
          refreshInvoices();
        }}
        onEdit={() => {
          refreshInvoices();
        }}
      />
      <AddInvoice
        contractId={contract?.id}
        visible={addModalVisible}
        setVisible={setAddModalVisible}
        onSuccess={() => {
          setAddModalVisible(false);
          refreshInvoices();
        }}
      />
    </>
  );
};

export default Header;
