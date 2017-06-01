import PromiseQueue from 'promise-queue-observable'

import { CANCEL } from 'redux-saga'
import { cancelled } from 'redux-saga/effects'

export default class SagaObservable {
  constructor(config) {
    this.observable = new PromiseQueue({
      ...config,
      promiseFactory: promise => {
        if ( config.promiseFactory ) {
          promise = config.promiseFactory(promise)
        }
        promise[CANCEL] = () => {
          this.observable.cancel()
        }
        return promise
      }
    })
  }
  next = () => this.observable.next()
  publish = (...args) => this.observable.publish(...args)
  cancel = () => this.observable.cancel()
  cancelled = () => this.observable.cancelled()
}