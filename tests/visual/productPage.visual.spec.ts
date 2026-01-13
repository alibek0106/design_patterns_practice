import { test, expect } from '../../fixtures/pageFixtures';
import { ScreenshotNames, TestProducts } from '../data/visualTestData';
import { ApiEndpoints } from '../data/ApiEndpoints';

test.describe('Product Page Visual Tests', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.navigate();
    });

    test('should match product page full baseline - Samsung Galaxy S6', async ({ page, homePage, visualHelper }) => {
        const viewProductPromise = visualHelper.waitForNetworkResponse(ApiEndpoints.product.view);
        await homePage.selectProduct(TestProducts.phones.samsungGalaxyS6);
        await viewProductPromise;
        await visualHelper.waitForStability();

        await expect(page).toHaveScreenshot(ScreenshotNames.productPage.full);
    });

    test('should match product details section', async ({ homePage, productPage, visualHelper }) => {
        const viewProductPromise = visualHelper.waitForNetworkResponse(ApiEndpoints.product.view);
        await homePage.selectProduct(TestProducts.laptops.sonyVaio);
        await viewProductPromise;
        await visualHelper.waitForStability();

        const detailsSection = productPage.getProductContent();
        await expect(detailsSection).toHaveScreenshot(ScreenshotNames.productPage.details);
    });

    test('should match product image', async ({ homePage, productPage, visualHelper }) => {
        const viewProductPromise = visualHelper.waitForNetworkResponse(ApiEndpoints.product.view);
        await homePage.selectProduct(TestProducts.monitors.appleMonitor);
        await viewProductPromise;
        await visualHelper.waitForStability();

        await productPage.verifyProductImageVisual(ScreenshotNames.productPage.image);
    });

    test('should match add to cart button state', async ({ homePage, productPage, visualHelper }) => {
        const viewProductPromise = visualHelper.waitForNetworkResponse(ApiEndpoints.product.view);
        await homePage.selectProduct(TestProducts.phones.iphone6);
        await viewProductPromise;
        await visualHelper.waitForStability();

        const addToCartBtn = productPage.getAddToCartButton();
        await expect(addToCartBtn).toHaveScreenshot(ScreenshotNames.productPage.addToCartButton);
    });

    test.describe('Different Product Types', () => {
        const productTypes = [
            { product: TestProducts.monitors.asusMonitor, screenshotKey: 'monitorLayout' as const },
            { product: TestProducts.laptops.dell2017, screenshotKey: 'laptopLayout' as const },
            { product: TestProducts.phones.nexus6, screenshotKey: 'phoneLayout' as const },
        ];

        for (const { product, screenshotKey } of productTypes) {
            test(`should match ${screenshotKey.replace('Layout', '').toLowerCase()} product layout`, async ({ page, homePage, productPage, visualHelper }) => {
                await homePage.navigate(); // Reset state
                const viewProductPromise = visualHelper.waitForNetworkResponse(ApiEndpoints.product.view);
                await homePage.selectProduct(product);
                await viewProductPromise;

                // Wait for product image specifically
                const productImage = productPage.getProductImage();
                await productImage.waitFor({ state: 'visible', timeout: 10000 });

                // Validate image is actually loaded (non-zero width)
                await page.waitForFunction(
                    (el) => (el as HTMLImageElement).naturalWidth > 0,
                    await productImage.elementHandle(),
                    { timeout: 5000 }
                );

                await visualHelper.waitForStability();
                await visualHelper.takeScreenshot(ScreenshotNames.productPage[screenshotKey]);
            });
        }
    });
});