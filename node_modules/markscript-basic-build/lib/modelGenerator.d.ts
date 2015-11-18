import { reflective as s, KeyValue } from 'typescript-schema';
export declare function generateAssetModel(schema: KeyValue<s.Module>, definition: Object, assetModel?: MarkScript.AssetModel, defaultTaskUser?: string): MarkScript.AssetModel;
export declare function addJavaScriptExtensions(assetModel: MarkScript.AssetModel, baseDir: string, extensions: {
    [name: string]: string;
}): void;
export declare function addTypeScriptExtensions(assetModel: MarkScript.AssetModel, baseDir: string, extensions: {
    [name: string]: string;
}, buildDir: string): void;
export declare function addJavaScriptModules(assetModel: MarkScript.AssetModel, packageDir: string, baseDir: string, relFiles: string[]): void;
export declare function addTypeScriptModules(assetModel: MarkScript.AssetModel, packageDir: string, baseDir: string, relFiles: string[], buildDir: string): void;
export declare function generateModel(schema: KeyValue<s.Module>, definition: Object, defaultHost?: string): MarkScript.Model;
