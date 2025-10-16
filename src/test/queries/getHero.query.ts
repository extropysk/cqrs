import { Query } from '@/types'
import { Hero } from '@/test/repository/hero.repository'

export class GetHeroQuery extends Query<Hero | null> {
  constructor(public readonly heroId: number) {
    super()
  }
}
