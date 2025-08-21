export interface IPublisher<T> {
  /**
   * Publishes an event.
   * @param event The event to publish.
   */
  publish(event: T): any
}
