import { Form, InputNumber, Input } from 'antd';
import type React from 'react';
import type Contract from '@interfaces/contract';
import { updateContract } from '@api/services/contracts';
import type { Result, ApiResponse } from '@api/types/fetch';

interface IncreaseAmountInputProps {
  contract: Contract;
  onSuccess: (newAmountHT: number) => void;
}

const IncreaseAmountInput: React.FC<IncreaseAmountInputProps> = ({ contract, onSuccess }) => {
  const [form] = Form.useForm();

  const handleFinish = async (values: { percentage: number }) => {
    const newAmountHT = contract.amountHT + contract.amountHT * (values.percentage / 100);
    const result: Result<ApiResponse<Contract>> = await updateContract(contract.id, { amountHT: newAmountHT });
    if (result.success) {
      onSuccess(newAmountHT);
      form.resetFields();
    } else {
      console.error('Erreur lors de la mise à jour:', result.error);
    }
  };

  return (
    <Form form={form} onFinish={handleFinish} layout="vertical">
      <Input.Group compact>
        <Form.Item noStyle>
          <InputNumber
            value={contract.amountHT}
            disabled
            step={0.01}
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
          <InputNumber step={0.1} style={{ width: '25%' }} placeholder="%" addonAfter="%" />
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
      <Form.Item shouldUpdate noStyle>
        {({ getFieldValue }) => {
          const percentage = getFieldValue('percentage') || 0;
          const newAmountHT = contract.amountHT + contract.amountHT * (percentage / 100);
          const finalAmount = newAmountHT * (1 + contract.taxRate / 100);
          return (
            <Input
              value={`Montant TTC (taxe ${contract.taxRate}%) : ${finalAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`}
              disabled
              style={{ marginTop: 16, width: '100%' }}
            />
          );
        }}
      </Form.Item>
    </Form>
  );
};

export default IncreaseAmountInput;
