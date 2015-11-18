var p = require('typescript-package');
var mg = require('./modelGenerator');
var path = require('path');
var glob = require('glob');
var os = require('os');
function generateModel(buildModel, options, typeModel) {
    var model = mg.generateModel(typeModel, options.database.modelObject, options.databaseConnection.host || os.hostname());
    Object.keys(model).forEach(function (key) {
        if (key === 'databases') {
            Object.keys(model.databases).forEach(function (name) {
                buildModel.databases[name] = model.databases[name];
            });
        }
        else if (key === 'servers') {
            Object.keys(model.servers).forEach(function (name) {
                buildModel.servers[name] = model.servers[name];
            });
        }
        else {
            buildModel[key] = model[key];
        }
    });
}
function generateAssetModel() {
}
exports.basicBuildPlugin = {
    generate: function (buildModel, options, pkgDir, buildTypeModel, runtimeTypeModel, buildDir) {
        generateModel(buildModel, options, buildTypeModel);
        generateModel(buildModel, options, runtimeTypeModel);
        mg.generateAssetModel(buildTypeModel, options.database.modelObject, buildModel, options.database.defaultTaskUser || options.databaseConnection.user);
        mg.generateAssetModel(runtimeTypeModel, options.database.modelObject, buildModel, options.database.defaultTaskUser || options.databaseConnection.user);
        var baseDir;
        if (options.database.modules) {
            var tsConfig = p.getTSConfig(pkgDir);
            baseDir = tsConfig.compilerOptions.rootDir ? path.join(pkgDir, tsConfig.compilerOptions.rootDir) : pkgDir;
            var relFiles = Array.isArray(options.database.modules) ? options.database.modules : glob.sync(options.database.modules, { cwd: baseDir });
            mg.addJavaScriptModules(buildModel, pkgDir, baseDir, relFiles);
        }
        else if (options.assetBaseDir) {
            baseDir = path.isAbsolute(options.assetBaseDir) ? options.assetBaseDir : path.join(pkgDir, options.assetBaseDir);
            if (runtimeTypeModel) {
                var tsConfig = p.getTSConfig(baseDir);
                mg.addTypeScriptModules(buildModel, pkgDir, baseDir, tsConfig.files, buildDir);
            }
            else {
                mg.addJavaScriptModules(buildModel, pkgDir, baseDir, glob.sync('**/*.ts', { cwd: baseDir }));
            }
        }
        if (options.database.extensions) {
            mg.addJavaScriptExtensions(buildModel, pkgDir, options.database.extensions);
        }
        if (options.database.tasks) {
            options.database.tasks.forEach(function (taskSpec) {
                buildModel.tasks[taskSpec.name] = taskSpec;
            });
        }
        if (options.database.alerts) {
            options.database.alerts.forEach(function (alertSpec) {
                buildModel.alerts[alertSpec.name] = alertSpec;
            });
        }
        if (options.database.ruleSets) {
            options.database.ruleSets.forEach(function (ruleSetSpec) {
                buildModel.ruleSets.push(ruleSetSpec);
            });
        }
        return buildModel;
    }
};
//# sourceMappingURL=buildPlugin.js.map