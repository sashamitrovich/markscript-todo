var g = require('./generator');
var u = require('uservices');
var fs = require('fs');
var path = require('path');
exports.uServicesPlugin = {
    generate: function (buildModel, options, pkgDir, typeModel, assetTypeModel) {
        var serviceSpecs;
        var specsPath = options.specsPath || path.join(pkgDir, 'deployed', 'service-specs.json');
        if (fs.existsSync(specsPath)) {
            serviceSpecs = u.parse(fs.readFileSync(specsPath).toString());
        }
        else if (!assetTypeModel) {
            throw new Error('To build the uservices, either a service-spec.json must exist in the package directory, or a type model provided to generate one');
        }
        else {
            serviceSpecs = g.generateServiceSpecs(assetTypeModel);
        }
        buildModel.serviceSpecs = serviceSpecs;
        g.generateAssetModel(serviceSpecs, options.middle.host + ':' + options.middle.port, buildModel, pkgDir);
        return buildModel;
    },
    jsonify: function (buildModel) {
        return {
            serviceSpecs: u.jsonify(buildModel.serviceSpecs)
        };
    },
    dejsonify: function (jsonifiedModel) {
        return {
            serviceSpecs: u.dejsonify(jsonifiedModel.serviceSpecs)
        };
    }
};
//# sourceMappingURL=buildPlugin.js.map