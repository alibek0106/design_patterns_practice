import { test, expect } from '../../fixtures/pageFixtures';
import { ScreenshotNames, TestProducts } from '../data/visualTestData';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { VisualTestHelper } from '../../helpers/visualTestHelpers';

/**
 * Helper to add a product to cart
 */
async function addProductToCart(
    homePage: HomePage,
    productPage: ProductPage,
    visualHelper: VisualTestHelper,
    productName: string
): Promise<void> {
    await homePage.navigate();
    await homePage.selectProduct(productName);
    await visualHelper.waitForStability();
    await productPage.addToCart();
}

test.describe('Cart Page Visual Tests', () => {
    test('should match empty cart baseline', async ({ cartPage, visualHelper }) => {
        await cartPage.navigate();
        await visualHelper.waitForStability();

        await cartPage.verifyCartVisual(ScreenshotNames.cartPage.empty);
    });

    test('should match cart with single item', async ({ page, homePage, productPage, cartPage, visualHelper }) => {
        await addProductToCart(homePage, productPage, visualHelper, TestProducts.phones.samsungGalaxyS6);

        await cartPage.navigate();
        await visualHelper.waitForStability();

        await expect(page).toHaveScreenshot(ScreenshotNames.cartPage.singleItem);
    });

    test('should match cart with multiple items', async ({ page, homePage, productPage, cartPage, visualHelper }) => {
        await addProductToCart(homePage, productPage, visualHelper, TestProducts.phones.samsungGalaxyS6);
        await addProductToCart(homePage, productPage, visualHelper, TestProducts.laptops.sonyVaio);

        await cartPage.navigate();
        await visualHelper.waitForStability();

        await expect(page).toHaveScreenshot(ScreenshotNames.cartPage.multipleItems);
    });

    test('should match cart table visual baseline', async ({ homePage, productPage, cartPage, visualHelper }) => {
        await addProductToCart(homePage, productPage, visualHelper, TestProducts.phones.samsungGalaxyS7);

        await cartPage.navigate();
        await visualHelper.waitForStability();

        const cartTable = cartPage.getCartTable();
        await expect(cartTable).toHaveScreenshot(ScreenshotNames.cartPage.table);
    });

    test('should match place order modal', async ({ homePage, productPage, cartPage, visualHelper }) => {
        await addProductToCart(homePage, productPage, visualHelper, TestProducts.monitors.appleMonitor);

        await cartPage.navigate();
        await visualHelper.waitForStability();

        const modal = await cartPage.showOrderModal();
        await expect(modal).toHaveScreenshot(ScreenshotNames.modals.placeOrder);
    });

    test('should match cart total price section', async ({ homePage, productPage, cartPage, visualHelper }) => {
        await addProductToCart(homePage, productPage, visualHelper, TestProducts.laptops.macBookAir);

        await cartPage.navigate();
        await visualHelper.waitForStability();

        const totalSection = cartPage.getTotalPriceSection();
        await expect(totalSection).toHaveScreenshot(ScreenshotNames.cartPage.totalPrice);
    });
});
