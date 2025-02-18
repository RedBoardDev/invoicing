import type Contract from "@enums/contract";
import { formatDate } from "@utils";
import { Form, Input } from "antd";
import type { ColumnsType } from "antd/lib/table";
import { AddModal } from "components/common/modal/AddModal";
import TablePageLayout from "components/layouts/tablePage/TablePageLayout";
import { useState } from "react";

const Contracts: React.FC = () => {
	const [addModalVisible, setAddModalVisible] = useState(false);

	const columns: ColumnsType<Contract> = [
		{
			title: "Nom",
			dataIndex: "name",
			sorter: (a, b) => a.name.localeCompare(b.name),
		},
		{
			title: "Contrats",
			dataIndex: "contracts",
			render: (contracts: Contract[]) => contracts.length,
			sorter: (a, b) => a.contracts.length - b.contracts.length,
		},
		{
			title: "Créé le",
			dataIndex: "createdAt",
			render: (date: string) => formatDate(date, "DD/MM/YYYY"),
			sorter: (a, b) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		},
		{
			title: "Modifié le",
			dataIndex: "updatedAt",
			render: (date: string) => formatDate(date, "DD/MM/YYYY"),
			sorter: (a, b) =>
				new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
		},
	];
	return (
		<>
			<TablePageLayout<Contract>
				title="Contracts"
				listEndpoint="/contracts"
				additionalQueryParams={{ includeContracts: true }}
				deleteEndpoint="/contracts"
				onAdd={() => setAddModalVisible(true)}
				columns={columns}
			/>
			<AddModal<Contract>
				visible={addModalVisible}
				onCancel={() => setAddModalVisible(false)}
				onSuccess={() => setAddModalVisible(false)}
				endpoint="/contracts"
				title="Nouveau contract"
			>
				<Form.Item
					name="name"
					label="Nom du contract"
					rules={[{ required: true, message: "Ce champ est obligatoire" }]}
				>
					<Input placeholder="Nom de l'entreprise" />
				</Form.Item>
			</AddModal>
		</>
	);
};

export default Contracts;
