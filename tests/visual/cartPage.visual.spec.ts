import { test, expect } from '../../fixtures/pageFixtures';
import { ScreenshotNames, TestProducts } from '../data/visualTestData';
import { ApiEndpoints } from '../data/ApiEndpoints';



test.describe('Cart Page Visual Tests', () => {
    test('should match empty cart baseline', async ({ cartPage, visualHelper }) => {
        const viewCartPromise = visualHelper.waitForNetworkResponse(ApiEndpoints.cart.viewCart);
        await cartPage.navigate();
        await viewCartPromise;
        await visualHelper.ensurePageLoaded();

        await cartPage.verifyCartVisual(ScreenshotNames.cartPage.empty);
    });

    test('should match cart with single item', async ({ page, homePage, productPage, cartPage, visualHelper }) => {
        await productPage.addProductFromHome(homePage, TestProducts.phones.samsungGalaxyS6);

        await cartPage.navigate();
        await visualHelper.waitForNetworkResponse(ApiEndpoints.cart.viewCart);
        await visualHelper.ensurePageLoaded();

        await expect(page, 'Cart should have single item').toHaveScreenshot(ScreenshotNames.cartPage.singleItem);
    });

    test('should match cart with multiple items', async ({ page, homePage, productPage, cartPage, visualHelper }) => {
        await productPage.addProductFromHome(homePage, TestProducts.phones.samsungGalaxyS6);
        await productPage.addProductFromHome(homePage, TestProducts.laptops.sonyVaio);

        await cartPage.navigate();
        await visualHelper.waitForNetworkResponse(ApiEndpoints.cart.viewCart);
        await visualHelper.ensurePageLoaded();

        await expect(page, 'Cart should have multiple items').toHaveScreenshot(ScreenshotNames.cartPage.multipleItems);
    });

    test('should match cart table visual baseline', async ({ homePage, productPage, cartPage, visualHelper }) => {
        await productPage.addProductFromHome(homePage, TestProducts.phones.samsungGalaxyS7);

        await cartPage.navigate();
        await visualHelper.waitForNetworkResponse(ApiEndpoints.cart.viewCart);
        await visualHelper.ensurePageLoaded();

        const cartTable = cartPage.getCartTable();
        await expect(cartTable, 'Cart table should match baseline').toHaveScreenshot(ScreenshotNames.cartPage.table);
    });

    test('should match place order modal', async ({ homePage, productPage, cartPage, visualHelper }) => {
        await productPage.addProductFromHome(homePage, TestProducts.monitors.appleMonitor);

        await cartPage.navigate();
        await visualHelper.waitForNetworkResponse(ApiEndpoints.cart.viewCart);
        await visualHelper.ensurePageLoaded();

        const modal = await cartPage.showOrderModal();
        await expect(modal, 'Place order modal should match baseline').toHaveScreenshot(ScreenshotNames.modals.placeOrder);
    });

    test('should match cart total price section', async ({ homePage, productPage, cartPage, visualHelper }) => {
        await productPage.addProductFromHome(homePage, TestProducts.laptops.macBookAir);

        await cartPage.navigate();
        await visualHelper.waitForNetworkResponse(ApiEndpoints.cart.viewCart);
        await visualHelper.ensurePageLoaded();

        const totalSection = cartPage.getTotalPriceSection();
        await expect(totalSection, 'Total price section should match baseline').toHaveScreenshot(ScreenshotNames.cartPage.totalPrice);
    });
});
