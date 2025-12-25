import { test, expect } from '@playwright/test';
import { BrowserSingleton } from '../patterns/singleton/BrowserSingleton';
import { UserBuilder } from '../patterns/builder/UserBuilder';
import { PageFactory } from '../patterns/factory/PageFactory';
import { AbstractTestFlow } from '../patterns/template/AbstractTesstFlow';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { ProductVerifier, NameVerificationStrategy, PriceVerificationStrategy } from '../patterns/strategy/VerificationStrategy';

// Concrete implementation of Template Method
class PurchaseMonitorFlow extends AbstractTestFlow {
    private homePage!: HomePage;
    private productPage!: ProductPage;
    private cartPage!: CartPage;
    private targetProduct = 'Apple monitor 24';
    private expectedPrice = '400';

    protected async setup(): Promise<void> {
        this.homePage = PageFactory.create(HomePage, this.page);
        this.productPage = PageFactory.create(ProductPage, this.page);
        this.cartPage = PageFactory.create(CartPage, this.page);

        // Decorator logging happens inside navigation/signup/login
        await this.homePage.navigate();
        await this.homePage.signUp(this.user.username, this.user.password);

        // Wait for registration to process
        await this.page.waitForTimeout(1000);
        await this.homePage.login(this.user.username, this.user.password);
        await this.homePage.verifyUserLoggedIn(this.user.username);
    }

    protected async performActions(): Promise<void> {
        await this.homePage.goToMonitors();
        await this.homePage.selectProduct(this.targetProduct);
        await this.page.waitForURL(/.*prod.html.*/);
    }

    protected async verifyResults(): Promise<void> {
        const nameStrategy = new NameVerificationStrategy();
        const priceStrategy = new PriceVerificationStrategy();
        const verifier = new ProductVerifier(nameStrategy);

        const actualName = await this.productPage.getProductName();
        await verifier.executeStrategy(actualName, this.targetProduct);

        verifier.setStrategy(priceStrategy);
        const actualPrice = await this.productPage.getProductPrice();
        await verifier.executeStrategy(actualPrice, this.expectedPrice);

        await this.productPage.addToCart();
        await this.productPage.goToCart();
        const isInCart = await this.cartPage.isProductInCart(this.targetProduct);
        expect(isInCart).toBeTruthy();
    }
}

test.describe('Design Patterns Demo', () => {
    const browserManager = BrowserSingleton.getInstance();

    test.beforeAll(async () => {
        await browserManager.init();
    });

    test.afterAll(async () => {
        await browserManager.close();
    });

    test('Full E2E Flow with Patterns', async () => {
        const page = await browserManager.getPage();

        // Builder pattern usage
        const user = UserBuilder.generateRandom();

        //Template Method Pattern usage
        const purchaseFlow = new PurchaseMonitorFlow(page, user);
        await purchaseFlow.executeFlow();

        await page.close();
    });
});