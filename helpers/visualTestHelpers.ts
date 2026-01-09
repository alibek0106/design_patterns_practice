import { Page, Locator } from '@playwright/test';
import { VisualTestConfig } from '../tests/config/visualTestConfig';

export class VisualTestHelper {
    constructor(private page: Page) { }

    /**
     * Wait for page to be stable before taking screenshot
     * Using 'load' instead of 'networkidle' as DemoBlaze has continuous network activity
     */
    async waitForStability(timeout = 1000): Promise<void> {
        await this.page.waitForLoadState('load');
        await this.page.waitForLoadState('domcontentloaded');
        // Wait for any animations or transitions to complete
        await this.page.waitForTimeout(timeout);
    }

    /**
     * Wait for specific element to be stable (no size/position changes)
     */
    async waitForElementStability(locator: Locator, timeout = 3000): Promise<void> {
        await locator.waitFor({ state: 'visible' });

        // Wait for element to stop changing size
        let previousBox = await locator.boundingBox();
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            await this.page.waitForTimeout(100);
            const currentBox = await locator.boundingBox();

            if (previousBox && currentBox &&
                previousBox.height === currentBox.height &&
                previousBox.width === currentBox.width) {
                // Element is stable
                await this.page.waitForTimeout(300); // Extra buffer
                return;
            }
            previousBox = currentBox;
        }
    }

    /**
     * Hide dynamic elements before screenshot
     */
    async hideDynamicElements(selectors: string[]): Promise<void> {
        for (const selector of selectors) {
            await this.page.locator(selector).evaluateAll(elements => {
                elements.forEach(el => (el as HTMLElement).style.visibility = 'hidden');
            }).catch(() => {
                // Ignore if selector doesn't exist
            });
        }
    }

    /**
     * Set viewport for responsive testing
     */
    async setViewport(device: 'desktop' | 'laptop'): Promise<void> {
        const viewport = VisualTestConfig.viewports[device];
        await this.page.setViewportSize(viewport);
    }

    /**
     * Mask carousel and other dynamic elements
     */
    getMaskLocators(): Locator[] {
        return VisualTestConfig.maskSelectors.carousel.map(selector =>
            this.page.locator(selector)
        );
    }

    /**
     * Take screenshot with standard options
     */
    async takeScreenshot(name: string, options: any = {}): Promise<void> {
        const { expect } = await import('@playwright/test');
        await expect(this.page).toHaveScreenshot(name, {
            ...VisualTestConfig.screenshots,
            ...options,
        });
    }

    /**
     * Take element screenshot with standard options
     */
    async takeElementScreenshot(locator: Locator, name: string, options: any = {}): Promise<void> {
        const { expect } = await import('@playwright/test');
        await expect(locator).toHaveScreenshot(name, {
            ...VisualTestConfig.screenshots,
            ...options,
        });
    }

    /**
     * Scroll element into view before screenshot
     */
    async scrollIntoView(locator: Locator): Promise<void> {
        await locator.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500); // Wait for scroll animation
    }

    /**
     * Wait for images to load in a specific container
     */
    async waitForImages(containerLocator?: Locator): Promise<void> {
        const container = containerLocator || this.page.locator('body');
        await container.locator('img').evaluateAll(images => {
            return Promise.all(
                images.map(img => {
                    if ((img as HTMLImageElement).complete) return Promise.resolve();
                    return new Promise(resolve => {
                        img.addEventListener('load', resolve);
                        img.addEventListener('error', resolve);
                    });
                })
            );
        });
    }
}