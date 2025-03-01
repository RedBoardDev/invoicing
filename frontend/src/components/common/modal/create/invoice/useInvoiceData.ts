import { useCallback, useEffect, useState } from 'react';
import type Contract from '@interfaces/contract';
import type { FormInstance } from 'antd';
import dayjs from 'dayjs';
import type { useMessage } from '@hooks/useMessage';
import type { WithExtends } from '@api/types/extends';
import { getContracts } from '@api/services/contracts';
import { getNextInvoiceNumber } from '@api/services/invoices';

interface InvoiceData {
  contracts: Array<WithExtends<Contract, 'client'>>;
  invoiceNumber: string | null;
  contractsLoading: boolean;
  invoiceNumberLoading: boolean;
}

const useInvoiceData = (
  visible: boolean,
  contractId: string | undefined,
  form: FormInstance,
  messageApi: ReturnType<typeof useMessage>,
): InvoiceData => {
  const [contracts, setContracts] = useState<Array<WithExtends<Contract, 'client'>>>([]);
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [contractsLoading, setContractsLoading] = useState(false);
  const [invoiceNumberLoading, setInvoiceNumberLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setContractsLoading(true);
    setInvoiceNumberLoading(true);

    try {
      const [contractsResult, numberResult] = await Promise.all([
        getContracts<'client'>(['client']),
        getNextInvoiceNumber(),
      ]);

      if (!contractsResult.success) throw new Error(contractsResult.error || 'Failed to fetch contracts');
      if (!numberResult.success) throw new Error(numberResult.error || 'Failed to fetch invoice number');

      setContracts(contractsResult.data.data);
      setInvoiceNumber(numberResult.data.data.invoiceNumber);

      if (contractId) {
        const selectedContract = contractsResult.data.data.find((c) => c.id === contractId);
        if (selectedContract) {
          const dueDate = dayjs().add(selectedContract.paymentDelay, 'day').toDate();
          form.setFieldsValue({
            amountHT: selectedContract.amountHT,
            taxRate: selectedContract.taxRate,
            dueDate,
          });
        } else {
          messageApi?.warning(`Le contrat n'a pas été trouvé`);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      messageApi?.error('Erreur lors du chargement');
    } finally {
      setContractsLoading(false);
      setInvoiceNumberLoading(false);
    }
  }, [contractId, form, messageApi]);

  useEffect(() => {
    if (visible) {
      fetchData();
    } else {
      setContracts([]);
      setInvoiceNumber(null);
      form.resetFields();
    }
  }, [visible, fetchData, form]);

  return { contracts, invoiceNumber, contractsLoading, invoiceNumberLoading };
};

export default useInvoiceData;
