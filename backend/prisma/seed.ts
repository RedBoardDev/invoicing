import { PrismaClient, ContractChangeType, InvoiceStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// **Enum des variables d'email**
export enum EmailVariable {
  MONTH = 'MONTH',
  YEAR = 'YEAR',
  CURRENT_DATE = 'CURRENT_DATE',
  INVOICE_NUMBER = 'INVOICE_NUMBER',
  TAX_RATE = 'TAX_RATE',
  INVOICE_DATE = 'INVOICE_DATE',
  DUE_DATE = 'DUE_DATE',
  PAYMENT_DELAY = 'PAYMENT_DELAY',
  CLIENT_NAME = 'CLIENT_NAME',
  CONTRACT_PAYMENT_DELAY = 'CONTRACT_PAYMENT_DELAY',
  CONTRACT_TITLE = 'CONTRACT_TITLE',
}

// **Paramètres de configuration (Settings)**
const SETTINGS = {
  // Utilisateur
  USER_EMAIL: 'test@example.com',
  USER_PASSWORD: 'hashedpassword123',

  // Email Templates
  EMAIL_TEMPLATES_COUNT: 10,

  // Clients
  CLIENTS_COUNT: 200,
  CLIENT_EMAILS_MIN: 1,
  CLIENT_EMAILS_MAX: 5,

  // Contrats
  CONTRACTS_MIN_PER_CLIENT: 10,
  CONTRACTS_MAX_PER_CLIENT: 400,
  CONTRACTS_AMOUNT_HT_MIN: 1000,
  CONTRACTS_AMOUNT_HT_MAX: 100000,
  CONTRACTS_TAX_RATE_MIN: 5,
  CONTRACTS_TAX_RATE_MAX: 20,
  CONTRACTS_PAYMENT_DELAY_MIN: 15,
  CONTRACTS_PAYMENT_DELAY_MAX: 90,
  CONTRACTS_START_DATE_YEARS_PAST: 2,
  CONTRACTS_END_DATE_YEARS_FUTURE: 2,
  CONTRACTS_NO_CONTRACT_PROBABILITY: 0.2,
  CONTRACTS_BATCH_SIZE: 5000, // Taille du batch pour les contrats

  // Historique des contrats
  HISTORIES_MIN_PER_CONTRACT: 5,
  HISTORIES_MAX_PER_CONTRACT: 100,
  HISTORIES_NO_HISTORY_PROBABILITY: 0.2,
  HISTORIES_BATCH_SIZE: 5000, // Taille du batch pour les historiques

  // Factures
  INVOICES_MIN_PER_CONTRACT: 10,
  INVOICES_MAX_PER_CONTRACT: 400,
  INVOICES_AMOUNT_HT_MIN: 100,
  INVOICES_AMOUNT_HT_MAX: 10000,
  INVOICES_TAX_RATE_MIN: 5,
  INVOICES_TAX_RATE_MAX: 20,
  INVOICES_PAYMENT_DELAY_MIN: 15,
  INVOICES_PAYMENT_DELAY_MAX: 90,
  INVOICES_DUE_DATE_YEARS_FUTURE: 1,
  INVOICES_SEND_DATE_YEARS_PAST: 1,
  INVOICES_BATCH_SIZE: 5000, // Taille du batch pour les factures
};

// **Fonctions utilitaires**
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement<T>(array: T[]): T {
  if (!array.length) throw new Error('Array is empty');
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomEmails(): string[] {
  const emailCount = getRandomInt(SETTINGS.CLIENT_EMAILS_MIN, SETTINGS.CLIENT_EMAILS_MAX);
  return Array.from({ length: emailCount }).map(() => faker.internet.email());
}

function getRandomElements<T>(array: T[], min: number, max: number): T[] {
  const count = faker.number.int({ min, max });
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// **Fonctions de génération de données**
function generateUser() {
  return {
    email: SETTINGS.USER_EMAIL,
    hashedPassword: SETTINGS.USER_PASSWORD,
  };
}

const SUBJECT_TEMPLATES = [
  `Facture {{INVOICE_NUMBER}} - Échéance {{DUE_DATE}}`,
  `Votre facture du {{MONTH}} {{YEAR}} pour {{CONTRACT_TITLE}}`,
  `Paiement requis pour la facture {{INVOICE_NUMBER}} avant {{DUE_DATE}}`,
  `Notification : Facture {{INVOICE_NUMBER}} émise le {{INVOICE_DATE}}`,
  `{{CLIENT_NAME}} - Facture {{INVOICE_NUMBER}} avec TVA {{TAX_RATE}}%`,
  `Nouvelle facture disponible - {{INVOICE_NUMBER}} ({{CURRENT_DATE}})`,
  `Rappel : Facture {{INVOICE_NUMBER}} due dans {{PAYMENT_DELAY}} jours`,
];

const CONTENT_SEGMENTS = [
  `Bonjour {{CLIENT_NAME}},\n\n`,
  `Nous vous informons que la facture {{INVOICE_NUMBER}} a été émise le {{INVOICE_DATE}}.\n`,
  `Cette facture concerne le contrat "{{CONTRACT_TITLE}}" avec un délai de paiement de {{CONTRACT_PAYMENT_DELAY}} jours.\n`,
  `Le montant total s'élève à ${faker.number.float({ min: 100, max: 10000, fractionDigits: 2 })}€ HT avec une TVA de {{TAX_RATE}}%.\n`,
  `Veuillez effectuer le paiement avant le {{DUE_DATE}} pour éviter tout retard.\n`,
  `La date actuelle est {{CURRENT_DATE}}, et cette facture a été générée pour le mois de {{MONTH}} {{YEAR}}.\n`,
  `Merci de régler dans les {{PAYMENT_DELAY}} jours suivant la réception de cet email.\n`,
  `Pour toute question, contactez-nous en répondant à cet email.\n\nCordialement,\nL'équipe de facturation`,
  `Note : Le délai de paiement standard pour ce contrat est de {{CONTRACT_PAYMENT_DELAY}} jours.\n`,
  `Veuillez trouver ci-joint la facture {{INVOICE_NUMBER}} datée du {{INVOICE_DATE}}.\n`,
];

function generateEmailTemplates(count: number) {
  return Array.from({ length: count }, () => {
    const subject = faker.helpers.arrayElement(SUBJECT_TEMPLATES);
    const contentSegments = getRandomElements(CONTENT_SEGMENTS, 3, 6);
    const content = contentSegments.join('');
    return {
      id: faker.string.uuid(),
      name: faker.lorem.words(3),
      subject,
      content,
    };
  });
}

function generateClients(count: number) {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.company.name(),
    email: generateRandomEmails(),
  }));
}

