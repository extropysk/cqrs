import { Subject } from 'rxjs'
import { IPublisher } from '@/types'

export class DefaultPubSub<T> implements IPublisher<T> {
  constructor(private subject$: Subject<T>) {}

  publish(event: T) {
    this.subject$.next(event)
  }
}
