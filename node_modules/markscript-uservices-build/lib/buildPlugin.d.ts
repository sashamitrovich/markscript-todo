import * as core from 'markscript-core';
import * as m from './model';
export interface UServicesBuildConfig {
    middle: {
        host: string;
        port: number;
    };
    specsPath?: string;
}
export interface UServicesBuildModel {
    serviceSpecs?: m.MLServices;
}
export declare const uServicesPlugin: core.BuildModelPlugin<UServicesBuildConfig, UServicesBuildModel>;
