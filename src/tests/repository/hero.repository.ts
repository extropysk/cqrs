export interface Hero {
  id: number
}

const data: Hero[] = [{ id: 1 }, { id: 2 }]

export class HeroRepository {
  async findOneById(id: number): Promise<Hero | null> {
    return data.find(hero => hero.id === id) ?? null
  }

  async findAll(): Promise<Hero[]> {
    return data
  }
}
