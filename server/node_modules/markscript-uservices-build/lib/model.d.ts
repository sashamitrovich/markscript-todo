import * as u from 'uservices';
import * as mu from 'markscript-uservices';
export declare function methodToString(method: mu.METHOD): string;
export interface MLServices extends u.Services<MLService> {
}
export interface MLService extends u.Service<MLMethod, MLEvent> {
    implementation?: {
        moduleName: string;
        className: string;
    };
}
export interface MLMethod extends u.Method<MLService>, mu.MethodOptions {
}
export interface MLEvent extends u.Event<MLService>, mu.EventOptions {
}
