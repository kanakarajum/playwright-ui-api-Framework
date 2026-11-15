import { Locator, Page } from "@playwright/test";

class dashboardPage {
    page: Page
    productText: Locator;
    products: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productText = page.locator(".card-body b");
        this.products = page.locator(".card-body");
    }

    async addToCart(productName: string) {
        await this.productText.first().waitFor();
        const titles = await this.productText.allTextContents();
        console.log(titles);
        const count = await this.products.count();
        for (let i = 0; i < count; ++i) {
            if (await this.products.nth(i).locator("b").textContent() === productName) {
                //add to cart
                await this.products.nth(i).locator("text= Add To Cart").click();
                break;
            }
        }
    }
}

export default dashboardPage;