export const enum ScalarType {
  int,
  unsignedInt,
  long,
  unsignedLong,
  float,
  double,
  decimal,
  dateTime,
  time,
  date,
  gYearMonth,
  gYear,
  gMonth,
  gDay,
  yearMonthDuration,
  dayTimeDuration,
  string,
  anyURI
}

export interface RangeIndexedOptions {
  collation?: string
  scalarType?: ScalarType
  path?: string
  name: string
}

export interface GeoIndexedOptions {
  name: string
  path?: string
  pointFormat?: string
  coordinateSystem?: string
}

export function geoIndexed(definition?: GeoIndexedOptions) {
  return function(target: Object, propertyKey: string): void {
  }
}

export function rangeIndexed(definition?: RangeIndexedOptions) {
  return function(target: Object, propertyKey: string): void {
  }
}

export interface TaskOptions {
  type: MarkScript.FrequencyType
  frequency: number
  user?: string
  name?: string
}

export function mlTask(definition?: TaskOptions) {
  return function(target: Object, propertyKey: string): void {
  }
}

export interface AlertOptions {
  name?: string
  scope: string
  states?: MarkScript.TRIGGER_STATE[]
  depth?: number
  commit?: MarkScript.TRIGGER_COMMIT
}

export function mlAlert(definition?: AlertOptions) {
  return function(target: Object, propertyKey: string): void {
  }
}

export interface ExtensionOptions {
  name?: string
}

export function mlExtension(definition?: ExtensionOptions) {
  return function(target: any) {
    return target
  }
}
