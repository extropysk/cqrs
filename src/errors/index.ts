export class CommandHandlerNotFoundException extends Error {
  constructor(commandName: string) {
    super(`No handler found for the command: "${commandName}".`)
  }
}

export class QueryHandlerNotFoundException extends Error {
  constructor(queryName: string) {
    super(`No handler found for the query: "${queryName}"`)
  }
}
