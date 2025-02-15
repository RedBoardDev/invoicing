import { Spin, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import styles from "./Clients.module.css";

const { Title } = Typography;

interface Client {
	key: string;
	name: string;
	contractsNumber: number;
	createdAt: string;
	updatedAt: string;
	invoiceNumber: number;
}

// Génère des données factices pour une "page"
const generateFakeData = (page: number, pageSize = 30) => {
	return Array.from({ length: pageSize }, (_, i) => ({
		key: `${page}-${i}`,
		name: `Client ${page * pageSize + i + 1}`,
		contractsNumber: Math.floor(Math.random() * 10),
		createdAt: new Date(
			Date.now() - Math.floor(Math.random() * 10000000000),
		).toLocaleDateString(),
		updatedAt: new Date(
			Date.now() - Math.floor(Math.random() * 10000000000),
		).toLocaleDateString(),
		invoiceNumber: Math.floor(Math.random() * 20),
	}));
};
const columns: ColumnsType<Client> = [
	{
		title: "Nom",
		dataIndex: "name",
		key: "name",
		sorter: (a, b) => a.name.localeCompare(b.name),
	},
	{
		title: "Nombre de contrats",
		dataIndex: "contractsNumber",
		key: "contractsNumber",
		sorter: (a, b) => a.contractsNumber - b.contractsNumber,
	},
	{
		title: "Créé le",
		dataIndex: "createdAt",
		key: "createdAt",
		sorter: (a, b) =>
			new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
	},
	{
		title: "Mis à jour le",
		dataIndex: "updatedAt",
		key: "updatedAt",
		sorter: (a, b) =>
			new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
	},
];
const Clients: React.FC = () => {
	const [dataSource, setDataSource] = useState<Client[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);

	// Charge les données initiales
	useEffect(() => {
		setLoading(true);
		setTimeout(() => {
			setDataSource(generateFakeData(1));
			setLoading(false);
		}, 500);
	}, []);

	// Charge plus de données quand la page change
	const loadMoreData = useCallback(() => {
		setLoading(true);
		setTimeout(() => {
			setDataSource((prev) => [...prev, ...generateFakeData(page)]);
			setLoading(false);
		}, 1000);
	}, [page]);

	// Gère le scroll
	const handleScroll = useCallback(
		(e: React.UIEvent<HTMLDivElement>) => {
			const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
			const isBottom = scrollHeight - scrollTop === clientHeight;

			if (isBottom && !loading) {
				setPage((prev) => prev + 1);
				loadMoreData();
			}
		},
		[loading, loadMoreData],
	);

	return (
		<div className={styles.container}>
			<Title level={2} className={styles.title}>
				Clients
			</Title>
			<Spin spinning={loading}>
				<Table
					columns={columns} // Vos colonnes existantes
					dataSource={dataSource}
					pagination={false}
					className={styles.table}
					onScroll={handleScroll}
					scroll={{ y: "calc(100vh - 200px)" }} // Ajustez la hauteur selon votre layout
				/>
			</Spin>
		</div>
	);
};

export default Clients;
