export interface ExtendsConfig {
  include?: Record<string, boolean | { include: Record<string, boolean> }>;
  computed?: boolean;
}

export type ExtendsMap = Record<string, ExtendsConfig>;

export interface ExtendsResult {
  includes: Record<string, boolean | { include: Record<string, boolean> }>;
  computed: string[];
}

export type WithExtends<T> = T & {
  [key: string]: any;
};
