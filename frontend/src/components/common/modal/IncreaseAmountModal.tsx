import type React from 'react';
import { Modal, Form, InputNumber, Input, Typography } from 'antd';
import type Contract from '@interfaces/contract';
import { updateContract } from '@api/services/contracts';
import type { Result, ApiResponse } from '@api/types/fetch';
import { useMessage } from '@hooks/useMessage';

interface IncreaseAmountModalProps {
  visible: boolean;
  onCancel: () => void;
  contract: Contract;
  onSuccess: (newAmountHT: number) => void;
}

const { Text } = Typography;

const IncreaseAmountModal: React.FC<IncreaseAmountModalProps> = ({ visible, onCancel, contract, onSuccess }) => {
  const [form] = Form.useForm();
  const message = useMessage();

  const handleOk = async () => {
    try {
      await form.validateFields();
      const percentage = form.getFieldValue('percentage');
      const newAmountHT =
        percentage !== null && percentage >= 0
          ? contract.amountHT + contract.amountHT * (percentage / 100)
          : contract.amountHT;
      const result: Result<ApiResponse<Contract>> = await updateContract(contract.id, { amountHT: newAmountHT });
      if (!result.success) throw new Error(result.error || 'Erreur lors de la mise à jour');
      onSuccess(newAmountHT);
      message.success(`Montant du contrat augmenté de ${percentage}%`);
      form.resetFields();
    } catch (error) {
      console.error("Erreur lors de l'augmentation:", error);
      message.error("Erreur lors de l'augmentation du montant");
    }
  };

  return (
    <Modal
      title="Augmenter le montant du contrat"
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Appliquer"
      cancelText="Annuler"
      width={600}>
      <Form form={form} layout="vertical">
        <Form.Item label="Montant HT actuel + Augmentation">
          <Input.Group compact>
            <Form.Item noStyle>
              <InputNumber
                value={contract.amountHT}
                disabled
                style={{ width: '40%' }}
                formatter={(value) => `${value?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`}
                parser={(value) => Number(value?.replace(/[^\d,]/g, '').replace(',', '.')) || 0}
              />
            </Form.Item>
            <span style={{ padding: '0 8px', lineHeight: '32px' }}> + </span>
            <Form.Item
              name="percentage"
              noStyle
              rules={[
                { required: true, message: '' },
                { type: 'number', min: 0, message: 'Le pourcentage doit être positif' },
              ]}>
              <InputNumber style={{ width: '25%' }} step={0.1} addonAfter="%" placeholder="%" />
            </Form.Item>
            <span style={{ padding: '0 8px', lineHeight: '32px' }}> = </span>
            <Form.Item shouldUpdate noStyle>
              {({ getFieldValue }) => {
                const percentage = getFieldValue('percentage') || 0;
                const newAmountHT = contract.amountHT + contract.amountHT * (percentage / 100);
                return (
                  <InputNumber
                    value={newAmountHT}
                    disabled
                    style={{ width: '25%' }}
                    formatter={(value) => `${value?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`}
                    parser={(value) => Number(value?.replace(/[^\d,]/g, '').replace(',', '.')) || 0}
                  />
                );
              }}
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <Form.Item label={`Montant TTC (taxe ${contract.taxRate}%)`} shouldUpdate>
          {({ getFieldValue }) => {
            const percentage = getFieldValue('percentage') || 0;
            const newAmountHT = contract.amountHT + contract.amountHT * (percentage / 100);
            const finalAmount = newAmountHT * (1 + contract.taxRate / 100);
            return (
              <InputNumber
                value={finalAmount}
                disabled
                style={{ width: '100%' }}
                formatter={(value) => `${value?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`}
                parser={(value) => Number(value?.replace(/[^\d,]/g, '').replace(',', '.')) || 0}
              />
            );
          }}
        </Form.Item>

        <Text type="secondary">Le nouveau montant HT sera appliqué au contrat après validation.</Text>
      </Form>
    </Modal>
  );
};

export default IncreaseAmountModal;
