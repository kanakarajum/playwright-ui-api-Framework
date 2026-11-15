import { test as base, Page, request } from '@playwright/test';
import ApiUtils from './apiUtils';

type MyFixtures = {
    authenticatedPage: Page;
    createOrderViaAPI: {
        orderId: string;
    };
    testDataProducts: {
        ProductName: string;
    };
}

const loginDataPayload = {
    userEmail: "imrajuu+test@gmail.com",
    userPassword: "Test@1234"
};

const createOrderDataPayload = {
    orders: [{
        country: "India",
        productOrderedId: "6960eac0c941646b7a8b3e68"
    }]
};


const customtest = base.extend<MyFixtures>({

    authenticatedPage: async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto("https://rahulshettyacademy.com/client");
        await page.locator("#userEmail").fill("imrajuu+test@gmail.com");
        await page.locator("#userPassword").fill("Test@1234");
        await page.locator("[value='Login']").click();
        await page.waitForLoadState('networkidle');

        await use(page);
    },

    createOrderViaAPI: async ({}, use) => {
        // Step 1: Create API context
        const apiContext = await request.newContext();
        // Step 2: Initialize API utility
        const apiUtils = new ApiUtils(apiContext, loginDataPayload);
        // Step 3: Login and create order
        const response = await apiUtils.createOrder(createOrderDataPayload);

        await use(response);
    },

    testDataProducts: {
        ProductName: "Adidas Original"
    },



})

export default customtest;