import { Page } from "@playwright/test";
import loginPage from "./loginPage";
import dashboardPage from "./dashboardPage";
import cartPage from "./cartPage";
import checkoutPage from "./checkoutPage";
import ordersPage from "./ordersPage";

class pageObjectManager {
    page: Page;
    LoginPage: loginPage;
    DashboardPage: dashboardPage;
    CartPage: cartPage;
    CheckoutPage: checkoutPage;
    OrdersPage: ordersPage;

    constructor(page: Page) {
        this.page = page;
        this.LoginPage = new loginPage(page);
        this.DashboardPage = new dashboardPage(page);
        this.CartPage = new cartPage(page);
        this.CheckoutPage = new checkoutPage(page);
        this.OrdersPage = new ordersPage(page);
    }

    getLoginPage() {
        return this.LoginPage;
    }

    getDashboardPage() {
        return this.DashboardPage;
    }

    getCartPage() {
        return this.CartPage;
    }

    getCheckoutPage() {
        return this.CheckoutPage;
    }

    getOrdersPage() {
        return this.OrdersPage;
    }

}

export default pageObjectManager;