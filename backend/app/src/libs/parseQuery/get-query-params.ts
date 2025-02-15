import { IncludeConfigs } from './types/include';
import { FilterConfigs, FilterType } from './types/filter';

interface queryParams {
  [key: string]: unknown;
}

export const getFilterParams = (filterConfigs: FilterConfigs): queryParams => {
  const out: queryParams = {};
  Object.keys(filterConfigs).forEach((key) => {
    switch (filterConfigs[key].type) {
      case FilterType.ENUM:
        out[`filter${key.charAt(0).toUpperCase()}${key.slice(1)}`] = false;
        break;
      case FilterType.DATE:
        out[`filter${key.charAt(0).toUpperCase()}${key.slice(1)}`] = false;
        break;
      case FilterType.ID:
        out[`filter${key.charAt(0).toUpperCase()}${key.slice(1)}`] = false;
        break;
      case FilterType.IDS:
        out[`filter${key.charAt(0).toUpperCase()}${key.slice(1)}`] = false;
        break;
      case FilterType.INNER_ID:
        out[`filter${key.charAt(0).toUpperCase()}${key.slice(1)}`] = false;
        break;
      default:
        break;
    }
  });
  return out;
};

export const getFilterParamsDocs = (filterConfigs: FilterConfigs): unknown => {
  // eslint-disable-next-line consistent-return, array-callback-return
  const out = Object.keys(filterConfigs).map((key) => {
    switch (filterConfigs[key].type) {
      case FilterType.ENUM:
        return {
          name: `filter${key.charAt(0).toUpperCase()}${key.slice(1)}`,
          required: false,
        };
      case FilterType.DATE:
        return {
          name: `filter${key.charAt(0).toUpperCase()}${key.slice(1)}`,
          required: false,
        };
      case FilterType.ID:
        return {
          name: `filter${key.charAt(0).toUpperCase()}${key.slice(1)}`,
          required: false,
        };
      case FilterType.IDS:
        return {
          name: `filter${key.charAt(0).toUpperCase()}${key.slice(1)}`,
          required: false,
        };
      case FilterType.INNER_ID:
        return {
          name: `filter${key.charAt(0).toUpperCase()}${key.slice(1)}`,
          required: false,
        };
      default:
        break;
    }
  });
  return out;
};

export const getIncludeParams = (includeConfigs: IncludeConfigs): queryParams => {
  const out: queryParams = {};
  Object.keys(includeConfigs).forEach((key) => {
    out[`include${key.charAt(0).toUpperCase()}${key.slice(1)}`] = false;
  });
  return out;
};

export const getIncludeParamsDocs = (includeConfigs: IncludeConfigs): unknown => {
  const out = Object.keys(includeConfigs).map((key) => ({
    name: `include${key.charAt(0).toUpperCase()}${key.slice(1)}`,
    required: false,
  }));
  return out;
};

export const paginationParams = [
  {
    name: 'page',
    description: 'Page number',
    required: false,
  },
  {
    name: 'pageSize',
    description: 'Page size',
    required: false,
  },
  {
    name: 'includeTotalCount',
    description: 'Include total count',
    required: false,
  },
];

export const imagesParams = { name: 'includeImgs', required: false };
export const imageParams = { name: 'includeImg', required: false };
