import { Form, Input, InputNumber } from 'antd';
import type React from 'react';

const AmountInput: React.FC = () => (
  <Input.Group compact>
    <Form.Item name="amountHT" noStyle rules={[{ required: true, message: 'Montant HT requis' }]}>
      <InputNumber min={0} style={{ width: '40%' }} placeholder="HT" />
    </Form.Item>
    <span style={{ padding: '0 8px', lineHeight: '32px' }}> + </span>
    <Form.Item name="taxRate" noStyle initialValue={20}>
      <InputNumber min={0} style={{ width: '25%' }} placeholder="TVA" addonAfter="%" className="square-input-number" />
    </Form.Item>
    <span style={{ padding: '0 8px', lineHeight: '32px' }}> = </span>
    <Form.Item shouldUpdate noStyle>
      {({ getFieldValue }) => {
        const amountHT = getFieldValue('amountHT') || 0;
        const taxRate = getFieldValue('taxRate') || 0;
        const amountTTC = amountHT * (1 + taxRate / 100);
        return <InputNumber style={{ width: '25%' }} value={amountTTC} disabled formatter={(value) => `€ ${value}`} />;
      }}
    </Form.Item>
  </Input.Group>
);

export default AmountInput;
