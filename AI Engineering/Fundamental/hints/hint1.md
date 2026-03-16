Focus on where the failure can happen.

Only the AI request itself is risky.
That's the part of the function
that should be wrapped.

You don't need to move code around —
just surround the request logic
with a try / catch.

These docs might help: https://scrimba.com/mdn-try-catch
