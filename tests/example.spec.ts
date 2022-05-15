import { test, expect } from '@playwright/test';
import { HtmlServer } from './helpers/html-server';

const server = new HtmlServer();

test.beforeAll(() => server.start());
test.afterAll(() => server.stop());

test.describe('Firefox Bug', () => {
  test('catch errors from unhandled rejects using page.on("pageerror")', async ({ page }) => {
    server.given.pageHtml(`
      <html>
        <body>
          <script>
            Promise.reject(new Error('sad :('));
          </script>
        </body>
      </html> 
    `)

    let pageErrorCalled = false;
    page.on('pageerror',() => (pageErrorCalled = true));

    await page.goto(server.get.url());
    await page.waitForLoadState();

    expect(pageErrorCalled).toBe(true);
  });

  test('workaround: rethrow error from window.onunhandledrejection', async ({ page }) => {
    server.given.pageHtml(`
      <html>
        <body>
          <script>
            window.addEventListener('unhandledrejection', e => {
              throw e.reason;
            });

            Promise.reject(new Error('sad :('));
          </script>
        </body>
      </html> 
    `)

    let pageErrorCalled = false;
    page.on('pageerror',() => (pageErrorCalled = true));

    await page.goto(server.get.url());
    await page.waitForLoadState();

    expect(pageErrorCalled).toBe(true);
  });
});
