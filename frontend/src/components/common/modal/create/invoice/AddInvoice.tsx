import type React from 'react';
import { useCallback, useMemo } from 'react';
import type Invoice from '@interfaces/invoice';
import { DatePicker, Form, Input, InputNumber, Button, Divider, Spin } from 'antd';
import { AddModal } from 'components/common/modal/create/component/AddModal';
import ContractSelect from 'components/dataEntry/ContractSelect';
import AmountInput from 'components/dataEntry/AmountInput';
import dayjs, { type Dayjs } from 'dayjs';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useMessage } from '@hooks/useMessage';
import useInvoiceData from 'components/common/modal/create/invoice/useInvoiceData';
import { createInvoice } from '@api/services/invoices';

interface AddInvoiceProps {
  contractId?: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
}

type InvoiceCreateData = Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'sendDate' | 'fileId' | 'invoiceNumber'> & {
  items?: { description: string; amount: number }[];
};

const AddInvoice: React.FC<AddInvoiceProps> = ({ contractId, visible, setVisible, onSuccess }) => {
  const [form] = Form.useForm();
  const messageApi = useMessage();
  const { contracts, invoiceNumber, contractsLoading, invoiceNumberLoading } = useInvoiceData(
    visible,
    contractId,
    form,
    messageApi,
  );

  const handleAddSuccess = useCallback(() => {
    setVisible(false);
    onSuccess?.();
  }, [setVisible, onSuccess]);

  const handleContractChange = useCallback(
    (contractIdValue: string) => {
      const selectedContract = contracts.find((c) => c.id === contractIdValue);
      if (selectedContract) {
        const dueDate = dayjs().add(selectedContract.paymentDelay, 'day').toDate();
        form.setFieldsValue({
          amountHT: selectedContract.amountHT,
          taxRate: selectedContract.taxRate,
          dueDate,
        });
      }
    },
    [contracts, form],
  );

  const initialValues = useMemo<Partial<InvoiceCreateData>>(() => {
    const baseValues: Partial<InvoiceCreateData> = {
      status: 'DRAFT',
      items: [],
    };
    return contractId ? { ...baseValues, contractId } : baseValues;
  }, [contractId]);

  return (
    <AddModal<Invoice>
      visible={visible}
      onCancel={() => setVisible(false)}
      onSuccess={handleAddSuccess}
      title="Nouvelle facture"
      createService={createInvoice}
      initialValues={initialValues}
      form={form}>
      {() => (
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
              <ContractSelect contracts={contracts} loading={contractsLoading} onChange={handleContractChange} />
            </Form.Item>
          )}
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <Form.Item label="Numéro de facture">
                {invoiceNumberLoading ? (
                  <Spin size="small" />
                ) : (
                  <Input value={invoiceNumber || 'Erreur de chargement'} readOnly />
                )}
              </Form.Item>
            </div>
            <div style={{ flex: 1 }}>
              <Form.Item name="status" label="Statut de la facture">
                <Input readOnly />
              </Form.Item>
            </div>
          </div>
          <Form.Item label="Montant" shouldUpdate>
            <AmountInput disabled />
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Date d'échéance"
            rules={[{ required: true, message: "La date d'échéance est requise" }]}
            getValueProps={(value: Date) => ({ value: value ? dayjs(value) : null })}
            normalize={(value: Dayjs) => (value ? value.toISOString() : null)}
            shouldUpdate>
            <DatePicker style={{ width: '100%' }} disabled />
          </Form.Item>
          <Divider>
            <span style={{ backgroundColor: '#fff', padding: '0 16px', fontSize: 16, color: '#666' }}>Items</span>
          </Divider>
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
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
                      <InputNumber step={0.01} min={0} placeholder="Montant" style={{ width: 150 }} />
                    </Form.Item>
                    <Button
                      type="link"
                      onClick={() => remove(name)}
                      icon={<MinusCircleOutlined />}
                      style={{ height: 32, display: 'flex', alignItems: 'center' }}
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
