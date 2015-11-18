import * as core from 'markscript-core'

export type Args = { [name: string]: string | number | boolean }

export interface BasicRuntime {
  callGet<T>(name: string, args?: Args): Promise<T>
  callPost<T>(name: string, args?: Args, body?: string | Object): Promise<T>
  callPut<T>(name: string, args?: Args, body?: string | Object): Promise<T>
  callDelete<T>(name: string, args?: Args): Promise<T>
}

export class Runtime extends core.CoreRuntime implements core.Runtime {
  callGet<T>(name: string, args?: { [name: string]: string | number | boolean }): Promise<T> {
    let self = this
    return new Promise(function(resolve, reject) {
      self.getClient().resources.get({name:name, params:args}).result(resolve, reject)
    })
  }

  callPost<T>(name: string, args?: { [name: string]: string | number | boolean }, body?: string | Object | Buffer | NodeJS.ReadableStream): Promise<T> {
    let self = this
    return new Promise(function(resolve, reject) {
      self.getClient().resources.post({name:name, params:args, documents:body}).result(resolve, reject)
    })
  }

  callPut<T>(name: string, args?: { [name: string]: string | number | boolean }, body?: string | Object | Buffer | NodeJS.ReadableStream): Promise<T> {
    let self = this
    return new Promise(function(resolve, reject) {
      self.getClient().resources.put({name:name, params:args, documents:body}).result(resolve, reject)
    })
  }

  callDelete<T>(name: string, args?: { [name: string]: string | number | boolean }): Promise<T> {
    let self = this
    return new Promise(function(resolve, reject) {
      self.getClient().resources.remove({name:name, params:args}).result(resolve, reject)
    })
  }
}
