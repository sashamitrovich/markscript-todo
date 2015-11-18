declare module MarkScript {
  interface BasicBuildConfig {
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

  interface BasicRuntime {
    callGet<T>(name: string, args?: { [name: string]: string | number | boolean }): Promise<T>
    callPost<T>(name: string, args?: { [name: string]: string | number | boolean }, body?: string | Object): Promise<T>
    callPut<T>(name: string, args?: { [name: string]: string | number | boolean }, body?: string | Object): Promise<T>
    callDelete<T>(name: string, args?: { [name: string]: string | number | boolean }): Promise<T>
  }

  interface RuleSetOptions {
    path: string
  }
}

declare module 'markscript-basic-build' {
  function contentDatabase(): (target: Object, propertyKey: string) => void
  function triggersDatabase(): (target: Object, propertyKey: string) => void
  function schemaDatabase(): (target: Object, propertyKey: string) => void
  function modulesDatabase(): (target: Object, propertyKey: string) => void
  function securityDatabase(): (target: Object, propertyKey: string) => void
  interface RuleSetOptions {
    path: string
  }
  function mlDeploy(): (target: any) => void
  function mlRuleSet(definition: MarkScript.RuleSetOptions): (target: Object, propertyKey: string, method: TypedPropertyDescriptor<() => string>) => void
  interface TaskOptions {
    type: MarkScript.FrequencyType
    frequency: number
    user?: string
    name?: string
  }

  const basicBuildPlugin

  class Runtime implements MarkScript.BasicRuntime {
    constructor(buildModel: MarkScript.BuildModel, buildConfig: MarkScript.BuildConfig)

    callGet<T>(name: string, args?: { [name: string]: string | number | boolean }): Promise<T>
    callPost<T>(name: string, args?: { [name: string]: string | number | boolean }, body?: string | Object): Promise<T>
    callPut<T>(name: string, args?: { [name: string]: string | number | boolean }, body?: string | Object): Promise<T>
    callDelete<T>(name: string, args?: { [name: string]: string | number | boolean }): Promise<T>
  }
}
