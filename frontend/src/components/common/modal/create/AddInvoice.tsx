import { useCallback, useEffect, useState } from 'react';
import type Contract from '@interfaces/contract';
import type Invoice from '@interfaces/invoice';
import { DatePicker, Form, type FormInstance, Input, InputNumber, Button, Divider } from 'antd';
import { AddModal } from 'components/common/modal/AddModal';
import type React from 'react';
import ContractSelect from 'components/dataEntry/ContractSelect';
import AmountInput from 'components/dataEntry/AmountInput';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

interface AddInvoiceProps {
  contractId?: string | undefined;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
}

const AddInvoice: React.FC<AddInvoiceProps> = ({ contractId, visible, setVisible, onSuccess }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractsLoading, setContractsLoading] = useState(false);

  useEffect(() => {
    const fetchContracts = async () => {
      setContractsLoading(true);
      try {
        const response = await fetch('http://localhost:3000/contracts?includeClient=true');
        const data = await response.json();
        setContracts(data.data);
      } catch (error) {
        console.error('Error fetching contracts:', error);
      } finally {
        setContractsLoading(false);
      }
    };

    if (visible) fetchContracts();
  }, [visible]);

  const handleAddSuccess = useCallback(() => {
    setVisible(false);
    onSuccess?.();
  }, [setVisible, onSuccess]);

  const handleContractChange = (form: FormInstance, contractId: string) => {
    const selectedContract = contracts.find((c) => c.id === contractId);
    if (selectedContract) {
      const dueDate = dayjs().add(selectedContract.paymentDelay, 'day').toDate();
      form.setFieldsValue({
        amountHT: selectedContract.amountHT,
        taxRate: selectedContract.taxRate,
        dueDate,
      });
    }
  };

  const getInitialValues = (): Partial<Invoice> => {
    if (!contractId) {
      return {
        status: 'DRAFT',
        invoiceNumber: uuidv4(),
        items: [],
      };
    }

    const selectedContract = contracts.find((c) => c.id === contractId);
    if (selectedContract) {
      const dueDate = dayjs().add(selectedContract.paymentDelay, 'day').toISOString();
      return {
        contractId,
        status: 'DRAFT',
        invoiceNumber: uuidv4(),
        amountHT: selectedContract.amountHT,
        taxRate: selectedContract.taxRate,
        dueDate,
        items: [],
      };
    }

    return {
      contractId,
      status: 'DRAFT',
      invoiceNumber: uuidv4(),
      items: [],
    };
  };

  return (
    <AddModal<Invoice>
      visible={visible}
      onCancel={() => setVisible(false)}
      onSuccess={handleAddSuccess}
      endpoint="/invoices"
      title="Nouvelle facture"
      initialValues={getInitialValues()}
    >
      {(form) => (
        <>
          {contractId ? (
            <Form.Item name="contractId" hidden>
              <Input type="hidden" />
            </Form.Item>
          ) : (
            <Form.Item
              name="contractId"
              label="Contrat"
              rules={[{ required: true, message: 'Sélectionnez un contrat' }]}>
              <ContractSelect
                contracts={contracts}
                loading={contractsLoading}
                onChange={(contractId) => handleContractChange(form, contractId)}
              />
            </Form.Item>
          )}
          <Form.Item
            name="invoiceNumber"
            label="Numéro de facture"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="status"
            label="Statut de la facture"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: '16px' }}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="Montant" shouldUpdate>
            <AmountInput disabled={true} />
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Date d'échéance"
            rules={[{ required: true, message: "La date d'échéance est requise" }]}
            getValueProps={(value) => ({ value: value ? dayjs(value) : null })}
            normalize={(value) => (value ? dayjs(value).toISOString() : null)}
            shouldUpdate>
            <DatePicker style={{ width: '100%' }} disabled />
          </Form.Item>

          <Divider>
            <span style={{ backgroundColor: '#fff', padding: '0 16px', fontSize: '16px', color: '#666' }}>Items</span>
          </Divider>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'description']}
                      rules={[{ required: true, message: '' }]}
                      style={{ flex: 1, marginBottom: 0 }}>
                      <Input placeholder="Description" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'amount']}
                      rules={[
                        { required: true, message: '' },
                        { type: 'number', min: 0, message: 'Le montant doit être positif' },
                      ]}
                      style={{ marginBottom: 0 }}>
                      <InputNumber step={0.01} min={0} placeholder="Montant" style={{ width: '150px' }} />
                    </Form.Item>
                    <Button
                      type="link"
                      onClick={() => remove(name)}
                      icon={<MinusCircleOutlined />}
                      style={{ height: '32px', display: 'flex', alignItems: 'center' }}
                    />
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Ajouter un item
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </>
      )}
    </AddModal>
  );
};

export default AddInvoice;
