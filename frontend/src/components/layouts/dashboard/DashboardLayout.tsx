import { Layout, Menu, Typography } from "antd";
import type React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import styles from "./DashboardLayout.module.css";

const { Sider, Content } = Layout;
const { Title } = Typography;

const DashboardLayout: React.FC = () => {
	const location = useLocation();

	// Définir les éléments du menu
	const menuItems = [
		{ key: "dashboard", label: "Tableau de bord", path: "/" },
		{ key: "clients", label: "Clients", path: "/clients" },
		{ key: "invoices", label: "Factures", path: "/invoices" },
		{ key: "contracts", label: "Contrats", path: "/contracts" },
		{ key: "settings", label: "Paramètres", path: "/settings" },
	];

	return (
		<Layout className={styles.layout}>
			{/* Sidebar */}
			<Sider width={250} className={styles.sider}>
				<Title level={4} className={styles.title}>
					Gestion de facturation
				</Title>
				<Menu
					mode="inline"
					selectedKeys={[location.pathname]}
					className={styles.menu}
				>
					{menuItems.map((item) => (
						<Menu.Item key={item.path}>
							<Link to={item.path}>{item.label}</Link>
						</Menu.Item>
					))}
				</Menu>
			</Sider>

			{/* Contenu principal */}
			<Layout className={styles.contentLayout}>
				<Content className={styles.content}>
					<Outlet /> {/* Ici s'affiche le contenu des routes */}
				</Content>
			</Layout>
		</Layout>
	);
};

export default DashboardLayout;
