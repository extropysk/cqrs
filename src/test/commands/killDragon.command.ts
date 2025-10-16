import { Command } from '@/types'

export class KillDragonCommand extends Command<{
  actionId: string // This type represents the command execution result
}> {
  constructor(
    public readonly heroId: number,
    public readonly dragonId: number,
  ) {
    super()
  }
}
