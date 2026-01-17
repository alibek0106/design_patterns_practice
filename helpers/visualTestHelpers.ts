import { Page, Locator, expect } from '@playwright/test';
import { VisualTestConfig } from '../tests/config/visualTestConfig';

export class VisualTestHelper {
    constructor(private page: Page) { }

    /**
     * Wait for page to be fully loaded
     * Effectively waits for the 'load' event
     */
    async ensurePageLoaded(): Promise<void> {
        await this.page.waitForLoadState('load');
    }

    /**
     * Wait for a specific network response with status check
     */
    async waitForNetworkResponse(urlPattern: string | RegExp, statusCode: number = 200): Promise<void> {
        await this.page.waitForResponse(response =>
            (typeof urlPattern === 'string' ? response.url().includes(urlPattern) : urlPattern.test(response.url())) &&
            response.status() === statusCode
        );
    }

    /**
     * Wait for no pending network requests (simple idle check)
     */
    async waitForNetworkIdle(timeout: number = 2000): Promise<void> {
        await this.page.waitForLoadState('networkidle', { timeout }).catch(() => {
            // Ignore timeout, just means network wasn't fully idle but we proceeded
        });
    }

    /**
     * Wait for specific element to be stable (no size/position changes)
     */
    async waitForElementStability(locator: Locator, maxAttempts = 10): Promise<void> {
        await locator.waitFor({ state: 'visible' });

        let previousBox = await locator.boundingBox();
        let stableCount = 0;

        for (let i = 0; i < maxAttempts; i++) {
            await this.page.waitForTimeout(100);
            const currentBox = await locator.boundingBox();

            if (previousBox && currentBox &&
                previousBox.height === currentBox.height &&
                previousBox.width === currentBox.width) {
                stableCount++;
                if (stableCount >= 2) {
                    return; // Element is stable
                }
            } else {
                stableCount = 0;
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
    async setViewport(device: keyof typeof VisualTestConfig.viewports): Promise<void> {
        const viewport = VisualTestConfig.viewports[device];
        await this.page.setViewportSize(viewport);
    }

    /**
     * Mask carousel and other dynamic elements
     */
    getMaskLocators(): Locator[] {
        return VisualTestConfig.maskSelectors.map(selector =>
            this.page.locator(selector)
        );
    }

    /**
     * Take screenshot with standard options
     */
    async takeScreenshot(name: string, options: object = {}): Promise<void> {
        await expect(this.page).toHaveScreenshot(name, {
            ...options,
        });
    }

    /**
     * Take element screenshot with standard options
     */
    async takeElementScreenshot(locator: Locator, name: string, options: object = {}): Promise<void> {
        await expect(locator).toHaveScreenshot(name, {
            ...options,
        });
    }

    /**
     * Scroll element into view before screenshot
     */
    async scrollIntoView(locator: Locator): Promise<void> {
        await locator.scrollIntoViewIfNeeded();
    }

    /**
     * Wait for images to load in a specific container with timeout
     */
    async waitForImages(containerLocator?: Locator, timeoutMs = 10000): Promise<void> {
        const container = containerLocator || this.page.locator('body');

        const imageLoadPromise = container.locator('img').evaluateAll(images => {
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

        await Promise.race([
            imageLoadPromise,
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Image load timeout')), timeoutMs)
            )
        ]).catch(() => {
            // Continue even if images timeout - test will fail on screenshot diff
        });
    }
}