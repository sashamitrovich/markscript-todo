import * as core from 'markscript-core'
import * as s from 'typescript-schema'
import * as g from './generator'
import * as m from './model'
import * as u from 'uservices'
import * as fs from 'fs'
import * as path from 'path'

export interface UServicesBuildConfig {
  middle: {
    host: string
    port: number
  }
  specsPath?: string
}

export interface UServicesBuildModel {
  serviceSpecs?: m.MLServices
}

export const uServicesPlugin: core.BuildModelPlugin<UServicesBuildConfig, UServicesBuildModel> = {
  generate: function(buildModel: MarkScript.BuildModel & UServicesBuildModel, options: MarkScript.BuildConfig & UServicesBuildConfig, pkgDir: string, typeModel?: s.KeyValue<s.reflective.Module>, assetTypeModel?: s.KeyValue<s.reflective.Module>): MarkScript.BuildModel & UServicesBuildModel {
    let serviceSpecs: m.MLServices
    let specsPath = options.specsPath || path.join(pkgDir, 'deployed', 'service-specs.json')
    if (fs.existsSync(specsPath)) {
      serviceSpecs = u.parse(fs.readFileSync(specsPath).toString())
    } else if (!assetTypeModel) {
      throw new Error('To build the uservices, either a service-spec.json must exist in the package directory, or a type model provided to generate one')
    } else {
      serviceSpecs = g.generateServiceSpecs(assetTypeModel)
    }
    buildModel.serviceSpecs = serviceSpecs

    g.generateAssetModel(serviceSpecs, options.middle.host + ':' + options.middle.port, buildModel, pkgDir)

    return buildModel
  },
  jsonify: function(buildModel: MarkScript.BuildModel & UServicesBuildModel): any {
    return {
      serviceSpecs: u.jsonify(buildModel.serviceSpecs)
    }
  },
  dejsonify: function(jsonifiedModel: any): UServicesBuildModel {
    return {
      serviceSpecs: u.dejsonify(jsonifiedModel.serviceSpecs)
    }
  }
}
