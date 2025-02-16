import { ExportOutlined } from "@ant-design/icons";
import { Button } from "antd";
import type { ColumnsType } from "antd/lib/table";
import TablePageLayout from "components/layouts/tablePage/TablePageLayout";

interface Client {
	id: string;
	name: string;
	contractsCount: number;
	createdAt: string;
	updatedAt: string;
}

const Clients: React.FC = () => {
	const columns: ColumnsType<Client> = [
		{
			title: "Nom",
			dataIndex: "name",
			sorter: (a, b) => a.name.localeCompare(b.name),
		},
		{
			title: "Contrats",
			dataIndex: "contractsCount",
			sorter: (a, b) => a.contractsCount - b.contractsCount,
		},
		{
			title: "Créé le",
			dataIndex: "createdAt",
			sorter: (a, b) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		},
		{
			title: "Modifié le",
			dataIndex: "updatedAt",
			sorter: (a, b) =>
				new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
		},
	];

	return (
		<TablePageLayout<Client>
			title="Clients"
			listEndpoint="/clients"
			deleteEndpoint="/clients"
			onAdd={() => console.log("Add client")}
			columns={columns}
			extraButtons={[
				<Button key="export" icon={<ExportOutlined />}>
					Exporter
				</Button>,
			]}
		/>
	);
};

export default Clients;
