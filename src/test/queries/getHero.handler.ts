import { IQueryHandler } from '@/types'
import { HeroRepository } from '@/test/repository/hero.repository'
import { GetHeroQuery } from '@/test/queries/getHero.query'

export class GetHeroHandler implements IQueryHandler<GetHeroQuery> {
  constructor(private repository: HeroRepository) {}

  resolveName(): string {
    return GetHeroQuery.name
  }

  async execute(query: GetHeroQuery) {
    return this.repository.findOneById(query.heroId)
  }
}
