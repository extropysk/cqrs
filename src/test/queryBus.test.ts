import { beforeAll, expect, test } from 'vitest'
import { QueryBus } from '@/providers'
import { GetHeroQuery } from '@/test/queries/getHero.query'
import { GetHeroHandler } from '@/test/queries/getHero.handler'
import { HeroRepository } from '@/test/repository/hero.repository'

const queryBus = new QueryBus()

beforeAll(async () => {
  const heroRepository = new HeroRepository()
  queryBus.register(new GetHeroHandler(heroRepository))
})

test('get hero query', async () => {
  const hero = await queryBus.execute(new GetHeroQuery(1))

  expect(hero?.id).toBe(1)
})
