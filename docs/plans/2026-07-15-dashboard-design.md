# Sprint 1 Dashboard Design

## Status

Approved on 2026-07-15.

## Objective

Establish the production-ready frontend foundation for Crypto-Pro-AI and deliver a professional, responsive dashboard that presents live Binance market data while keeping future Firebase and TradingView integrations isolated and ready to activate.

## Technical Direction

- Next.js App Router
- React and strict TypeScript
- Tailwind CSS
- TanStack Query for server-state management
- Zod for external-data validation
- Lucide React for icons
- Sonner for notifications
- Firebase client configuration placeholders
- TradingView Lightweight Charts wrapper and container placeholders

## Architecture

The codebase will use feature-oriented boundaries:

```
app/
components/
  ui/
features/
  dashboard/
  market/
services/
  binance/
hooks/
lib/
types/
```

The dashboard feature owns composition and presentation. Market services own provider-specific API calls and transformation. Route handlers expose stable, validated application DTOs to the frontend. Shared primitives remain in `components/ui`.

## Data Flow

1. Dashboard widgets request application endpoints through feature hooks.
2. Next.js route handlers call the Binance service.
3. The Binance service validates provider responses with Zod and maps them to internal types.
4. TanStack Query caches responses and refreshes live market data every 30 seconds.
5. The UI renders loading skeletons, data, or an explicit unavailable state.

The initial implementation will use REST polling. WebSocket streaming will be deferred to the Markets phase.

## Dashboard Scope

- Collapsible left sidebar and responsive mobile drawer
- Top navigation
- Market overview cards for BTC, ETH, and SOL
- Watchlist
- Signals panel
- Trade-plan preview
- Recent analysis panel
- Dark desktop-first professional visual system
- Live public Binance price data

The existing prototype behaviour is represented through the dashboard composition, but full technical analysis and advanced chart functionality are deferred to their planned phases.

## Integration Readiness

Firebase configuration will be isolated behind a service boundary and not activated until authentication is implemented. TradingView Lightweight Charts will be wrapped behind a reusable component and initially rendered in a prepared dashboard area. No API secrets will be stored in the repository.

## Error Handling

- Validate all provider payloads before presenting them to the UI.
- Render loading skeletons during the initial request.
- Render a concise unavailable state on upstream failure.
- Do not present invented mock prices as live data.

## Testing

- Unit tests for Binance response validation and mapping.
- Rendering test for the dashboard's primary state.
- Type checking and linting in the initial quality gate.

## Git Strategy

The repository will be initialized with this approved design document. Implementation will proceed from `develop` through `feature/dashboard`, with separate commits for the application foundation and the dashboard feature.
