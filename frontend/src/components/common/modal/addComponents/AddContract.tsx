import { useCallback, useEffect, useState } from 'react';
import type Contract from '@interfaces/contract';
import { Col, DatePicker, Form, Input, Row } from 'antd';
import { AddModal } from 'components/common/modal/AddModal';
import ClientSelect from 'components/dataEntry/ClientSelect';
import dayjs, { type Dayjs } from 'dayjs';
import type React from 'react';
import type Client from '@interfaces/clients';
import AmountInput from 'components/dataEntry/AmountInput';

interface AddContractProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddContract: React.FC<AddContractProps> = ({ visible, setVisible }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      setClientsLoading(true);
      try {
        const response = await fetch('http://localhost:3000/clients');
        const data = await response.json();
        setClients(data.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setClientsLoading(false);
      }
    };

    if (visible) fetchClients();
  }, [visible]);

  const handleAddSuccess = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  return (
    <AddModal<Contract>
      visible={visible}
      onCancel={() => setVisible(false)}
      onSuccess={handleAddSuccess}
      endpoint="/contracts"
      title="Nouveau contrat">
      {(form) => (
        <>
          <Form.Item name="clientId" label="Client" rules={[{ required: true, message: 'Sélectionnez un client' }]}>
            <ClientSelect clients={clients} loading={clientsLoading} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Date de début"
                rules={[{ required: true, message: 'Date de début requise' }]}
                initialValue={dayjs()}>
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={(current) => {
                    const endDate = form.getFieldValue('endDate') as Dayjs;
                    return endDate ? current > endDate : false;
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="Date de fin"
                rules={[{ required: true, message: 'Date de fin requise' }]}>
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={(current) => {
                    const startDate = form.getFieldValue('startDate') as Dayjs;
                    return startDate ? current < startDate : false;
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Montant">
            <AmountInput />
          </Form.Item>

          <Form.Item
            name="paymentDelay"
            label="Délai de paiement"
            rules={[{ required: true, message: 'Délai paiement requis' }]}
            initialValue={120}>
            <Input type="number" addonAfter="jours" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Description requise' }]}>
            <Input.TextArea rows={4} placeholder="Description du contrat" />
          </Form.Item>
        </>
      )}
    </AddModal>
  );
};

export default AddContract;
