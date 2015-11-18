export declare function mlDeploy(): (target: any) => void;
export declare function contentDatabase(): (target: Object, propertyKey: string) => void;
export declare function triggersDatabase(): (target: Object, propertyKey: string) => void;
export declare function schemaDatabase(): (target: Object, propertyKey: string) => void;
export declare function modulesDatabase(): (target: Object, propertyKey: string) => void;
export declare function securityDatabase(): (target: Object, propertyKey: string) => void;
export declare function mlRuleSet(definition: MarkScript.RuleSetOptions): (target: Object, propertyKey: string, method: TypedPropertyDescriptor<() => string>) => void;
