import { test, expect } from '../../fixtures/pageFixtures';
import { ScreenshotNames, TestProducts } from '../data/visualTestData';
import { ApiEndpoints } from '../data/ApiEndpoints';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { VisualTestHelper } from '../../helpers/visualTestHelpers';



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

        await expect(page).toHaveScreenshot(ScreenshotNames.cartPage.singleItem);
    });

    test('should match cart with multiple items', async ({ page, homePage, productPage, cartPage, visualHelper }) => {
        await productPage.addProductFromHome(homePage, TestProducts.phones.samsungGalaxyS6);
        await productPage.addProductFromHome(homePage, TestProducts.laptops.sonyVaio);

        await cartPage.navigate();
        await visualHelper.waitForNetworkResponse(ApiEndpoints.cart.viewCart);
        await visualHelper.ensurePageLoaded();

        await expect(page).toHaveScreenshot(ScreenshotNames.cartPage.multipleItems);
    });

    test('should match cart table visual baseline', async ({ homePage, productPage, cartPage, visualHelper }) => {
        await productPage.addProductFromHome(homePage, TestProducts.phones.samsungGalaxyS7);

        const viewCartPromise = visualHelper.waitForNetworkResponse(ApiEndpoints.cart.viewCart);
        await cartPage.navigate();
        await viewCartPromise;
        await visualHelper.ensurePageLoaded();

        const cartTable = cartPage.getCartTable();
        await expect(cartTable).toHaveScreenshot(ScreenshotNames.cartPage.table);
    });

    test('should match place order modal', async ({ homePage, productPage, cartPage, visualHelper }) => {
        await productPage.addProductFromHome(homePage, TestProducts.monitors.appleMonitor);

        const viewCartPromise = visualHelper.waitForNetworkResponse(ApiEndpoints.cart.viewCart);
        await cartPage.navigate();
        await viewCartPromise;
        await visualHelper.ensurePageLoaded();

        const modal = await cartPage.showOrderModal();
        await expect(modal).toHaveScreenshot(ScreenshotNames.modals.placeOrder);
    });

    test('should match cart total price section', async ({ homePage, productPage, cartPage, visualHelper }) => {
        await productPage.addProductFromHome(homePage, TestProducts.laptops.macBookAir);

        const viewCartPromise = visualHelper.waitForNetworkResponse(ApiEndpoints.cart.viewCart);
        await cartPage.navigate();
        await viewCartPromise;
        await visualHelper.ensurePageLoaded();

        const totalSection = cartPage.getTotalPriceSection();
        await expect(totalSection).toHaveScreenshot(ScreenshotNames.cartPage.totalPrice);
    });
});
