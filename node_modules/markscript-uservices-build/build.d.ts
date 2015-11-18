// TODO: Update to rx-next interface on middle and client tier
declare interface Observer<T> {
  /**
   * Recieves the next value in the sequence
   */
  onNext(value: T)

  /**
   * Recieves the sequence error
   */
  onError(errorValue)

  /**
   * Receives the sequence completion value
   */
  onCompleted(completeValue?: T)
}

declare interface Observable<T> {
  /**
   * Subscribes to the sequence
   */
  subscribe(observer: Observer<T>): () => void

  /**
   * Standard combinators
   */

  // TODO
  // filter(callback: (T) => boolean): Observable<T>
  map<U>(callback: (T) => U): Observable<U>
}

declare module MarkScript {
  interface UServicesRuntime {
    getService<T>(name: string): T
  }
  interface UServicesBuildConfig {
    middle: {
      host: string
      port: number
    }
    specsPath?: string
  }
}

declare module 'markscript-uservices-build' {
  const uServicesPlugin
}
