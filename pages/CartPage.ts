import { BasePage } from './BasePage';
import { Locator } from '@playwright/test';

export class CartPage extends BasePage {
    protected readonly pageUrl = '/cart.html';

    // Cart Elements
    private readonly cartTable: Locator;
    private readonly cartRows: Locator;
    private readonly totalPrice: Locator;
    private readonly placeOrderButton: Locator;
    private readonly deleteButtons: Locator;

    // Order Modal
    private readonly orderModal: Locator;
    private readonly nameInput: Locator;
    private readonly countryInput: Locator;
    private readonly cityInput: Locator;
    private readonly cardInput: Locator;
    private readonly monthInput: Locator;
    private readonly yearInput: Locator;
    private readonly purchaseButton: Locator;

    constructor(page: any) {
        super(page);

        this.cartTable = page.locator('.table');
        this.cartRows = page.locator('tbody tr.success');
        this.totalPrice = page.locator('#totalp');
        this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
        this.deleteButtons = page.getByRole('link', { name: 'Delete' });

        // Order Modal
        this.orderModal = page.locator('#orderModal');
        this.nameInput = page.locator('#name');
        this.countryInput = page.locator('#country');
        this.cityInput = page.locator('#city');
        this.cardInput = page.locator('#card');
        this.monthInput = page.locator('#month');
        this.yearInput = page.locator('#year');
        this.purchaseButton = page.getByRole('button', { name: 'Purchase' });
    }

    async navigate(): Promise<this> {
        await super.navigate();
        await this.waitForCartLoad();
        return this;
    }

    private async waitForCartLoad(): Promise<void> {
        // Wait for table to be visible (even if empty)
        await this.cartTable.waitFor({ state: 'visible' });
    }

    async isProductInCart(productName: string): Promise<boolean> {
        await this.waitForCartLoad();
        const rowTexts = await this.cartRows.allInnerTexts();
        return rowTexts.some(text => text.includes(productName));
    }

    async getProductCount(): Promise<number> {
        return await this.cartRows.count();
    }

    async getTotalPrice(): Promise<string> {
        return (await this.totalPrice.innerText()).trim();
    }

    async deleteProduct(productName: string): Promise<void> {
        const row = this.cartRows.filter({ hasText: productName });
        await row.getByRole('link', { name: 'Delete' }).click();
        // Wait for row to disappear
        await row.waitFor({ state: 'detached' });
    }

    async deleteAllProducts(): Promise<void> {
        const count = await this.getProductCount();
        for (let i = 0; i < count; i++) {
            await this.deleteButtons.first().click();
            await this.page.waitForTimeout(500); // Small wait for stability
        }
    }

    async placeOrder(orderDetails: {
        name: string;
        country: string;
        city: string;
        card: string;
        month: string;
        year: string;
    }): Promise<void> {
        await this.placeOrderButton.click();
        await this.waitForVisible(this.orderModal);
        await this.fillOrderForm(orderDetails);
        await this.submitOrder();
    }

    private async fillOrderForm(details: {
        name: string;
        country: string;
        city: string;
        card: string;
        month: string;
        year: string;
    }): Promise<void> {
        await this.nameInput.fill(details.name);
        await this.countryInput.fill(details.country);
        await this.cityInput.fill(details.city);
        await this.cardInput.fill(details.card);
        await this.monthInput.fill(details.month);
        await this.yearInput.fill(details.year);
    }

    private async submitOrder(): Promise<void> {
        await this.purchaseButton.click();
        await this.waitForHidden(this.orderModal);
    }

    // Visual methods
    async verifyCartVisual(screenshotName: string): Promise<void> {
        await this.verifyVisualBaseline(screenshotName);
    }

    async verifyCartTableVisual(screenshotName: string): Promise<void> {
        await this.verifyElementVisual(this.cartTable, screenshotName);
    }

    // Public accessors for visual testing
    getCartTable(): Locator {
        return this.cartTable;
    }

    getTotalPriceSection(): Locator {
        return this.totalPrice;
    }

    async showOrderModal(): Promise<Locator> {
        await this.placeOrderButton.click();
        await this.waitForVisible(this.orderModal);
        return this.orderModal;
    }

    getOrderModal(): Locator {
        return this.orderModal;
    }
}