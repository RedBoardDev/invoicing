import { useCallback, useEffect, useState } from 'react';
import type Contract from '@interfaces/contract';
import type { FormInstance } from 'antd';
import dayjs from 'dayjs';
import type { useMessage } from '@hooks/useMessage';
import type { WithExtends } from '@api/types/extends';
import { getContracts } from '@api/services/contracts';

interface InvoiceData {
  contracts: Array<WithExtends<Contract, 'client'>>;
  contractsLoading: boolean;
}

const useInvoiceData = (
  visible: boolean,
  contractId: string | undefined,
  form: FormInstance,
  messageApi: ReturnType<typeof useMessage>,
): InvoiceData => {
  const [contracts, setContracts] = useState<Array<WithExtends<Contract, 'client'>>>([]);
  const [contractsLoading, setContractsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setContractsLoading(true);

    try {
      const contractsResult = await getContracts<'client'>(['client']);

      if (!contractsResult.success) throw new Error(contractsResult.error || 'Failed to fetch contracts');

      setContracts(contractsResult.data.data);

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
    }
  }, [contractId, form, messageApi]);

  useEffect(() => {
    if (visible) {
      fetchData();
    } else {
      setContracts([]);
      form.resetFields();
    }
  }, [visible, fetchData, form]);

  return { contracts, contractsLoading };
};

export default useInvoiceData;
