import { Observable, Subject } from 'rxjs'
import { IPublisher } from '@/types'
import { DefaultPubSub } from '@/utils/defaultPubSub'

export class ObservableBus<T> {
  protected readonly subject$ = new Subject<T>()
  protected readonly publisher: IPublisher<T>

  public readonly events$: Observable<T>

  constructor() {
    this.publisher = new DefaultPubSub(this.subject$)
    this.events$ = this.subject$.asObservable()
  }
}
