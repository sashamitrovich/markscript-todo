import {mlDeploy, contentDatabase, triggersDatabase, modulesDatabase, schemaDatabase, mlRuleSet} from 'markscript-basic-build'
import {variable, prefix, rule} from 'speckle'

@mlDeploy()
export class TodoDatabase {
  name: string
  host: string
  port: number

  constructor(name: string, port: number, host?: string) {
    this.name = name
    this.host = host
    this.port = port
  }

  get server(): MarkScript.ServerSpec {
    return {
      name: this.name,
      host: this.host,
      port: this.port
    }
  }

  @contentDatabase()
  get contentDatabase(): MarkScript.DatabaseSpec {
    return {
      name: this.name + '-content',
      triples: true
    }
  }

  @triggersDatabase()
  get triggersDatabase(): MarkScript.DatabaseSpec {
    return {
      name: this.name + '-triggers'
    }
  }

  @modulesDatabase()
  get modulesDatabase(): MarkScript.DatabaseSpec {
    return {
      name: this.name + '-modules'
    }
  }

  @schemaDatabase()
  get schemaDatabase(): MarkScript.DatabaseSpec {
    return {
      name: this.name + '-schema'
    }
  }
}
