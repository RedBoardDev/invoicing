export enum FilterType {
  ENUM = 0,
  DATE = 1,
  ID = 2,
  IDS = 3,
  INNER_ID = 4,
}

interface FilterConfigEnum {
  type: FilterType.ENUM;
  enum: Record<string, unknown>;
}

interface FilterConfigId {
  type: FilterType.ID;
}

interface FilterConfigIds {
  type: FilterType.IDS;
}

interface FilterConfigInnerId {
  type: FilterType.INNER_ID;
  innerTable: string;
}

interface FilterConfigDate {
  type: FilterType.DATE;
}

type FilterConfig = FilterConfigEnum | FilterConfigIds | FilterConfigDate | FilterConfigId | FilterConfigInnerId;

export interface FilterConfigs {
  [key: string]: FilterConfig;
}
