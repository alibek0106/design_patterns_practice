import { test, expect } from '../../fixtures/pageFixtures';
import { ScreenshotNames } from '../data/visualTestData';
import { ApiEndpoints } from '../data/ApiEndpoints';

test.describe('Homepage Visual Tests', () => {
    test.beforeEach(async ({ homePage, visualHelper }) => {
        await homePage.navigate();
        await visualHelper.ensurePageLoaded();
    });

    test('should match full homepage baseline', async ({ page, homePage, visualHelper }) => {
        await homePage.getFirstProductCard().waitFor({ state: 'visible' });
        await visualHelper.waitForImages();

        await expect(page).toHaveScreenshot(ScreenshotNames.homepage.full, {
            mask: visualHelper.getMaskLocators(),
        });
    });

    test('should match navbar visual baseline', async ({ homePage }) => {
        await homePage.verifyElementVisual(
            homePage.getNavbar(),
            ScreenshotNames.homepage.navbar
        );
    });

    test('should match categories section visual baseline', async ({ homePage }) => {
        await homePage.verifyCategoryListVisual(ScreenshotNames.homepage.categories);
    });

    test('should match product card visual baseline', async ({ homePage, visualHelper }) => {
        const firstCard = homePage.getFirstProductCard();

        await firstCard.waitFor({ state: 'visible' });
        await visualHelper.waitForElementStability(firstCard);
        await firstCard.locator('img').waitFor({ state: 'visible' });
        await visualHelper.waitForImages(firstCard);

        await expect(firstCard).toHaveScreenshot(ScreenshotNames.homepage.productCard, {
            maxDiffPixels: 200,
        });
    });

    test.describe('Modal Visual Tests', () => {
        test('should match login modal appearance', async ({ homePage, visualHelper }) => {
            await visualHelper.hideDynamicElements(['.card', '.carousel-inner']);
            const modal = await homePage.showLoginModal();
            await expect(modal).toHaveScreenshot(ScreenshotNames.modals.login);
        });

        test('should match signup modal appearance', async ({ homePage, visualHelper }) => {
            await visualHelper.hideDynamicElements(['.card', '.carousel-inner']);
            const modal = await homePage.showSignUpModal();
            await expect(modal).toHaveScreenshot(ScreenshotNames.modals.signUp);
        });
    });

    test.describe('Category Visual Tests', () => {
        const categories = [
            { name: 'Monitors', screenshotKey: 'monitors' },
            { name: 'Laptops', screenshotKey: 'laptops' },
            { name: 'Phones', screenshotKey: 'phones' },
        ] as const;

        for (const category of categories) {
            test(`should match ${category.name.toLowerCase()} category view`, async ({ page, homePage, visualHelper }) => {
                const categoryPromise = visualHelper.waitForNetworkResponse(ApiEndpoints.category.byCategory);
                await homePage.goToCategory(category.name);
                await categoryPromise;

                await homePage.getFirstProductCard().waitFor({ state: 'visible' });
                await visualHelper.waitForImages();
                await visualHelper.ensurePageLoaded();

                await expect(page).toHaveScreenshot(
                    ScreenshotNames.categories[category.screenshotKey],
                    {
                        mask: visualHelper.getMaskLocators(),
                    }
                );
            });
        }
    });
});