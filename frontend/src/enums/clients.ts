import type Contract from "@enums/contract";

interface Client {
	id: string;
	name: string;
	contracts: Contract[];
	createdAt: string;
	updatedAt: string;
}

export default Client;
