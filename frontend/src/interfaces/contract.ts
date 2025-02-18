interface Contract {
  id: string;
  clientId: string;
  amountHT: string;
  taxRate: string;
  paymentDelayDays: number;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export default Contract;
