import { test } from '@playwright/test';
import pageObjectManager from '../pageObjects/pageObjectManager';
import multitestdata from '../testData/multi_testdata.json';
import { TestData } from '../types/types';

for (const testdata of multitestdata) {
    test(`@Webst Client App login ${testdata.productName}`, async ({ page }) => {
        const url = "https://rahulshettyacademy.com/client";

        // page object manager - stores all the pageobject classes, return its classes
        const pom = new pageObjectManager(page);
        const LoginPage = pom.getLoginPage();
        const DashboardPage = pom.getDashboardPage();
        const CartPage = pom.getCartPage();
        const CheckoutPage = pom.getCheckoutPage();
        const OrdersPage = pom.getOrdersPage();

        await LoginPage.launch(url);
        await LoginPage.loginToApp(testdata.username, testdata.password);

        await DashboardPage.addToCart(testdata.productName);

        await CartPage.verifyCartPageAndCheckout();

        await CheckoutPage.shippingInformation(testdata.username);

        await OrdersPage.verifyOrderInOrderHistory();
    })

};