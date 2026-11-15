
import { test, expect, request, APIRequestContext } from '@playwright/test';
import ApiUtils from '../utils/apiUtils';

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

let response: any;
let apiContext: APIRequestContext;

test.beforeAll(async () => {

    // Step 1: Create API context
    apiContext = await request.newContext();

    // Step 2: Initialize API utility
    const apiUtils = new ApiUtils(apiContext, loginDataPayload);

    // Step 3: Login and create order
    response = await apiUtils.createOrder(createOrderDataPayload);

});

test('Place an order', async ({ page }) => {

    // Step 4: Set authentication token in local storage
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    console.log('Order ID:', response.orderId);

    // Step 5: Navigate to application
    await page.goto('https://rahulshettyacademy.com/client');

    await page.pause();

});

test.afterAll(async () => {
    await apiContext.dispose();
});
