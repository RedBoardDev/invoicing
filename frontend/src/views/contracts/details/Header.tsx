import { ROUTE_PATHS } from '@config/routePaths';
import type Contract from '@interfaces/contract';
import { Typography, Button, DatePicker, InputNumber, Input } from 'antd';
import type { FormInstance } from 'antd/lib';
import TextArea from 'antd/lib/input/TextArea';
import AddInvoice from 'components/common/modal/create/invoice/AddInvoice';
import HeaderDetailsLayout from 'components/layouts/headerDetails/HeaderDetails';
import type { FieldConfig } from 'components/layouts/headerDetails/types';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  contract: Contract | null;
  onEditSuccess: (updatedClient: Contract) => void;
  onDelete: () => void;
  refresh: () => void;
}

const { Text } = Typography;

const fields: FieldConfig<Contract>[] = [
  {
    key: 'title',
    label: 'Titre',
    render: (data) => (
      <Text strong style={{ fontSize: 16 }}>
        {data.title}
      </Text>
    ),
    editConfig: {
      rules: [
        { required: true, message: 'Le titre est obligatoire' },
        { max: 255, message: 'Le titre ne doit pas dépasser 255 caractères' },
      ],
      renderInput: (_form: FormInstance<Partial<Contract>>) => <Input placeholder="Titre du contrat" />,
    },
  },
  {
    key: 'description',
    label: 'Description',
    render: (data) => <Text>{data.description}</Text>,
    editConfig: {
      rules: [{ max: 1000, message: 'La description ne doit pas dépasser 1000 caractères' }],
      renderInput: (_form: FormInstance<Partial<Contract>>) => (
        <TextArea rows={4} placeholder="Description du contrat" />
      ),
    },
  },
  {
    key: 'amountHT',
    label: 'Montant HT',
    render: (data) => <Text>{data.amountHT.toLocaleString()} €</Text>,
    editConfig: {
      rules: [
        { required: true, message: 'Le montant HT est obligatoire' },
        { type: 'number', min: 0, message: 'Le montant HT doit être positif' },
      ],
      renderInput: (_form: FormInstance<Partial<Contract>>) => (
        <InputNumber placeholder="Montant HT" style={{ width: '100%' }} step={0.01} />
      ),
    },
  },
  {
    key: 'taxRate',
    label: 'Taux de taxe',
    render: (data) => <Text>{data.taxRate} %</Text>,
    editConfig: {
      rules: [
        { required: true, message: 'Le taux de taxe est obligatoire' },
        { type: 'number', min: 0, message: 'Le taux de taxe doit être positif' },
      ],
      renderInput: (_form: FormInstance<Partial<Contract>>) => (
        <InputNumber placeholder="Taux de taxe" style={{ width: '100%' }} step={0.1} />
      ),
      normalize: (value) => (value !== undefined && value !== null ? Number(value) : null), // Simple conversion en nombre
    },
  },
  {
    key: 'paymentDelay',
    label: 'Délai de paiement',
    render: (data) => <Text>{data.paymentDelay} jours</Text>,
    editConfig: {
      rules: [
        { required: true, message: 'Le délai de paiement est obligatoire' },
        { type: 'integer', min: 0, message: 'Le délai doit être un entier positif' },
      ],
      renderInput: (_form: FormInstance<Partial<Contract>>) => (
        <InputNumber placeholder="Délai de paiement" style={{ width: '100%' }} addonAfter="jours" />
      ),
    },
  },
  {
    key: 'startDate',
    label: 'Date de début',
    render: (data) => <Text>{new Date(data.startDate).toLocaleDateString('fr-FR')}</Text>,
    editConfig: {
      rules: [{ required: true, message: 'La date de début est obligatoire' }],
      renderInput: (form: FormInstance<Partial<Contract>>) => {
        return (
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            placeholder="Date de début"
            disabledDate={(current: Dayjs) => {
              const endDate = form.getFieldValue('endDate') as Dayjs | undefined;
              return endDate ? current.isAfter(endDate, 'day') : false;
            }}
          />
        );
      },
      getValueProps: (value) => ({ value: value ? dayjs(value) : null }),
      normalize: (value) => (value ? dayjs(value).toISOString() : null),
    },
  },
  {
    key: 'endDate',
    label: 'Date de fin',
    render: (data) => <Text>{new Date(data.endDate).toLocaleDateString('fr-FR')}</Text>,
    editConfig: {
      rules: [{ required: true, message: 'La date de fin est obligatoire' }],
      renderInput: (form: FormInstance<Partial<Contract>>) => (
        <DatePicker
          style={{ width: '100%' }}
          format="DD/MM/YYYY"
          placeholder="Date de fin"
          disabledDate={(current: Dayjs) => {
            const startDate = form.getFieldValue('startDate') as Dayjs | undefined;
            return startDate ? current.isBefore(startDate, 'day') : false;
          }}
        />
      ),
      getValueProps: (value) => ({ value: value ? dayjs(value) : null }),
      normalize: (value) => (value ? dayjs(value).toISOString() : null),
    },
  },
];

const Header: React.FC<HeaderProps> = ({ contract, onEditSuccess, onDelete, refresh }) => {
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const contractId = contract?.id;

  return (
    <>
      <HeaderDetailsLayout<Contract>
        title="Contrat"
        icon="contract"
        data={contract}
        editEndpoint={`/contracts/${contractId}`}
        fields={fields}
        extraButtons={[
          <Button key="add-invoice" onClick={() => setAddModalVisible(true)}>
            Ajouter une facture
          </Button>,
        ]}
        onDelete={onDelete}
        onEdit={onEditSuccess}
        onBack={() => navigate(ROUTE_PATHS.private.contracts.root)}
      />
      <AddInvoice
        contractId={contract?.id}
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
