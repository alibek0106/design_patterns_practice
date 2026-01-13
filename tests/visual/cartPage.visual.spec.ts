import { test, expect } from '../../fixtures/pageFixtures';
import { ScreenshotNames, TestProducts } from '../data/visualTestData';
import { ApiEndpoints } from '../data/ApiEndpoints';
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

    // Wait for add to cart network response
    const addToCartPromise = visualHelper.waitForNetworkResponse(ApiEndpoints.product.addToCart);
    await productPage.addToCart();
    await addToCartPromise;

    await visualHelper.waitForStability();
}

test.describe('Cart Page Visual Tests', () => {
    test('should match empty cart baseline', async ({ cartPage, visualHelper }) => {
        const viewCartPromise = visualHelper.waitForNetworkResponse(ApiEndpoints.cart.viewCart);
        await cartPage.navigate();
        await viewCartPromise;
        await visualHelper.waitForStability();

        await cartPage.verifyCartVisual(ScreenshotNames.cartPage.empty);
    });

    test('should match cart with single item', async ({ page, homePage, productPage, cartPage, visualHelper }) => {
        await addProductToCart(homePage, productPage, visualHelper, TestProducts.phones.samsungGalaxyS6);

        const viewCartPromise = visualHelper.waitForNetworkResponse(ApiEndpoints.cart.viewCart);
        await cartPage.navigate();
        await viewCartPromise;
        await visualHelper.waitForStability();

        await expect(page).toHaveScreenshot(ScreenshotNames.cartPage.singleItem);
    });

    test('should match cart with multiple items', async ({ page, homePage, productPage, cartPage, visualHelper }) => {
        await addProductToCart(homePage, productPage, visualHelper, TestProducts.phones.samsungGalaxyS6);
        await addProductToCart(homePage, productPage, visualHelper, TestProducts.laptops.sonyVaio);

        const viewCartPromise = visualHelper.waitForNetworkResponse(ApiEndpoints.cart.viewCart);
        await cartPage.navigate();
        await viewCartPromise;
        await visualHelper.waitForStability();

        await expect(page).toHaveScreenshot(ScreenshotNames.cartPage.multipleItems);
    });

    test('should match cart table visual baseline', async ({ homePage, productPage, cartPage, visualHelper }) => {
        await addProductToCart(homePage, productPage, visualHelper, TestProducts.phones.samsungGalaxyS7);

        const viewCartPromise = visualHelper.waitForNetworkResponse(ApiEndpoints.cart.viewCart);
        await cartPage.navigate();
        await viewCartPromise;
        await visualHelper.waitForStability();

        const cartTable = cartPage.getCartTable();
        await expect(cartTable).toHaveScreenshot(ScreenshotNames.cartPage.table);
    });

    test('should match place order modal', async ({ homePage, productPage, cartPage, visualHelper }) => {
        await addProductToCart(homePage, productPage, visualHelper, TestProducts.monitors.appleMonitor);

        const viewCartPromise = visualHelper.waitForNetworkResponse(ApiEndpoints.cart.viewCart);
        await cartPage.navigate();
        await viewCartPromise;
        await visualHelper.waitForStability();

        const modal = await cartPage.showOrderModal();
        await expect(modal).toHaveScreenshot(ScreenshotNames.modals.placeOrder);
    });

    test('should match cart total price section', async ({ homePage, productPage, cartPage, visualHelper }) => {
        await addProductToCart(homePage, productPage, visualHelper, TestProducts.laptops.macBookAir);

        const viewCartPromise = visualHelper.waitForNetworkResponse(ApiEndpoints.cart.viewCart);
        await cartPage.navigate();
        await viewCartPromise;
        await visualHelper.waitForStability();

        const totalSection = cartPage.getTotalPriceSection();
        await expect(totalSection).toHaveScreenshot(ScreenshotNames.cartPage.totalPrice);
    });
});
