import type { ColumnsType } from "antd/es/table";
import type { ReactNode } from "react";

export interface PaginatedDataViewProps<T> {
	title: string;
	columns: ColumnsType<T>;
	apiUrl: string;
	deleteEndpoint?: string;
	rowKey?: string;
	scrollY?: string | number;
	extraActions?: ReactNode[];
	onAdd?: () => void;
}

export interface PaginatedResponse<T> {
	items: T[];
	total: number;
	page: number;
	pageSize: number;
}

export interface PaginationParams {
	page: number;
	pageSize: number;
	findId?: string;
	includeCount?: boolean;
}
