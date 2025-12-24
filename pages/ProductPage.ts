import { BasePage } from './BasePage';
import { CommandInvoker, ClickCommand } from '../patterns/command/Command';
import { Locator, Page } from '@playwright/test';

export class ProductPage extends BasePage {
    private readonly invoker = new CommandInvoker();

    // Locators
    private readonly productName: Locator;
    private readonly productPrice: Locator;
    private readonly addToCartButton: Locator;
    private readonly cartLink: Locator;

    constructor(page: Page) {
        super(page);
        this.productName = page.locator('.name');
        this.productPrice = page.locator('.price-container');
        // Robust locator: Link with exact text "Add to cart"
        this.addToCartButton = page.getByRole('link', { name: 'Add to cart' });
        this.cartLink = page.getByRole('link', { name: 'Cart', exact: true });
    }

    async getProductName(): Promise<string> {
        return await this.productName.innerText();
    }

    async getProductPrice(): Promise<string> {
        const text = await this.productPrice.innerText();
        return text.split(' *')[0].replace('$', '');
    }

    async addToCart() {
        this.page.once('dialog', async dialog => await dialog.accept());

        // COMMAND PATTERN usage:
        // We pass the class property (this.addToCartButton) to the command
        const clickCmd = new ClickCommand(this.addToCartButton);
        await this.invoker.executeCommand(clickCmd);
    }

    async goToCart() {
        await this.cartLink.click();
    }
}