function generateContractsForClient(clientId: string, emailTemplates: any[], min: number, max: number) {
  const contractCount = Math.random() < SETTINGS.CONTRACTS_NO_CONTRACT_PROBABILITY ? 0 : getRandomInt(min, max);
  return Array.from({ length: contractCount }, () => ({
    id: faker.string.uuid(),
    clientId,
    emailTemplateId: getRandomElement(emailTemplates).id,
    amountHT: faker.number.float({ min: SETTINGS.CONTRACTS_AMOUNT_HT_MIN, max: SETTINGS.CONTRACTS_AMOUNT_HT_MAX, fractionDigits: 2 }),
    taxRate: faker.number.float({ min: SETTINGS.CONTRACTS_TAX_RATE_MIN, max: SETTINGS.CONTRACTS_TAX_RATE_MAX, fractionDigits: 1 }),
    paymentDelay: faker.number.int({ min: SETTINGS.CONTRACTS_PAYMENT_DELAY_MIN, max: SETTINGS.CONTRACTS_PAYMENT_DELAY_MAX }),
    title: faker.lorem.words(5),
    description: Math.random() > 0.5 ? faker.lorem.sentence() : null,
    startDate: faker.date.past({ years: SETTINGS.CONTRACTS_START_DATE_YEARS_PAST }),
    endDate: faker.date.future({ years: SETTINGS.CONTRACTS_END_DATE_YEARS_FUTURE }),
  }));
}

function generateContractHistories(contractId: string, min: number, max: number) {
  const historyCount = Math.random() < SETTINGS.HISTORIES_NO_HISTORY_PROBABILITY ? 0 : getRandomInt(min, max);
  return Array.from({ length: historyCount }, () => ({
    contractId,
    changeType: getRandomElement([
      ContractChangeType.AMOUNTHT_UPDATE,
      ContractChangeType.TAXRATE_UPDATE,
      ContractChangeType.PAYMENT_DELAY_UPDATE,
      ContractChangeType.TITLE_UPDATE,
      ContractChangeType.DESCRIPTION_UPDATE,
      ContractChangeType.STARTDATE_UPDATE,
      ContractChangeType.ENDDATE_UPDATE,
    ]),
    oldValue: Math.random() > 0.5 ? faker.lorem.words(3) : null,
    newValue: Math.random() > 0.5 ? faker.lorem.words(3) : null,
  }));
}

