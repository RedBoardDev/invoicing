import { Modal } from "antd";
import type React from "react";

interface ConfirmationModalProps {
	visible: boolean;
	title: string;
	content: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	visible,
	title,
	content,
	onConfirm,
	onCancel,
}) => (
	<Modal
		title={title}
		open={visible}
		onOk={onConfirm}
		onCancel={onCancel}
		okText="Confirmer"
		cancelText="Annuler"
		okButtonProps={{ danger: true }}
	>
		<p>{content}</p>
	</Modal>
);
