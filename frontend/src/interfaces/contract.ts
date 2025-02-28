interface Contract {
  id: string;
  clientId: string;
  amountHT: number;
  taxRate: number;
  paymentDelay: number;
  title: string;
  description: string;
  emailTemplateId: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export default Contract;
