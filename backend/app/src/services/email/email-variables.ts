import type { EmailVariable, VARIABLES_DEFAULT_VALUES } from '@enums/email-enums';

type VariablesWithDefaults = keyof typeof VARIABLES_DEFAULT_VALUES;
export type RequiredVariables = Exclude<EmailVariable, VariablesWithDefaults>;

export type StrictEmailVariables = Record<RequiredVariables, string> & Partial<Record<EmailVariable, string>>;
