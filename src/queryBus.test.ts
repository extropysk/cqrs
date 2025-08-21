import { expect, test } from 'vitest'
import { IQueryHandler, Query } from './types/queries'
import { QueryBus } from './queryBus'

class Hero {}

export class GetHeroQuery extends Query<Hero> {
  constructor(public readonly heroId: string) {
    super()
  }
}

class GetHeroHandler implements IQueryHandler<GetHeroQuery> {
  constructor() {}

  async execute(query: GetHeroQuery) {
    console.log('HH')
    return {}
  }
}

test('adds 1 + 2 to equal 3', async () => {
  const queryBus = new QueryBus()
  queryBus.register(GetHeroQuery, new GetHeroHandler())

  const query = new GetHeroQuery('1')
  await queryBus.execute(query)

  expect(3).toBe(3)
})
