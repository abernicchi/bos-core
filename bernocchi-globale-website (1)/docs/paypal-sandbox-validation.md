# PayPal Sandbox Validation

Temporary validation record for the Casa Bernocchi payment integration.

- Environment: PayPal Sandbox
- Production payments remain disabled.
- PayPal credentials are stored in Netlify environment variables.
- Checkout creates provider orders server-side and captures server-side.
- Payment amounts originate from the institutional service catalogue.
- Supabase remains the source of truth for reservation/payment state.
- Final production activation requires a completed sandbox payment and webhook validation.

This file exists to trigger an isolated Netlify deploy preview for validation and may be removed after production activation.