function generateInvoicesForContract(contractId: string, min: number, max: number) {
  const invoiceCount = Math.random() < 0.2 ? 0 : getRandomInt(min, max);
  return Array.from({ length: invoiceCount }, () => ({
    id: faker.string.uuid(),
    contractId,
    invoiceNumber: `INV-${faker.string.alphanumeric(10).toUpperCase()}`,
    amountHT: faker.number.float({ min: SETTINGS.INVOICES_AMOUNT_HT_MIN, max: SETTINGS.INVOICES_AMOUNT_HT_MAX, fractionDigits: 2 }),
    taxRate: faker.number.float({ min: SETTINGS.INVOICES_TAX_RATE_MIN, max: SETTINGS.INVOICES_TAX_RATE_MAX, fractionDigits: 1 }),
    status: InvoiceStatus.DRAFT,
    paymentDelay: faker.number.int({ min: SETTINGS.INVOICES_PAYMENT_DELAY_MIN, max: SETTINGS.INVOICES_PAYMENT_DELAY_MAX }),
    dueDate: Math.random() > 0.5 ? faker.date.future({ years: SETTINGS.INVOICES_DUE_DATE_YEARS_FUTURE }) : null,
    sendDate: Math.random() > 0.5 ? faker.date.past({ years: SETTINGS.INVOICES_SEND_DATE_YEARS_PAST }) : null,
    fileId: Math.random() > 0.5 ? faker.string.uuid() : null,
  }));
}

// **Fonction pour insérer par batches**
async function createInBatches<T>(data: T[], batchSize: number, createFunc: (data: T[]) => Promise<any>) {
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    await createFunc(batch);
    console.info(`Batch inséré : ${Math.min(i + batchSize, data.length)} / ${data.length}`);
  }
}

// **Fonction principale**
async function main() {
  try {
    console.info('Début de la génération des données de test...');

    await prisma.user.create({ data: generateUser() });
    console.info('Utilisateur créé');

    const emailTemplatesData = generateEmailTemplates(SETTINGS.EMAIL_TEMPLATES_COUNT);
    await prisma.emailTemplate.createMany({ data: emailTemplatesData });
    console.info(`${SETTINGS.EMAIL_TEMPLATES_COUNT} modèles d’email créés`);

    const clientsData = generateClients(SETTINGS.CLIENTS_COUNT);
    await prisma.client.createMany({ data: clientsData });
    console.info(`${SETTINGS.CLIENTS_COUNT} clients créés`);

    // Génération et insertion des contrats par batches
    const contractsData: any[] = [];
    for (const client of clientsData) {
      const clientContracts = generateContractsForClient(client.id, emailTemplatesData, SETTINGS.CONTRACTS_MIN_PER_CLIENT, SETTINGS.CONTRACTS_MAX_PER_CLIENT);
      contractsData.push(...clientContracts);
    }
    console.info(`Génération de ${contractsData.length} contrats terminée`);
    await createInBatches(contractsData, SETTINGS.CONTRACTS_BATCH_SIZE, (batch) => prisma.contract.createMany({ data: batch }));
    console.info(`${contractsData.length} contrats insérés`);

    // Génération et insertion des historiques par batches
    const historiesData: any[] = [];
    for (const contract of contractsData) {
      const contractHistories = generateContractHistories(contract.id, SETTINGS.HISTORIES_MIN_PER_CONTRACT, SETTINGS.HISTORIES_MAX_PER_CONTRACT);
      historiesData.push(...contractHistories);
    }
    console.info(`Génération de ${historiesData.length} historiques terminée`);
    await createInBatches(historiesData, SETTINGS.HISTORIES_BATCH_SIZE, (batch) => prisma.contractHistory.createMany({ data: batch }));
    console.info(`${historiesData.length} historiques insérés`);

    // Génération et insertion des factures par batches
    const invoicesData: any[] = [];
    for (const contract of contractsData) {
      const contractInvoices = generateInvoicesForContract(contract.id, SETTINGS.INVOICES_MIN_PER_CONTRACT, SETTINGS.INVOICES_MAX_PER_CONTRACT);
      invoicesData.push(...contractInvoices);
    }
    console.info(`Génération de ${invoicesData.length} factures terminée`);
    await createInBatches(invoicesData, SETTINGS.INVOICES_BATCH_SIZE, (batch) => prisma.invoice.createMany({ data: batch }));
    console.info(`${invoicesData.length} factures insérées`);

    console.info('Données de test créées avec succès.');
  } catch (error) {
    console.error('Erreur lors de la création des données de test :', error);
    process.exit(1);
  } finally {
    console.info('Déconnexion de la base de données...');
    await prisma.$disconnect();
  }
}

// Exécution
main();