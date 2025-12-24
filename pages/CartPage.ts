import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    async isProductInCart(productName: string): Promise<boolean> {
        await this.page.waitForSelector('.success');
        const rows = await this.page.locator('tbody tr').allInnerTexts();
        return rows.some(row => row.includes(productName));
    }
}