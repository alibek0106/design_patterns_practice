import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { VisualTestHelper } from '../helpers/visualTestHelpers';

type PageFixtures = {
    homePage: HomePage;
    productPage: ProductPage;
    cartPage: CartPage;
    visualHelper: VisualTestHelper;
};

export const test = base.extend<PageFixtures>({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },
    productPage: async ({ page }, use) => {
        const productPage = new ProductPage(page);
        await use(productPage);
    },
    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },
    visualHelper: async ({ page }, use) => {
        const visualHelper = new VisualTestHelper(page);
        await use(visualHelper);
    },
});

export { expect } from '@playwright/test';