import { BasePage } from './BasePage';
import { CommandInvoker, ClickCommand } from '../patterns/command/Command';
import { Locator, Page } from '@playwright/test';

export class ProductPage extends BasePage {
    protected readonly pageUrl = '/prod.html';
    private readonly invoker = new CommandInvoker();

    // Product Details
    private readonly productName: Locator;
    private readonly productPrice: Locator;
    private readonly productDescription: Locator;
    private readonly productImage: Locator;

    // Actions
    private readonly addToCartButton: Locator;
    private readonly cartLink: Locator;
    private readonly homeLink: Locator;

    constructor(page: Page) {
        super(page);

        // Product Info
        this.productName = page.locator('.name');
        this.productPrice = page.locator('.price-container');
        this.productDescription = page.locator('#more-information');
        this.productImage = page.locator('.product-image img'); // Adjust selector

        // Navigation
        this.addToCartButton = page.getByRole('link', { name: 'Add to cart', exact: true });
        this.cartLink = page.getByRole('link', { name: 'Cart', exact: true });
        this.homeLink = page.getByRole('link', { name: 'Home' });
    }

    async getProductName(): Promise<string> {
        return (await this.productName.innerText()).trim();
    }

    async getProductPrice(): Promise<string> {
        const text = await this.productPrice.innerText();
        // More robust price extraction
        return text.split('*')[0].replace(/[^0-9.]/g, '').trim();
    }

    async getProductDescription(): Promise<string> {
        return (await this.productDescription.innerText()).trim();
    }

    // Return type makes it chainable
    async addToCart(): Promise<void> {
        await this.handleDialog(async () => {
            const clickCmd = new ClickCommand(this.addToCartButton);
            await this.invoker.executeCommand(clickCmd);
        });
    }

    async goToCart(): Promise<void> {
        await this.cartLink.click();
    }

    async goToHome(): Promise<void> {
        await this.homeLink.click();
    }

    // Visual methods
    async verifyProductDetailsVisual(screenshotName: string): Promise<void> {
        await this.verifyVisualBaseline(screenshotName);
    }

    async verifyProductImageVisual(screenshotName: string): Promise<void> {
        await this.verifyElementVisual(this.productImage, screenshotName);
    }
}