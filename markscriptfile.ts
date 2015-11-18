import {TodoDatabase} from './build/databaseModel'
import {basicBuildPlugin} from 'markscript-basic-build'
import {uServicesPlugin} from 'markscript-uservices-build'
import {Runtime} from 'markscript-koa'

const COMMON = {
  "appName": "todo",
  "ml": {
    "host": "macpro-3448.local",
    "user": "admin",
    "password": "admin",
    "port": 9030
  },
  "koa": {
    "host": "localhost",
    "port": 8080
  }
}

export const build: MarkScript.Build = {
  buildConfig: <MarkScript.BuildConfig & MarkScript.BasicBuildConfig & MarkScript.UServicesBuildConfig & MarkScript.KoaBuildConfig>{
    databaseConnection: {
      host: COMMON.ml.host,
      httpPort: COMMON.ml.port,
      adminPort: 8001,
      configPort: 8002,
      user: COMMON.ml.user,
      password: COMMON.ml.password,
    },
    database: {
      modelObject: new TodoDatabase(COMMON.appName, COMMON.ml.port, COMMON.ml.host)
    },
    fileServerPath: './www',
    middle: {
      host: COMMON.koa.host,
      port: COMMON.koa.port
    },
    assetBaseDir: './src'
  },
  plugins: [basicBuildPlugin, uServicesPlugin],
  runtime: Runtime,
  tasks: {
    run: {
      execute: function(buildModel: MarkScript.BuildModel, buildConfig: MarkScript.BuildConfig, server: Runtime) {
        return new Promise(function(resolve, reject){})
      },
      description: 'Run an instance of the KOA server'
    }
  }
}
