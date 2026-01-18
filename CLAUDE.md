# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Install dependencies
yarn install

# Build the library (TypeScript + Vite)
yarn build

# Watch mode for development
yarn dev

# Run tests
yarn test:run

# Run test in watch mode
yarn test

# Lint
yarn lint
```

## Architecture Overview

This is a TypeScript CQRS (Command Query Responsibility Segregation) library (`@extropysk/cqrs`) that provides bus-based abstractions for commands, queries, and events using RxJS.

### Core Pattern

All three buses (Command, Query, Event) extend `ObservableBus<T>` which wraps an RxJS `Subject` for reactive event streaming:

```
ObservableBus<T>
├── CommandBus (ICommandBus)
├── QueryBus (IQueryBus)
└── EventBus (IEventBus)
```

### Commands (`src/types/commands.ts`, `src/providers/commandBus.ts`)

- `Command<T>` - Base class with generic result type
- `ICommandHandler<TCommand>` - Implements `execute(command): Promise<Result>`
- `CommandBus.register(handler)` - Registers handler by command name
- `CommandBus.execute(command)` - Resolves handler and executes

### Queries (`src/types/queries.ts`, `src/providers/queryBus.ts`)

- `Query<T>` - Base class with generic result type
- `IQueryHandler<TQuery>` - Implements `execute(query): Promise<Result>`
- Same registration/execution pattern as commands

### Events (`src/types/events.ts`, `src/providers/eventBus.ts`)

- `BaseEvent` - Implements `IEvent`
- `IEventHandler<TEvent>` - Implements `handle(event)`
- `EventBus.register(handler)` - Creates RxJS subscription filtered by event type
- `EventBus.publish(event)` / `publishAll(events)` - Emits to subscribers
- `EventBus.destroy()` - Cleans up all subscriptions

### Handler Registration

Handlers are registered by name using `resolveName()` (returns constructor name). The bus maintains a `Map<string, Handler>` for lookup during execution.

## Path Aliases

TypeScript path alias configured: `@/*` maps to `src/*`

## Key Files

- `src/index.ts` - Main entry point, exports all public APIs
- `src/utils/observableBus.ts` - Base class for all buses
- `src/errors/index.ts` - `CommandHandlerNotFoundException`, `QueryHandlerNotFoundException`
