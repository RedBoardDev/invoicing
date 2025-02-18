import type Client from "@interfaces/clients";
import type Contract from "@interfaces/contract";
import { formatDate } from "@utils";
import { Form, Input } from "antd";
import type { ColumnsType } from "antd/lib/table";
import { AddModal } from "components/common/modal/AddModal";
import TablePageLayout from "components/layouts/tablePage/TablePageLayout";
import { useState } from "react";

const Clients: React.FC = () => {
	const [addModalVisible, setAddModalVisible] = useState(false);

	const columns: ColumnsType<Client> = [
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
			<TablePageLayout<Client>
				title="Clients"
				listEndpoint="/clients"
				additionalQueryParams={{ includeContracts: true }}
				deleteEndpoint="/clients"
				onAdd={() => setAddModalVisible(true)}
				columns={columns}
			/>
			<AddModal<Client>
				visible={addModalVisible}
				onCancel={() => setAddModalVisible(false)}
				onSuccess={() => setAddModalVisible(false)}
				endpoint="/clients"
				title="Nouveau client"
			>
				{() => (
					<Form.Item
						name="name"
						label="Nom du client"
						rules={[{ required: true, message: "Ce champ est obligatoire" }]}
					>
						<Input placeholder="Nom de l'entreprise" />
					</Form.Item>
				)}
			</AddModal>
		</>
	);
};

export default Clients;
