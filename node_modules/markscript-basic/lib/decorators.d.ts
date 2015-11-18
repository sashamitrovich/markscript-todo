export declare const enum ScalarType {
    int = 0,
    unsignedInt = 1,
    long = 2,
    unsignedLong = 3,
    float = 4,
    double = 5,
    decimal = 6,
    dateTime = 7,
    time = 8,
    date = 9,
    gYearMonth = 10,
    gYear = 11,
    gMonth = 12,
    gDay = 13,
    yearMonthDuration = 14,
    dayTimeDuration = 15,
    string = 16,
    anyURI = 17,
}
export interface RangeIndexedOptions {
    collation?: string;
    scalarType?: ScalarType;
    path?: string;
    name: string;
}
export interface GeoIndexedOptions {
    name: string;
    path?: string;
    pointFormat?: string;
    coordinateSystem?: string;
}
export declare function geoIndexed(definition?: GeoIndexedOptions): (target: Object, propertyKey: string) => void;
export declare function rangeIndexed(definition?: RangeIndexedOptions): (target: Object, propertyKey: string) => void;
export interface TaskOptions {
    type: MarkScript.FrequencyType;
    frequency: number;
    user?: string;
    name?: string;
}
export declare function mlTask(definition?: TaskOptions): (target: Object, propertyKey: string) => void;
export interface AlertOptions {
    name?: string;
    scope: string;
    states?: MarkScript.TRIGGER_STATE[];
    depth?: number;
    commit?: MarkScript.TRIGGER_COMMIT;
}
export declare function mlAlert(definition?: AlertOptions): (target: Object, propertyKey: string) => void;
export interface ExtensionOptions {
    name?: string;
}
export declare function mlExtension(definition?: ExtensionOptions): (target: any) => any;
