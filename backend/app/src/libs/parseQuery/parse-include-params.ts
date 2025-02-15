import { type IncludeConfigs, IncludeType } from '@libs/parseQuery/types/include';
import { mergeDeep } from '@libs/utils';

export const parseIncludeParams = (
  queryParams: Record<string, unknown> | null,
  includeConfigs: IncludeConfigs,
): Record<string, unknown> => {
  let include: Record<string, unknown> = {};

  if (!queryParams) return include;

  // biome-ignore lint/complexity/noForEach: <explanation>
  Object.entries(includeConfigs).forEach(([key, config]) => {
    const queryParamKey = `include${key.charAt(0).toUpperCase()}${key.slice(1)}`;

    const queryParamValue = queryParams[queryParamKey];

    if (!queryParamValue || queryParamValue === 'false') return;

    switch (config.type) {
      case IncludeType.ID: {
        include[key] = queryParamValue === 'true';
        break;
      }
      case IncludeType.DEFINE: {
        include = mergeDeep(include, config.include);
        break;
      }
      default:
        break;
    }
  });

  return include;
};
