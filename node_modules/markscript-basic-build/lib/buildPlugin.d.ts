import * as core from 'markscript-core';
export interface BasicBuildConfig {
    database: {
        modelObject: Object;
        defaultTaskUser?: string;
        modules?: string | string[];
        ruleSets?: MarkScript.RuleSetSpec[];
        tasks?: MarkScript.TaskSpec[];
        alerts?: MarkScript.AlertSpec[];
        extensions?: {
            [extensionName: string]: string;
        };
    };
}
export declare const basicBuildPlugin: core.BuildModelPlugin<BasicBuildConfig, {}>;
