import { useMessage } from "@hooks/useMessage";
import { Form, Modal } from "antd";
import type React from "react";
import { useState } from "react";

interface AddModalProps<T = unknown> {
	visible: boolean;
	onCancel: () => void;
	onSuccess: () => void;
	endpoint: string;
	title: string;
	initialValues?: Partial<T>;
	children: React.ReactNode;
}

export const AddModal = <T extends object>({
	visible,
	onCancel,
	onSuccess,
	endpoint,
	title,
	initialValues,
	children,
}: AddModalProps<T>) => {
	const [form] = Form.useForm<T>();
	const [loading, setLoading] = useState(false);
	const messageApi = useMessage();

	const handleSubmit = async (values: T) => {
		setLoading(true);
		try {
			const response = await fetch(`http://localhost:3000${endpoint}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			if (!response.ok) throw new Error(response.statusText);

			messageApi.success("Création réussie");
			form.resetFields();
			onSuccess();
		} catch (error) {
			console.error("Creation failed:", error);
			messageApi.error("Erreur lors de la création");
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		form.resetFields();
		onCancel();
	};

	return (
		<Modal
			title={title}
			open={visible}
			onCancel={handleCancel}
			onOk={() => form.submit()}
			confirmLoading={loading}
			cancelButtonProps={{ disabled: loading }}
		>
			<Form
				form={form}
				layout="vertical"
				initialValues={initialValues}
				onFinish={handleSubmit}
			>
				{children}
			</Form>
		</Modal>
	);
};
