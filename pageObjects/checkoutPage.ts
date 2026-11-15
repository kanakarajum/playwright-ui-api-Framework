import { Page, Locator, expect } from "@playwright/test";

class checkoutPage {

    page: Page;
    txtBxCountry: Locator;
    dropdown: Locator;
    username: Locator;
    btnPlaceorder: Locator;

    constructor(page: Page) {
        this.page = page;
        this.txtBxCountry = page.getByPlaceholder('Select Country');
        this.dropdown = page.locator(".ta-results");
        this.username = page.locator(".user__name [type='text']");
        this.btnPlaceorder = page.locator(".action__submit");
    }

    async shippingInformation(username: string) {
        await this.txtBxCountry.pressSequentially("ind", { delay: 150 })
        await this.dropdown.waitFor();
        const optionsCount = await this.dropdown.locator("button").count();
        for (let i = 0; i < optionsCount; ++i) {
            const text = await this.dropdown.locator("button").nth(i).textContent();
            if (text === " India") {
                await this.dropdown.locator("button").nth(i).click();
                break;
            }
        }
        expect(this.username.first()).toHaveText(username);
        await this.btnPlaceorder.click();
    }
}
export default checkoutPage;