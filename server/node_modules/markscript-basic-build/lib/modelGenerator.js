var typescript_schema_1 = require('typescript-schema');
var basic = require('markscript-basic');
var core = require('markscript-core');
var p = require('typescript-package');
var path = require('path');
var os = require('os');
var fs = require('fs');
function toScalarType(rangeOptions, member) {
    if (rangeOptions.scalarType) {
        switch (rangeOptions.scalarType) {
            case basic.ScalarType.int:
                return 'int';
            case basic.ScalarType.unsignedInt:
                return 'unsignedInt';
            case basic.ScalarType.long:
                return 'long';
            case basic.ScalarType.unsignedLong:
                return 'unsignedLong';
            case basic.ScalarType.float:
                return 'float';
            case basic.ScalarType.double:
                return 'double';
            case basic.ScalarType.decimal:
                return 'decimal';
            case basic.ScalarType.dateTime:
                return 'dateTime';
            case basic.ScalarType.time:
                return 'time';
            case basic.ScalarType.date:
                return 'date';
            case basic.ScalarType.gYearMonth:
                return 'gYearMonth';
            case basic.ScalarType.gYear:
                return 'gYear';
            case basic.ScalarType.gMonth:
                return 'gMonth';
            case basic.ScalarType.gDay:
                return 'gDay';
            case basic.ScalarType.yearMonthDuration:
                return 'yearMonthDuration';
            case basic.ScalarType.dayTimeDuration:
                return 'dayTimeDuration';
            case basic.ScalarType.string:
                return 'string';
            case basic.ScalarType.anyURI:
                return 'anyURI';
        }
    }
    else {
        var value;
        typescript_schema_1.visitType(member.type, {
            onString: function () {
                value = 'string';
            },
            onNumber: function () {
                value = 'float';
            },
            onArrayType: function (arr) {
                return {
                    onString: function () {
                        value = 'string';
                    },
                    onNumber: function () {
                        value = 'float';
                    }
                };
            }
        });
        return value;
    }
    return null;
}
function toModuleName(name, packageName) {
    name = name.replace(/\\/g, '/');
    var suffix = name.substring(name.length - 3).toLowerCase();
    if (suffix === '.js' || suffix === '.ts') {
        name = name.substring(0, name.length - 3);
    }
    if (packageName) {
        name = path.join(packageName, name);
    }
    if (name.charAt(0) !== '/') {
        name = '/' + name;
    }
    return name;
}
function generateAssetModel(schema, definition, assetModel, defaultTaskUser) {
    if (assetModel) {
        if (!assetModel.ruleSets) {
            assetModel.ruleSets = [];
        }
        if (!assetModel.alerts) {
            assetModel.alerts = {};
        }
        if (!assetModel.modules) {
            assetModel.modules = {};
        }
        if (!assetModel.extensions) {
            assetModel.extensions = {};
        }
        if (!assetModel.tasks) {
            assetModel.tasks = {};
        }
    }
    else {
        assetModel = {
            ruleSets: [],
            modules: {},
            extensions: {},
            tasks: {},
            alerts: {}
        };
    }
    typescript_schema_1.visitModules(schema, {
        onModule: function (module) {
            return {
                onClassConstructor: function (cc) {
                    return {
                        onClassConstructorDecorator: function (decorator) {
                            switch (decorator.decoratorType.name) {
                                case 'mlExtension':
                                    var methods = [];
                                    var extensionOptions = decorator.parameters && decorator.parameters[0] ? typescript_schema_1.expressionToLiteral(decorator.parameters[0]) : null;
                                    typescript_schema_1.visitClassConstructor(cc, {
                                        onInstanceType: function (it) {
                                            return {
                                                onMember: function (member) {
                                                    switch (member.name) {
                                                        case 'get':
                                                        case 'post':
                                                        case 'put':
                                                        case 'delete':
                                                            methods.push(member.name);
                                                    }
                                                }
                                            };
                                        }
                                    });
                                    var code = 'var ExtensionClass = r' + ("equire(\"" + toModuleName(module.name) + "\")." + cc.name + ";\nvar extensionObject = new ExtensionClass();\n");
                                    methods.forEach(function (method) {
                                        code += "exports." + method.toUpperCase() + " = extensionObject." + method + ".bind(extensionObject);\n";
                                    });
                                    var extensionModuleName = (extensionOptions && extensionOptions.name) ? extensionOptions.name : ('_extensions-' + typescript_schema_1.classConstructorToString(cc).replace(/:/g, '-').replace(/\//g, '-'));
                                    assetModel.extensions[extensionModuleName] = {
                                        name: extensionModuleName,
                                        code: code
                                    };
                            }
                        },
                        onInstanceType: function (it) {
                            return {
                                onMember: function (member) {
                                    return {
                                        onMemberDecorator: function (decorator) {
                                            switch (decorator.decoratorType.name) {
                                                case 'mlRuleSet': {
                                                    if (member.type.primitiveTypeKind !== 1 && !(member.type.typeKind === 3 && member.type.type.primitiveTypeKind === 1)) {
                                                        throw new Error('A class member annotated as a MarkLogic rule set must be a string property, at: ' + module.name + ':' + cc.name + ':' + member.name);
                                                    }
                                                    var path_1 = typescript_schema_1.expressionToLiteral(decorator.parameters[0]).path;
                                                    var rules = definition[decorator.parent.name]();
                                                    assetModel.ruleSets.push({
                                                        path: path_1,
                                                        rules: rules
                                                    });
                                                    break;
                                                }
                                                case 'mlAlert': {
                                                    if (cc.staticType.calls && cc.staticType.calls.length === 1 && cc.staticType.calls[0].parameters.length > 0) {
                                                        throw new Error('A class annotated with a MarkLogic alert must have a zero arg constructor, at: ' + module.name + ':' + cc.name + ':' + member.name);
                                                    }
                                                    if (member.type.typeKind !== 3 || member.type.parameters.length !== 2) {
                                                        throw new Error('A class member annotated as a MarkLogic alert must be a method of type (uri?:string, content?:cts.DocumentNode)=>void, at: ' + module.name + ':' + cc.name + ':' + member.name);
                                                    }
                                                    var alertOptions = typescript_schema_1.expressionToLiteral(decorator.parameters[0]);
                                                    var alertModuleName = '/_alerts/' + typescript_schema_1.classConstructorToString(cc).replace(/:/g, '/') + '/' + member.name;
                                                    var alertName = alertOptions.name || (typescript_schema_1.classConstructorToString(cc).replace(/\//g, '-').replace(/:/g, '-') + '-' + member.name);
                                                    assetModel.alerts[alertName] = {
                                                        name: alertName,
                                                        scope: alertOptions.scope,
                                                        states: alertOptions.states,
                                                        depth: alertOptions.depth,
                                                        commit: alertOptions.commit,
                                                        actionModule: alertModuleName
                                                    };
                                                    assetModel.modules[alertModuleName] = {
                                                        name: alertModuleName,
                                                        code: 'var AlertClass = r' + ("equire(\"" + toModuleName(module.name) + "\")." + cc.name + ";\nvar alertObject = new AlertClass();\nmodule.exports = function(uri, content){\n  alertObject." + member.name + "(uri, content);\n}")
                                                    };
                                                    break;
                                                }
                                                case 'mlTask': {
                                                    if (cc.staticType.calls && cc.staticType.calls.length === 1 && cc.staticType.calls[0].parameters.length > 0) {
                                                        throw new Error('A class annotated with a MarkLogic task must have a zero arg constructor, at: ' + module.name + ':' + cc.name + ':' + member.name);
                                                    }
                                                    if (member.type.typeKind !== 3 || member.type.parameters.length > 0) {
                                                        throw new Error('A class member annotated as a MarkLogic task must be a method with zero parameters, at: ' + module.name + ':' + cc.name + ':' + member.name);
                                                    }
                                                    var taskOptions = typescript_schema_1.expressionToLiteral(decorator.parameters[0]);
                                                    var taskModuleName = '/_tasks/' + typescript_schema_1.classConstructorToString(cc).replace(/:/g, '/') + '/' + member.name;
                                                    var taskName = taskOptions.name || typescript_schema_1.classConstructorToString(cc).replace(/\//g, '-').replace(/:/g, '-') + '-' + member.name;
                                                    assetModel.tasks[taskName] = {
                                                        type: taskOptions.type || 0,
                                                        frequency: taskOptions.frequency,
                                                        user: taskOptions.user || defaultTaskUser,
                                                        name: taskName,
                                                        module: taskModuleName
                                                    };
                                                    assetModel.modules[taskModuleName] = {
                                                        name: taskModuleName,
                                                        code: 'var TaskClass = r' + ("equire(\"" + toModuleName(module.name) + "\")." + cc.name + ";\nvar taskObject = new TaskClass();\ntaskObject." + member.name + "();")
                                                    };
                                                    break;
                                                }
                                            }
                                        }
                                    };
                                }
                            };
                        }
                    };
                }
            };
        }
    });
    return assetModel;
}
exports.generateAssetModel = generateAssetModel;
function normaliseRelPath(path) {
    path = path.replace(/\\/g, '/');
    if (path.substring(0, 2) === './') {
        path = path.substring(2);
    }
    if (path.substring(path.length - 3) === '.ts' || path.substring(path.length - 3) === '.js') {
        path = path.substring(0, path.length - 3);
    }
    return path;
}
function addJavaScriptExtensions(assetModel, baseDir, extensions) {
    addExtensions(assetModel, baseDir, extensions);
}
exports.addJavaScriptExtensions = addJavaScriptExtensions;
function addTypeScriptExtensions(assetModel, baseDir, extensions, buildDir) {
    addExtensions(assetModel, baseDir, extensions, buildDir);
}
exports.addTypeScriptExtensions = addTypeScriptExtensions;
function addExtensions(assetModel, baseDir, extensions, buildDir) {
    var names = [];
    var relFiles = [];
    Object.keys(extensions).forEach(function (name) {
        names.push(name);
        relFiles.push(extensions[name]);
    });
    var code = loadCode(baseDir, relFiles, buildDir);
    names.forEach(function (name, i) {
        assetModel.extensions[name] = {
            name: name,
            code: code[relFiles[i]]
        };
    });
}
function loadCode(baseDir, relFiles, buildDir) {
    var code = {};
    if (buildDir) {
        code = core.translateTypeScript(baseDir, relFiles, path.join(buildDir, 'out'), path.join(buildDir, 'tmp'));
    }
    else {
        relFiles.forEach(function (relPath) {
            code[relPath] = fs.readFileSync(path.join(baseDir, relPath)).toString();
        });
    }
    return code;
}
function addModules(assetModel, packageDir, baseDir, relFiles, buildDir) {
    var packageJson = p.getPackageJson(packageDir);
    var code = loadCode(baseDir, relFiles, buildDir);
    Object.keys(code).forEach(function (relPath) {
        var moduleName = toModuleName(relPath, packageJson.name);
        assetModel.modules[moduleName] = {
            name: moduleName,
            code: code[relPath]
        };
        if (packageJson.main && normaliseRelPath(packageJson.main) === normaliseRelPath(relPath)) {
            var packageModuleName = toModuleName(packageJson.name);
            assetModel.modules[packageModuleName] = {
                name: packageModuleName,
                code: moduleName
            };
        }
    });
}
function addJavaScriptModules(assetModel, packageDir, baseDir, relFiles) {
    addModules(assetModel, packageDir, baseDir, relFiles);
}
exports.addJavaScriptModules = addJavaScriptModules;
function addTypeScriptModules(assetModel, packageDir, baseDir, relFiles, buildDir) {
    addModules(assetModel, packageDir, baseDir, relFiles, buildDir);
}
exports.addTypeScriptModules = addTypeScriptModules;
function generateModel(schema, definition, defaultHost) {
    defaultHost = (defaultHost || os.hostname()).toLowerCase();
    var model = {
        databases: {},
        servers: {}
    };
    var rangeIndices = [];
    var geoIndices = [];
    var databasesByType = {
        content: null,
        triggers: null,
        schema: null,
        security: null,
        modules: null
    };
    var databases = {};
    typescript_schema_1.visitModules(schema, {
        onModule: function (module) {
            return {
                onClassConstructor: function (cc) {
                    var isDeployable = false;
                    return {
                        onClassConstructorDecorator: function (decorator) {
                            if (decorator.decoratorType.name === 'mlDeploy') {
                                isDeployable = true;
                            }
                        },
                        onInstanceType: function (it) {
                            return {
                                onMember: function (member) {
                                    if (isDeployable) {
                                        var name_1 = member.type.name;
                                        switch (name_1) {
                                            case 'DatabaseSpec':
                                                var databaseSpec = definition[member.name];
                                                model.databases[databaseSpec.name] = databaseSpec;
                                                databases[member.name] = databaseSpec.name;
                                                if (!databaseSpec.forests || databaseSpec.forests.length === 0) {
                                                    databaseSpec.forests = [{
                                                            name: databaseSpec.name,
                                                            database: databaseSpec.name,
                                                            host: defaultHost
                                                        }];
                                                }
                                                break;
                                            case 'ServerSpec':
                                                var serverSpec = definition[member.name];
                                                if (!serverSpec.group) {
                                                    serverSpec.group = 'Default';
                                                }
                                                serverSpec.host = (serverSpec.host || defaultHost).toLowerCase();
                                                model.servers[serverSpec.name] = serverSpec;
                                                break;
                                        }
                                    }
                                    return {
                                        onMemberDecorator: function (decorator) {
                                            switch (decorator.decoratorType.name) {
                                                case 'rangeIndexed':
                                                    var rangeOptions = (decorator.parameters && decorator.parameters.length > 0) ? typescript_schema_1.expressionToLiteral(decorator.parameters[0]) : {};
                                                    var scalarType = toScalarType(rangeOptions, decorator.parent);
                                                    if (scalarType) {
                                                        rangeIndices.push({
                                                            path: rangeOptions.path || "/" + decorator.parent.name,
                                                            collation: rangeOptions.collation,
                                                            scalarType: scalarType
                                                        });
                                                    }
                                                    break;
                                                case 'geoIndexed':
                                                    var geoOptions = (decorator.parameters && decorator.parameters.length > 0) ? typescript_schema_1.expressionToLiteral(decorator.parameters[0]) : {};
                                                    var geoIndex = {
                                                        path: geoOptions.path || "/" + decorator.parent.name,
                                                        pointFormat: geoOptions.pointFormat || 'point'
                                                    };
                                                    if (geoOptions.coordinateSystem) {
                                                        geoIndex.coordinateSystem = geoOptions.coordinateSystem;
                                                    }
                                                    geoIndices.push(geoIndex);
                                                    break;
                                                case 'contentDatabase':
                                                    databasesByType.content = decorator.parent.name;
                                                    break;
                                                case 'triggersDatabase':
                                                    databasesByType.triggers = decorator.parent.name;
                                                    break;
                                                case 'schemaDatabase':
                                                    databasesByType.schema = decorator.parent.name;
                                                    break;
                                                case 'securityDatabase':
                                                    databasesByType.security = decorator.parent.name;
                                                    break;
                                                case 'modulesDatabase':
                                                    databasesByType.modules = decorator.parent.name;
                                                    break;
                                            }
                                        }
                                    };
                                }
                            };
                        }
                    };
                }
            };
        }
    });
    if (databasesByType.security) {
        model.securityDatabase = databases[databasesByType.security];
        Object.keys(databasesByType).forEach(function (key) {
            if (key !== 'security' && databasesByType[key]) {
                model.databases[databasesByType[key]].securityDatabase = databases[databasesByType.security];
            }
        });
    }
    if (databasesByType.modules) {
        model.modulesDatabase = databases[databasesByType.modules];
        Object.keys(model.servers).forEach(function (serverName) {
            model.servers[serverName].modulesDatabase = databases[databasesByType.modules];
        });
    }
    if (databasesByType.schema) {
        model.schemaDatabase = databases[databasesByType.schema];
    }
    if (databasesByType.triggers) {
        model.triggersDatabase = databases[databasesByType.triggers];
    }
    if (databasesByType.content) {
        model.contentDatabase = databases[databasesByType.content];
        Object.keys(model.servers).forEach(function (serverName) {
            model.servers[serverName].contentDatabase = databases[databasesByType.content];
        });
        var contentDatabase = model.databases[databases[databasesByType.content]];
        if (databasesByType.schema) {
            contentDatabase.schemaDatabase = databases[databasesByType.schema];
        }
        if (databasesByType.triggers) {
            contentDatabase.triggersDatabase = databases[databasesByType.triggers];
        }
        contentDatabase.rangeIndices = contentDatabase.rangeIndices || [];
        contentDatabase.geoIndices = contentDatabase.geoIndices || [];
        rangeIndices.forEach(function (rangeIndex) {
            contentDatabase.rangeIndices.push(rangeIndex);
        });
        geoIndices.forEach(function (geoIndex) {
            contentDatabase.geoIndices.push(geoIndex);
        });
    }
    return model;
}
exports.generateModel = generateModel;
//# sourceMappingURL=modelGenerator.js.map