import { Locator, Page } from "@playwright/test";

class loginPage {
    page: Page;
    userEmail: Locator;
    userPassword: Locator;
    btnLogin: Locator;

    constructor(page: Page) {
        this.page = page;
        this.userEmail = page.locator("#userEmail");
        this.userPassword = page.locator("#userPassword");
        this.btnLogin = page.locator("[value='Login']");
    }

    async launch(URL: string) {
        await this.page.goto(URL);
    }
    async loginToApp(userName: string, password: string) {
        await this.userEmail.fill(userName);
        await this.userPassword.fill(password);
        await this.btnLogin.click();
        await this.page.waitForLoadState('networkidle');
    }

}

export default loginPage;