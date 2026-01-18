import { beforeEach, describe, expect, test, vi } from 'vitest'
import { QueryBus } from '@/providers'
import { QueryHandlerNotFoundException } from '@/errors'
import { IQueryHandler, Query } from '@/types'
import { GetHeroQuery } from '@/test/queries/getHero.query'
import { GetHeroHandler } from '@/test/queries/getHero.handler'
import { HeroRepository } from '@/test/repository/hero.repository'

class SimpleQuery extends Query<number> {
  constructor(public readonly multiplier: number) {
    super()
  }
}

describe('QueryBus', () => {
  let queryBus: QueryBus

  beforeEach(() => {
    queryBus = new QueryBus()
  })

  test('execute returns handler result', async () => {
    const heroRepository = new HeroRepository()
    queryBus.register(new GetHeroHandler(heroRepository))

    const hero = await queryBus.execute(new GetHeroQuery(1))

    expect(hero?.id).toBe(1)
  })

  test('execute returns null for non-existent hero', async () => {
    const heroRepository = new HeroRepository()
    queryBus.register(new GetHeroHandler(heroRepository))

    const hero = await queryBus.execute(new GetHeroQuery(999))

    expect(hero).toBeNull()
  })

  test('execute throws QueryHandlerNotFoundException when no handler registered', async () => {
    const query = new SimpleQuery(5)

    await expect(queryBus.execute(query)).rejects.toThrow(QueryHandlerNotFoundException)
    await expect(queryBus.execute(query)).rejects.toThrow(
      'No handler found for the query: "SimpleQuery"',
    )
  })

  test('register warns when overriding existing handler', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const handler: IQueryHandler<SimpleQuery> = {
      resolveName: () => SimpleQuery.name,
      execute: async query => query.multiplier * 10,
    }

    queryBus.register(handler)
    queryBus.register(handler)

    expect(consoleSpy).toHaveBeenCalledWith(
      'Query handler [SimpleQuery] is already registered. Overriding previously registered handler.',
    )

    consoleSpy.mockRestore()
  })

  test('events$ observable emits executed queries', async () => {
    const handler: IQueryHandler<SimpleQuery> = {
      resolveName: () => SimpleQuery.name,
      execute: async query => query.multiplier * 10,
    }

    queryBus.register(handler)

    const emittedQueries: SimpleQuery[] = []
    queryBus.events$.subscribe(q => {
      if (q instanceof SimpleQuery) {
        emittedQueries.push(q)
      }
    })

    await queryBus.execute(new SimpleQuery(2))
    await queryBus.execute(new SimpleQuery(3))

    expect(emittedQueries).toHaveLength(2)
    expect(emittedQueries[0].multiplier).toBe(2)
    expect(emittedQueries[1].multiplier).toBe(3)
  })

  test('bind registers handler with custom id', async () => {
    const handler: IQueryHandler<SimpleQuery> = {
      resolveName: () => SimpleQuery.name,
      execute: async query => query.multiplier * 100,
    }

    queryBus.bind(handler, 'CustomQueryId')

    // Should not find by class name
    await expect(queryBus.execute(new SimpleQuery(5))).rejects.toThrow(
      QueryHandlerNotFoundException,
    )
  })
})
