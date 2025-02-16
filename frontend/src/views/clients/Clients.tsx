import { ExportOutlined } from "@ant-design/icons";
import type Client from "@enums/clients";
import type Contract from "@enums/contract";
import { formatDate } from "@utils";
import { Button } from "antd";
import type { ColumnsType } from "antd/lib/table";
import TablePageLayout from "components/layouts/tablePage/TablePageLayout";

const Clients: React.FC = () => {
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
		<TablePageLayout<Client>
			title="Clients"
			listEndpoint="/clients"
			additionalQueryParams={{ includeContracts: true }}
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
