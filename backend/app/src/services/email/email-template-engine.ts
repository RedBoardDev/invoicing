import { type EmailVariable, VARIABLES_DEFAULT_VALUES, VARIABLES_METADATA } from '@enums/email-enums';
import { ErrorsEnum } from '@enums/errors-enums';
import ApiError from '@libs/error-management/api-error';
import type { StrictEmailVariables } from './email-variables';

export function processEmailTemplate(template: string, userVariables: StrictEmailVariables): string {
  const finalVariables: Record<EmailVariable, string> = {} as Record<EmailVariable, string>;

  for (const key of Object.keys(VARIABLES_DEFAULT_VALUES) as EmailVariable[]) {
    finalVariables[key] = (VARIABLES_DEFAULT_VALUES as Record<EmailVariable, () => string>)[key]();
  }

  for (const key of Object.keys(userVariables) as EmailVariable[]) {
    finalVariables[key] = userVariables[key]!;
  }

  const missingVariables: EmailVariable[] = [];
  const allowedVariables = Object.keys(VARIABLES_METADATA) as EmailVariable[];

  const processed = template.replace(/\{\{(\w+)\}\}/g, (_, key: EmailVariable) => {
    if (!allowedVariables.includes(key)) {
      throw new ApiError(`Variable non autorisée : ${key}`, 400, ErrorsEnum.badRequest);
    }

    const value = finalVariables[key];
    if (!value && !(key in VARIABLES_DEFAULT_VALUES)) {
      missingVariables.push(key);
    }

    return value ?? '';
  });

  if (missingVariables.length > 0) {
    throw new ApiError(
      `Variables obligatoires manquantes : ${missingVariables.join(', ')}`,
      400,
      ErrorsEnum.badRequest,
    );
  }

  return processed;
}
