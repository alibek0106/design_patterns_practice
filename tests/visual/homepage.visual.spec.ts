import { test, expect } from '../../fixtures/pageFixtures';
import { ScreenshotNames } from '../data/visualTestData';
import { VisualTestHelper } from '../../helpers/visualTestHelpers';
import { VisualTestConfig } from '../config/visualTestConfig';

test.describe('Homepage Visual Tests', () => {
    let visualHelper: VisualTestHelper;

    test.beforeEach(async ({ page, homePage }) => {
        visualHelper = new VisualTestHelper(page);
        await homePage.navigate();
        await visualHelper.waitForStability(1500);
    });

    test('should match full homepage baseline', async ({ page, homePage }) => {
        await homePage.getFirstProductCard().waitFor({ state: 'visible' });
        await visualHelper.waitForImages();

        await expect(page).toHaveScreenshot(ScreenshotNames.homepage.full, {
            ...VisualTestConfig.screenshots,
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

    test('should match product card visual baseline', async ({ homePage }) => {
        const firstCard = homePage.getFirstProductCard();

        // Wait for card to be visible and stable
        await firstCard.waitFor({ state: 'visible' });
        await visualHelper.waitForElementStability(firstCard);

        // Wait for image inside card to load
        await firstCard.locator('img').waitFor({ state: 'visible' });
        await visualHelper.waitForImages(firstCard);

        await expect(firstCard).toHaveScreenshot(ScreenshotNames.homepage.productCard, {
            ...VisualTestConfig.screenshots,
            maxDiffPixels: 200, // Card content can vary
        });
    });

    test.describe('Modal Visual Tests', () => {
        test('should match login modal appearance', async ({ homePage }) => {
            const modal = await homePage.showLoginModal();
            await expect(modal).toHaveScreenshot(ScreenshotNames.modals.login);
        });

        test('should match signup modal appearance', async ({ homePage }) => {
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
            test(`should match ${category.name.toLowerCase()} category view`, async ({ page, homePage }) => {
                await homePage.goToCategory(category.name);
                await homePage.getFirstProductCard().waitFor({ state: 'visible' });
                await visualHelper.waitForStability(1000);

                await expect(page).toHaveScreenshot(
                    ScreenshotNames.categories[category.screenshotKey],
                    {
                        ...VisualTestConfig.screenshots,
                        mask: visualHelper.getMaskLocators(),
                    }
                );
            });
        }
    });
});