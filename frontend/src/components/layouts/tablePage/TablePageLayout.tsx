import { useApiData } from "@hooks/useApiData";
import { Spin, Table, type TableProps } from "antd";
import { ConfirmationModal } from "components/common/modal/ConfirmationModal";
import React, { useMemo, useState } from "react";
import { TablePageHeader } from "./TablePageHeader";
import styles from "./TablePageLayout.module.css";

interface TablePageLayoutProps<T extends object>
	extends Omit<TableProps<T>, "title" | "dataSource"> {
	title: string;
	listEndpoint: string;
	deleteEndpoint?: string;
	onAdd?: () => void;
	rowKey?: string;
	extraButtons?: React.ReactNode[];
}

export const TablePageLayout = <T extends object>({
	title,
	listEndpoint,
	deleteEndpoint,
	onAdd,
	rowKey = "id",
	extraButtons = [],
	...tableProps
}: TablePageLayoutProps<T>) => {
	const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
	const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

	const { data, loading, total, pagination, setPagination, refresh } =
		useApiData<T>({
			endpoint: listEndpoint,
		});

	const handleDelete = async () => {
		if (!deleteEndpoint) return;

		try {
			await fetch(deleteEndpoint, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ids: selectedKeys }),
			});
			await refresh();
			setSelectedKeys([]);
		} catch (error) {
			console.error("Delete failed:", error);
		}
	};

	const rowSelection = useMemo(
		() =>
			deleteEndpoint
				? {
						selectedRowKeys: selectedKeys,
						onChange: setSelectedKeys,
					}
				: undefined,
		[deleteEndpoint, selectedKeys],
	);

	return (
		<div className={styles.container}>
			<ConfirmationModal
				visible={deleteConfirmVisible}
				title={`Supprimer ${selectedKeys.length} éléments`}
				content="Êtes-vous sûr de vouloir supprimer ces éléments ? Cette action est irréversible."
				onConfirm={handleDelete}
				onCancel={() => setDeleteConfirmVisible(false)}
			/>

			<TablePageHeader
				title={title}
				onAdd={onAdd}
				onRefresh={refresh}
				onDeleteClick={() => setDeleteConfirmVisible(true)}
				selectedKeysCount={selectedKeys.length}
				loading={loading}
				extraButtons={extraButtons}
				hasDelete={!!deleteEndpoint}
			/>

			<Spin spinning={loading} tip="Chargement...">
				<Table<T>
					{...tableProps}
					dataSource={data}
					rowKey={rowKey}
					rowSelection={rowSelection}
					pagination={{
						current: pagination.page,
						pageSize: pagination.pageSize,
						total,
						showSizeChanger: true,
						onChange: (page, pageSize) => setPagination({ page, pageSize }),
					}}
					className={styles.table}
					scroll={{ y: "calc(100vh - 200px)" }}
					size="middle"
					bordered={false}
				/>
			</Spin>
		</div>
	);
};

export default React.memo(TablePageLayout) as typeof TablePageLayout;
