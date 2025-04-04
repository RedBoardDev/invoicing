import { EmailVariable } from '@enums/email-enums';
import { ErrorsEnum } from '@enums/errors-enums';
import { HttpStatusCode } from '@enums/http-status-enums';
import ApiError from '@libs/error-management/api-error';

const templateVariableRegex = /{{([A-Za-z0-9]+)}}/g;

const validateTemplateVariables = (input: string): string[] => {
  const invalidKeys = new Set<string>();
  for (const [, key] of input.matchAll(templateVariableRegex)) {
    if (!Object.values(EmailVariable).includes(key as EmailVariable)) {
      invalidKeys.add(key);
    }
  }
  return [...invalidKeys];
};

export const handleVariablesError = (subject?: string, content?: string): void => {
  const invalidKeys = [
    ...new Set([
      ...(subject ? validateTemplateVariables(subject) : []),
      ...(content ? validateTemplateVariables(content) : []),
    ]),
  ];

  if (invalidKeys.length) {
    throw new ApiError('Invalid template variables', HttpStatusCode.badRequest, ErrorsEnum.badRequest, { invalidKeys });
  }
};
