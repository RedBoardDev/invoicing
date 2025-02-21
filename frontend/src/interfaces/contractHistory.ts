import Contract from "@interfaces/contract";

export interface ContractHistory {
  id: number;
  contractId: string;
  contract: Contract;
  changeType: string;
  data: any;
  createdAt: Date;
}
