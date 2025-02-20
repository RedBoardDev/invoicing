import { useCallback, useEffect, useState } from 'react';
import type Contract from '@interfaces/contract';
import { DatePicker, Form, Input } from 'antd';
import { AddModal } from 'components/common/modal/AddModal';
import type React from 'react';
import AmountInput from 'components/dataEntry/AmountInput';
import ContractSelect from 'components/dataEntry/ContractSelect';
import { v4 } from 'uuid';
import type Invoice from '@interfaces/invoice';

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

  return (
    <AddModal<Invoice>
      visible={visible}
      onCancel={() => setVisible(false)}
      onSuccess={handleAddSuccess}
      endpoint="/invoices"
      title="Nouvelle facture"
      initialValues={{
        ...(contractId ? { contractId } : {}),
        status: 'DRAFT',
        invoiceNumber: v4(), // bon faudra changer ça bien sûr
      }}>
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
              <ContractSelect contracts={contracts} loading={contractsLoading} />
            </Form.Item>
          )}
          <Form.Item name="invoiceNumber" label="Numéro de facture">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Date d'échéance"
            rules={[{ required: true, message: "La date d'échéance est requise" }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="totalAmount"
            label="Montant total"
            rules={[{ required: true, message: 'Le montant total est requis' }]}>
            <AmountInput />
          </Form.Item>
          <Form.Item name="status" label="Status de la facture">
            <Input disabled />
          </Form.Item>
        </>
      )}
    </AddModal>
  );
};
export default AddInvoice;
