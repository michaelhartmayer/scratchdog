import { test, expect } from '@playwright/test';

test('2.5.4 Audio assets are only requested once from the network', async ({
  page,
}) => {
  const audioRequests: string[] = [];

  // Intercept all requests to /audio/
  page.on('request', (request) => {
    const url = request.url();
    if (url.includes('/audio/') && url.endsWith('.mp3')) {
      audioRequests.push(url);
    }
  });

  await page.goto('/');
  await page.click('body'); // skip splash

  // Wait for main menu to be visible
  await expect(page.getByTestId('main-menu')).toBeVisible();

  // Wait a bit for any duplicate requests to happen
  await page.waitForTimeout(2000);

  // Count requests per URL
  const requestCounts = new Map<string, number>();
  for (const url of audioRequests) {
    requestCounts.set(url, (requestCounts.get(url) ?? 0) + 1);
  }

  // Assert each audio URL was only requested once
  for (const [url, count] of requestCounts) {
    expect(count, `${url} was requested ${String(count)} times`).toBe(1);
  }
});
