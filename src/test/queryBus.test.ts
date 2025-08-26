import { beforeAll, expect, test } from 'vitest'
import { QueryBus } from '../providers'
import { GetHeroQuery } from './queries/getHero.query'
import { GetHeroHandler } from './queries/getHero.handler'
import { HeroRepository } from './repository/hero.repository'

const queryBus = new QueryBus()

beforeAll(async () => {
  const heroRepository = new HeroRepository()
  queryBus.register(new GetHeroHandler(heroRepository))
})

test('get hero query', async () => {
  const hero = await queryBus.execute(new GetHeroQuery(1))

  expect(hero?.id).toBe(1)
})
