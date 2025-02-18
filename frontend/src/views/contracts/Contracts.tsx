import type Client from "@interfaces/clients";
import type Contract from "@interfaces/contract";
import { formatDate } from "@utils";
import { Col, DatePicker, Form, Input, InputNumber, Row } from "antd";
import type { ColumnsType } from "antd/es/table";
import { AddModal } from "components/common/modal/AddModal";
import ClientSelect from "components/dataEntry/ClientSelect";
import TablePageLayout from "components/layouts/tablePage/TablePageLayout";
import dayjs, { type Dayjs } from "dayjs";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

const AmountInput: React.FC = () => (
	<Input.Group compact>
		<Form.Item
			name="amountHT"
			noStyle
			rules={[{ required: true, message: "Montant HT requis" }]}
		>
			<InputNumber min={0} style={{ width: "40%" }} placeholder="HT" />
		</Form.Item>
		<span style={{ padding: "0 8px", lineHeight: "32px" }}> + </span>
		<Form.Item name="taxRate" noStyle initialValue={20}>
			<InputNumber
				min={0}
				style={{ width: "25%" }}
				placeholder="TVA"
				addonAfter="%"
				className="square-input-number"
			/>
		</Form.Item>
		<span style={{ padding: "0 8px", lineHeight: "32px" }}> = </span>
		<Form.Item shouldUpdate noStyle>
			{({ getFieldValue }) => {
				const amountHT = getFieldValue("amountHT") || 0;
				const taxRate = getFieldValue("taxRate") || 0;
				const amountTTC = amountHT * (1 + taxRate / 100);
				return (
					<InputNumber
						style={{ width: "25%" }}
						value={amountTTC}
						disabled
						formatter={(value) => `€ ${value}`}
					/>
				);
			}}
		</Form.Item>
	</Input.Group>
);

const Contracts: React.FC = () => {
	const [addModalVisible, setAddModalVisible] = useState(false);
	const [clients, setClients] = useState<Client[]>([]);
	const [clientsLoading, setClientsLoading] = useState(false);

	useEffect(() => {
		const fetchClients = async () => {
			setClientsLoading(true);
			try {
				const response = await fetch("http://localhost:3000/clients");
				const data = await response.json();
				setClients(data.data);
			} catch (error) {
				console.error("Error fetching clients:", error);
			} finally {
				setClientsLoading(false);
			}
		};

		fetchClients();
	}, []);

	const clientsMap = useMemo(
		() => new Map(clients.map((c) => [c.id, c.name])),
		[clients],
	);

	const columns: ColumnsType<Contract> = useMemo(
		() => [
			{
				title: "Client",
				dataIndex: "clientId",
				render: (clientId: string) => clientsMap.get(clientId) || "N/A",
				sorter: (a, b) => {
					const nameA = clientsMap.get(a.clientId) || "";
					const nameB = clientsMap.get(b.clientId) || "";
					return nameA.localeCompare(nameB);
				},
			},
			{
				title: "Début",
				dataIndex: "startDate",
				render: (date: string) => formatDate(date, "DD/MM/YYYY"),
				sorter: (a, b) =>
					new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
			},
			{
				title: "Fin",
				dataIndex: "endDate",
				render: (date: string) => formatDate(date, "DD/MM/YYYY"),
				sorter: (a, b) =>
					new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
			},
			{
				title: "Montant HT",
				dataIndex: "amountHT",
				render: (value: string) => `€${Number.parseFloat(value).toFixed(2)}`,
				sorter: (a, b) =>
					Number.parseFloat(a.amountHT) - Number.parseFloat(b.amountHT),
			},
			{
				title: "Taux de taxe",
				dataIndex: "taxRate",
				render: (value: string) => `€${Number.parseFloat(value).toFixed(2)}`,
				sorter: (a, b) =>
					Number.parseFloat(a.taxRate) - Number.parseFloat(b.taxRate),
			},
			{
				title: "Délai paiement",
				dataIndex: "paymentDelay",
				render: (days: number) => `${days} jours`,
				sorter: (a, b) => a.paymentDelayDays - b.paymentDelayDays,
			},
			{
				title: "Créé le",
				dataIndex: "createdAt",
				render: (date: string) => formatDate(date, "DD/MM/YYYY"),
				sorter: (a, b) =>
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
			},
		],
		[clientsMap],
	);

	const handleAddSuccess = useCallback(() => {
		setAddModalVisible(false);
	}, []);

	return (
		<>
			<TablePageLayout<Contract>
				title="Contrats"
				listEndpoint="/contracts"
				deleteEndpoint="/contracts"
				onAdd={() => setAddModalVisible(true)}
				columns={columns}
				additionalQueryParams={{}}
			/>

			<AddModal<Contract>
				visible={addModalVisible}
				onCancel={() => setAddModalVisible(false)}
				onSuccess={handleAddSuccess}
				endpoint="/contracts"
				title="Nouveau contrat"
			>
				{(form) => (
					<>
						<Form.Item
							name="clientId"
							label="Client"
							rules={[{ required: true, message: "Sélectionnez un client" }]}
						>
							<ClientSelect clients={clients} loading={clientsLoading} />
						</Form.Item>

						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									name="startDate"
									label="Date de début"
									rules={[{ required: true, message: "Date de début requise" }]}
									initialValue={dayjs()}
								>
									<DatePicker
										style={{ width: "100%" }}
										disabledDate={(current) => {
											const endDate = form.getFieldValue("endDate") as Dayjs;
											return endDate ? current > endDate : false;
										}}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name="endDate"
									label="Date de fin"
									rules={[{ required: true, message: "Date de fin requise" }]}
								>
									<DatePicker
										style={{ width: "100%" }}
										disabledDate={(current) => {
											const startDate = form.getFieldValue(
												"startDate",
											) as Dayjs;
											return startDate ? current < startDate : false;
										}}
									/>
								</Form.Item>
							</Col>
						</Row>

						<Form.Item label="Montant">
							<AmountInput />
						</Form.Item>

						<Form.Item
							name="paymentDelay"
							label="Délai de paiement"
							rules={[{ required: true, message: "Délai paiement requis" }]}
							initialValue={120}
						>
							<Input type="number" addonAfter="jours" />
						</Form.Item>

						<Form.Item
							name="description"
							label="Description"
							rules={[{ required: true, message: "Description requise" }]}
						>
							<Input.TextArea rows={4} placeholder="Description du contrat" />
						</Form.Item>
					</>
				)}
			</AddModal>
		</>
	);
};

export default Contracts;
