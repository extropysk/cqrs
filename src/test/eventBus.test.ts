import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { EventBus } from '@/providers'
import { BaseEvent, IEventHandler } from '@/types'

class TestEvent extends BaseEvent {
  constructor(public readonly value: string) {
    super()
  }
}

class AnotherEvent extends BaseEvent {
  constructor(public readonly count: number) {
    super()
  }
}

describe('EventBus', () => {
  let eventBus: EventBus

  beforeEach(() => {
    eventBus = new EventBus()
  })

  afterEach(() => {
    eventBus.destroy()
  })

  test('publish triggers registered handler', async () => {
    const handleFn = vi.fn()

    const handler: IEventHandler<TestEvent> = {
      resolveName: () => TestEvent.name,
      handle: handleFn,
    }

    eventBus.register(handler)
    eventBus.publish(new TestEvent('hello'))

    // Allow async subscription to process
    await new Promise(resolve => setTimeout(resolve, 10))

    expect(handleFn).toHaveBeenCalledTimes(1)
    expect(handleFn).toHaveBeenCalledWith(expect.objectContaining({ value: 'hello' }))
  })

  test('publish does not trigger handler for different event type', async () => {
    const handleFn = vi.fn()

    const handler: IEventHandler<TestEvent> = {
      resolveName: () => TestEvent.name,
      handle: handleFn,
    }

    eventBus.register(handler)
    eventBus.publish(new AnotherEvent(42))

    await new Promise(resolve => setTimeout(resolve, 10))

    expect(handleFn).not.toHaveBeenCalled()
  })

  test('publishAll triggers handler for each event', async () => {
    const handleFn = vi.fn()

    const handler: IEventHandler<TestEvent> = {
      resolveName: () => TestEvent.name,
      handle: handleFn,
    }

    eventBus.register(handler)
    eventBus.publishAll([new TestEvent('first'), new TestEvent('second'), new TestEvent('third')])

    await new Promise(resolve => setTimeout(resolve, 10))

    expect(handleFn).toHaveBeenCalledTimes(3)
  })

  test('multiple handlers for same event type all receive event', async () => {
    const handleFn1 = vi.fn()
    const handleFn2 = vi.fn()

    const handler1: IEventHandler<TestEvent> = {
      resolveName: () => TestEvent.name,
      handle: handleFn1,
    }

    const handler2: IEventHandler<TestEvent> = {
      resolveName: () => TestEvent.name,
      handle: handleFn2,
    }

    eventBus.register(handler1)
    eventBus.register(handler2)
    eventBus.publish(new TestEvent('shared'))

    await new Promise(resolve => setTimeout(resolve, 10))

    expect(handleFn1).toHaveBeenCalledTimes(1)
    expect(handleFn2).toHaveBeenCalledTimes(1)
  })

  test('destroy stops handlers from receiving events', async () => {
    const handleFn = vi.fn()

    const handler: IEventHandler<TestEvent> = {
      resolveName: () => TestEvent.name,
      handle: handleFn,
    }

    eventBus.register(handler)
    eventBus.destroy()
    eventBus.publish(new TestEvent('after-destroy'))

    await new Promise(resolve => setTimeout(resolve, 10))

    expect(handleFn).not.toHaveBeenCalled()
  })

  test('handler error is caught and does not break the bus', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const errorHandler: IEventHandler<TestEvent> = {
      resolveName: () => TestEvent.name,
      handle: () => {
        throw new Error('Handler error')
      },
    }

    const successHandleFn = vi.fn()
    const successHandler: IEventHandler<TestEvent> = {
      resolveName: () => TestEvent.name,
      handle: successHandleFn,
    }

    eventBus.register(errorHandler)
    eventBus.register(successHandler)

    eventBus.publish(new TestEvent('test'))

    await new Promise(resolve => setTimeout(resolve, 10))

    expect(consoleSpy).toHaveBeenCalled()
    expect(successHandleFn).toHaveBeenCalledTimes(1)

    consoleSpy.mockRestore()
  })

  test('events$ observable emits published events', async () => {
    const emittedEvents: TestEvent[] = []

    eventBus.events$.subscribe(event => {
      if (event instanceof TestEvent) {
        emittedEvents.push(event)
      }
    })

    eventBus.publish(new TestEvent('observable-test'))

    await new Promise(resolve => setTimeout(resolve, 10))

    expect(emittedEvents).toHaveLength(1)
    expect(emittedEvents[0].value).toBe('observable-test')
  })

  test('publishAll handles empty array', () => {
    expect(() => eventBus.publishAll([])).not.toThrow()
  })

  test('publishAll handles null/undefined gracefully', () => {
    expect(() => eventBus.publishAll(null as any)).not.toThrow()
    expect(() => eventBus.publishAll(undefined as any)).not.toThrow()
  })
})
