import { test, expect } from '../../fixtures/pageFixtures';
import { ScreenshotNames, TestProducts } from '../data/visualTestData';

test.describe('Product Page Visual Tests', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.navigate();
    });

    test('should match product page full baseline - Samsung Galaxy S6', async ({ page, homePage, visualHelper }) => {
        await homePage.selectProduct(TestProducts.phones.samsungGalaxyS6);
        await visualHelper.waitForStability();

        await expect(page).toHaveScreenshot(ScreenshotNames.productPage.full);
    });

    test('should match product details section', async ({ homePage, productPage, visualHelper }) => {
        await homePage.goToCategory('Laptops');
        await homePage.selectProduct(TestProducts.laptops.sonyVaio);
        await visualHelper.waitForStability();

        const detailsSection = productPage.getProductContent();
        await expect(detailsSection).toHaveScreenshot(ScreenshotNames.productPage.details);
    });

    test('should match product image', async ({ homePage, productPage, visualHelper }) => {
        await homePage.goToCategory('Monitors');
        await homePage.selectProduct(TestProducts.monitors.appleMonitor);
        await visualHelper.waitForStability();

        await productPage.verifyProductImageVisual(ScreenshotNames.productPage.image);
    });

    test('should match add to cart button state', async ({ homePage, productPage, visualHelper }) => {
        await homePage.goToCategory('Phones');
        await homePage.selectProduct(TestProducts.phones.iphone6);
        await visualHelper.waitForStability();

        const addToCartBtn = productPage.getAddToCartButton();
        await expect(addToCartBtn).toHaveScreenshot(ScreenshotNames.productPage.addToCartButton);
    });

    test.describe('Different Product Types', () => {
        const productTypes = [
            { category: 'Monitors' as const, product: TestProducts.monitors.asusMonitor, screenshotKey: 'monitorLayout' as const },
            { category: 'Laptops' as const, product: TestProducts.laptops.dell2017, screenshotKey: 'laptopLayout' as const },
            { category: 'Phones' as const, product: TestProducts.phones.nexus6, screenshotKey: 'phoneLayout' as const },
        ];

        for (const { category, product, screenshotKey } of productTypes) {
            test(`should match ${category.toLowerCase()} product layout`, async ({ homePage, visualHelper }) => {
                await homePage.goToCategory(category);
                await homePage.selectProduct(product);
                await visualHelper.waitForStability();

                await visualHelper.takeScreenshot(ScreenshotNames.productPage[screenshotKey]);
            });
        }
    });
});