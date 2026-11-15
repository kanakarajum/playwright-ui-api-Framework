import { Locator, Page, expect } from "@playwright/test";

class cartPage {
    page: Page;
    lnkCart: Locator;
    item: Locator;
    btnCheckout: Locator;

    constructor(page: Page) {
        this.page = page;
        this.lnkCart = page.locator("[routerlink*='cart']");
        this.item = page.locator("div li");
        this.btnCheckout = page.locator("text=Checkout");
    }

    async verifyCartPageAndCheckout() {
        await this.lnkCart.click();
        await this.page.waitForLoadState("networkidle");
        await this.item.first().waitFor();
        const bool = await this.page.locator("h3:has-text('ZARA COAT 3')").isVisible();
        expect(bool).toBeTruthy();
        await this.btnCheckout.click();
        await this.page.waitForLoadState();
    }
}
export default cartPage;