
import { test, expect, request, APIRequestContext } from '@playwright/test';
import ApiUtils from '../Utils/apiUtils';

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
const fakePayLoadOrders = { data: [], message: "No Orders" };

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

    await page.route(
        'https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*',

        async route => {

            // STEP 1: Get the original browser request
            const originalRequest = route.request();

            // STEP 2: Call the REAL backend and get its response
            const realResponse = await page.request.fetch(originalRequest);

            // STEP 3: Prepare our FAKE response data
            const fakeResponseBody = JSON.stringify(fakePayLoadOrders);

            // STEP 4: Return original response metadata
            //         but REPLACE the actual response body with fake data
            await route.fulfill({
                response: realResponse,
                body: fakeResponseBody
            });

        }
    );
    await page.locator("button[routerlink*='myorders']").click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*")

    console.log(await page.locator(".mt-4").textContent());
});

test.afterAll(async () => {
    await apiContext.dispose();
});
