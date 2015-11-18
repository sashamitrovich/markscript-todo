import * as core from 'markscript-core'
import * as s from 'typescript-schema'
import * as p from 'typescript-package'
import * as mg from './modelGenerator'
import * as path from 'path'
import * as glob from 'glob'
import * as os from 'os'

export interface BasicBuildConfig {
  database: {
    modelObject: Object

    defaultTaskUser?: string

    modules?: string | string[]
    ruleSets?: MarkScript.RuleSetSpec[]
    tasks?: MarkScript.TaskSpec[]
    alerts?: MarkScript.AlertSpec[]
    extensions?: { [extensionName: string]: string }
  }
}

function generateModel(buildModel: MarkScript.BuildModel, options: MarkScript.BuildConfig&BasicBuildConfig, typeModel: s.KeyValue<s.reflective.Module>) {
  let model = mg.generateModel(typeModel, options.database.modelObject, options.databaseConnection.host || os.hostname())
  Object.keys(model).forEach(function(key){
    if (key === 'databases') {
      Object.keys(model.databases).forEach(function(name){
        buildModel.databases[name] = model.databases[name]
      })
    } else if (key === 'servers') {
      Object.keys(model.servers).forEach(function(name){
        buildModel.servers[name] = model.servers[name]
      })
    } else {
      buildModel[key] = model[key]
    }
  })
}

function generateAssetModel() {

}

export const basicBuildPlugin: core.BuildModelPlugin<BasicBuildConfig, {}> = {
  generate: function(buildModel: MarkScript.BuildModel, options: MarkScript.BuildConfig&BasicBuildConfig, pkgDir:string, buildTypeModel?: s.KeyValue<s.reflective.Module>, runtimeTypeModel?: s.KeyValue<s.reflective.Module>, buildDir?: string): MarkScript.BuildModel {
    generateModel(buildModel, options, buildTypeModel)
    generateModel(buildModel, options, runtimeTypeModel)

    mg.generateAssetModel(buildTypeModel, options.database.modelObject, buildModel, options.database.defaultTaskUser || options.databaseConnection.user)
    mg.generateAssetModel(runtimeTypeModel, options.database.modelObject, buildModel, options.database.defaultTaskUser || options.databaseConnection.user)

    let baseDir:string
    if (options.database.modules) {
      let tsConfig = p.getTSConfig(pkgDir)
      baseDir = tsConfig.compilerOptions.rootDir ? path.join(pkgDir, tsConfig.compilerOptions.rootDir) : pkgDir
      let relFiles = Array.isArray(options.database.modules) ? <string[]>options.database.modules : glob.sync(<string>options.database.modules, { cwd: baseDir })
      mg.addJavaScriptModules(buildModel, pkgDir, baseDir, relFiles)
    } else if (options.assetBaseDir) {
      baseDir = path.isAbsolute(options.assetBaseDir) ? options.assetBaseDir : path.join(pkgDir, options.assetBaseDir)
      if (runtimeTypeModel) {
        let tsConfig = p.getTSConfig(baseDir)
        mg.addTypeScriptModules(buildModel, pkgDir, baseDir, tsConfig.files, buildDir)
      } else {
        mg.addJavaScriptModules(buildModel, pkgDir, baseDir, glob.sync('**/*.ts', { cwd: baseDir }))
      }
    }
    if (options.database.extensions) {
      mg.addJavaScriptExtensions(buildModel, pkgDir, options.database.extensions)
    }
    if (options.database.tasks) {
      options.database.tasks.forEach(function(taskSpec) {
        buildModel.tasks[taskSpec.name] = taskSpec
      })
    }
    if (options.database.alerts) {
      options.database.alerts.forEach(function(alertSpec) {
        buildModel.alerts[alertSpec.name] = alertSpec
      })
    }
    if (options.database.ruleSets) {
      options.database.ruleSets.forEach(function(ruleSetSpec) {
        buildModel.ruleSets.push(ruleSetSpec)
      })
    }
    return buildModel
  }
}
