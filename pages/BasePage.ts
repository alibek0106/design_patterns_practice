import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
    protected page: Page;
    protected abstract readonly pageUrl?: string;

    constructor(page: Page) {
        this.page = page;
    }

    // Template Method Pattern - subclasses can override
    async navigate(path?: string): Promise<this> {
        const url = path || this.pageUrl || '';
        await this.page.goto(`${process.env.BASE_URL}${url}`);
        return this;
    }

    // Common wait utilities
    protected async waitForVisible(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'visible' });
    }

    protected async waitForHidden(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'hidden' });
    }

    // Dialog handler - reusable pattern
    protected async handleDialog(action: () => Promise<void>, accept = true): Promise<void> {
        this.page.once('dialog', async dialog => {
            accept ? await dialog.accept() : await dialog.dismiss();
        });
        await action();
    }

    // Visual testing method in base
    async verifyVisualBaseline(screenshotName: string, options?: any): Promise<void> {
        const { expect } = await import('@playwright/test');
        await expect(this.page).toHaveScreenshot(screenshotName, options);
    }

    async verifyElementVisual(locator: Locator, screenshotName: string, options?: any): Promise<void> {
        const { expect } = await import('@playwright/test');
        await expect(locator).toHaveScreenshot(screenshotName, options);
    }
}