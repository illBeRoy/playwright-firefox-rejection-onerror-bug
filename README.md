# Playwright Page.OnError Bug in Firefox

This repo demonstrates a bug in playwright that causes some unhandled errors in Firefox to not make it to [page.on('pageerror')](https://playwright.dev/docs/api/class-page#page-event-page-error).

Relevant issue: [microsoft/playwright#14165](https://github.com/microsoft/playwright/issues/14165)

## Usage
### Running the Demo
- Start by cloning this repo, and then run `yarn` inside the directory (`npm` should work too, probably).
- Run `yarn test`
  - If you need to initialize playwright, run `yarn playwright install`
- The results should be: one failing test (that demonstrates the bug), and another passing test (that demonstrates a workaround)

```sh
Running 2 tests using 1 worker

  ✘  [firefox] › example.spec.ts:10:3 › Firefox Bug › catch errors from unhandled rejects using page.on("pageerror") (1s)
  ✓  [firefox] › example.spec.ts:30:3 › Firefox Bug › workaround: rethrow error from window.onunhandledrejection (781ms)
```

### What's Inside
The project contains two main files:
1. The test file (`example.spec.ts`)
2. A helper file that runs a server (`helpers/html-server.ts`)

The helper `HtmlServer` class is what generates the pages that we later tell playwright to visit.

There are two tests that do the following:
1. Define an HTML page that should be served from the server
2. Add the `Page.on('pageerror')` event handler, which sets a boolean value if called
3. Visit the page, and wait for it to load
4. Assert that the boolean value is true

The first test simply rejects an arbitrary promise. Expected behavior: `pageerror` is called. Actual Behavior: it was not called.

The second test also handles unhandledrejection on the window and rethrows them. This is actually a workaround, and will indeed trigger `pageerror` since the error was rethrown from a non-async context.
