export enum IncludeType {
  ID = 0,
  DEFINE = 1,
}

interface IncludeConfigId {
  type: IncludeType.ID;
}

interface IncludeConfigDefine {
  type: IncludeType.DEFINE;
  include: object;
}

type IncludeConfig = IncludeConfigId | IncludeConfigDefine;

export interface IncludeConfigs {
  [key: string]: IncludeConfig;
}
