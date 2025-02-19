import { Form, Modal, Button } from 'antd';
import useEdit from './useEdit';
import type { EditManagerProps } from './types';
import { EditOutlined } from '@ant-design/icons';

const EditManager = <T extends object>({ data, configs, editEndpoint, onSuccess, onError }: EditManagerProps<T>) => {
  const { form, isEditing, isSubmitting, handleOpen, handleClose, handleSubmit } = useEdit<T>({
    data,
    editEndpoint,
    onSuccess,
    onError,
  });

  return (
    <>
      <Modal
        title="Modifier"
        open={isEditing}
        onCancel={handleClose}
        onOk={form.submit}
        confirmLoading={isSubmitting}
        destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {configs.map(({ key, label, rules, renderInput }, index) => (
            <Form.Item
              key={`${String(key)}-${index}`}
              name={key as string}
              label={label}
              rules={rules}
              validateTrigger={['onChange', 'onBlur']}>
              {renderInput()}
            </Form.Item>
          ))}
        </Form>
      </Modal>

      <Button icon={<EditOutlined />} onClick={handleOpen} disabled={!data} />
    </>
  );
};

export default EditManager;
