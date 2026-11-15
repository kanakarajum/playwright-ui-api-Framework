import { Locator, Page, expect } from "@playwright/test";

class ordersPage {
    page: Page;
    thankYouTxt: Locator;
    orderId: Locator;
    lnkOrders: Locator;

    constructor(page: Page) {
        this.page = page;
        this.thankYouTxt = page.locator(".hero-primary");
        this.orderId = page.locator(".em-spacer-1 .ng-star-inserted");
        this.lnkOrders = page.locator("button[routerlink*='myorders']")

    }

    async verifyOrderInOrderHistory() {
        await expect(this.thankYouTxt).toHaveText(" Thankyou for the order. ");
        let orderId: any = await this.orderId.textContent();
        console.log(orderId);
        await this.lnkOrders.click();
        await this.page.locator("tbody").waitFor();
        const rows = this.page.locator("tbody tr");

        for (let i = 0; i < await rows.count(); ++i) {
            const rowOrderId: any = await rows.nth(i).locator("th").textContent();
            if (orderId.includes(rowOrderId)) {
                await rows.nth(i).locator("button").first().click();
                break;
            }
        }
        const orderIdDetails = await this.page.locator(".col-text").textContent();
        expect(orderId.includes(orderIdDetails)).toBeTruthy();
    }

}

export default ordersPage;