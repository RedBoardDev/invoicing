import { useCallback, useEffect, useState } from 'react';
import type Contract from '@interfaces/contract';
import type { FormInstance } from 'antd';
import dayjs from 'dayjs';
import type { useMessage } from '@hooks/useMessage';

interface ContractsResponse {
  data: Contract[];
}

interface InvoiceNumberResponse {
  invoiceNumber: string;
}

interface InvoiceData {
  contracts: Contract[];
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
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [contractsLoading, setContractsLoading] = useState(false);
  const [invoiceNumberLoading, setInvoiceNumberLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setContractsLoading(true);
    setInvoiceNumberLoading(true);

    try {
      const [contractsResponse, numberResponse] = await Promise.all([
        fetch('http://localhost:3000/contracts?includeClient=true'),
        fetch('http://localhost:3000/invoices/preview-number'),
      ]);

      if (!contractsResponse.ok) throw new Error('Failed to fetch contracts');
      if (!numberResponse.ok) throw new Error('Failed to fetch invoice number');

      const contractsData = (await contractsResponse.json()) as ContractsResponse;
      const numberData = (await numberResponse.json()) as InvoiceNumberResponse;

      setContracts(contractsData.data);
      setInvoiceNumber(numberData.invoiceNumber);

      if (contractId) {
        const selectedContract = contractsData.data.find((c) => c.id === contractId);
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
