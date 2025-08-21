import { IQueryHandler } from '../../types'
import { HeroRepository } from '../repository/hero.repository'
import { GetHeroQuery } from './getHero.query'

export class GetHeroHandler implements IQueryHandler<GetHeroQuery> {
  constructor(private repository: HeroRepository) {}

  async execute(query: GetHeroQuery) {
    return this.repository.findOneById(query.heroId)
  }
}
