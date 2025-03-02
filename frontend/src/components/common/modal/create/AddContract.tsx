import { useCallback } from 'react';
import type Contract from '@interfaces/contract';
import { Col, DatePicker, Form, Input, InputNumber, Row } from 'antd';
import { AddModal } from 'components/common/modal/create/component/AddModal';
import ClientSelect from 'components/dataEntry/ClientSelect';
import dayjs, { type Dayjs } from 'dayjs';
import type React from 'react';
import AmountInput from 'components/dataEntry/AmountInput';
import EmailTemplateSelect from 'components/dataEntry/EmailTemplateSelect';
import { createContract } from '@api/services/contracts';

interface AddContractProps {
  clientId?: string | undefined;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
}

const AddContract: React.FC<AddContractProps> = ({ clientId, visible, setVisible, onSuccess }) => {
  const handleAddSuccess = useCallback(() => {
    setVisible(false);
    onSuccess?.();
  }, [setVisible, onSuccess]);

  return (
    <AddModal<Contract>
      visible={visible}
      onCancel={() => setVisible(false)}
      onSuccess={handleAddSuccess}
      title="Nouveau contrat"
      createService={createContract}
      initialValues={clientId ? { clientId } : undefined}>
      {(form) => (
        <>
          {clientId ? (
            <Form.Item name="clientId" hidden>
              <Input type="hidden" />
            </Form.Item>
          ) : (
            <Form.Item name="clientId" label="Client" rules={[{ required: true, message: 'Sélectionnez un client' }]}>
              <ClientSelect />
            </Form.Item>
          )}

          <Form.Item
            name="emailTemplateId"
            label="Template de l'email"
            rules={[{ required: true, message: 'Sélectionnez un template' }]}>
            <EmailTemplateSelect />
          </Form.Item>

          <Form.Item name="title" label="Titre" rules={[{ required: true, message: 'Titre requis' }]}>
            <Input placeholder="Titre du contrat" />
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
            <InputNumber style={{ width: '40%' }} suffix="jours" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} placeholder="Description du contrat" />
          </Form.Item>
        </>
      )}
    </AddModal>
  );
};

export default AddContract;
