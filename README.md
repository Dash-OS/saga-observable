# SagaObservable

Abstracts [PromiseQueue](https://github.com/Dash-OS/promise-queue-observable) to 
add the redux-saga cancellation logic on top.  This allows us to easily wait for 
future actions / events in our sagas. 

If you are not using [redux-saga](https://github.com/redux-saga/redux-saga) then you 
probably should be looking at the PromiseQueue package above. 

### Simple Example

```js
import { fork } from 'redux-saga/effects'
import SagaObservable from 'saga-observable'

export function* watchUserPositionSaga(options = { enableHighAccuracy: true }) {
  if ( ! navigator.geolocation ) {
    console.warn('User Position can not be used, check permissions or update browser.')
    return
  }
  const observer = new SagaObservable({ /* ... config ... */ })
  let id
  try {
    id = navigator.geolocation.watchPosition(
      observer.publish, observer.publish, options
    )
    while(true) {
      const location = yield apply(observer, observer.next)
      // handle new data via [yield fork]
    }
  } catch (e) {
    // handle errors
  } finally {
    if ( yield observer.cancelled() ) {
      // handle cancellation
    }
    navigator.geolocation.clearWatch(id)
  }
}
```