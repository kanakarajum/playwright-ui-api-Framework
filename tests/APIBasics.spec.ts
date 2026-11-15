import { test, expect, request } from '@playwright/test';


const loginReqURL = "https://rahulshettyacademy.com/api/ecom/auth/login";
const createOrderReqURL = "https://rahulshettyacademy.com/api/ecom/order/create-order";

const loginDataPayload = { userEmail: "imrajuu+test@gmail.com", userPassword: "Test@1234" };
const createOrderDataPayload = { orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }]};

let token: any;
let orderId: any;
let apiContext: any;

test.beforeAll(async () => {
    // step1: create an api context object using Request.newContext()
    apiContext = await request.newContext();
    // step2: create an call to the HTTP method - passing the request URL and body payload
    const loginResponse = await apiContext.post(loginReqURL, {
        data: loginDataPayload
    });
    // Step3: Validate the response
    expect(loginResponse.ok()).toBeTruthy();
    expect(loginResponse.status()).toBe(200);
    // Step4: Parse JSON response
    const jsonResponse = await loginResponse.json();
    console.log(jsonResponse);
    // Step5: Extract the token
    token = jsonResponse.token;
    console.log(token);

    // Place an order api call
    const creatOrderResponse = await apiContext.post(createOrderReqURL, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        data: createOrderDataPayload
    });
    // validate the responses
    expect(creatOrderResponse.ok()).toBeTruthy();
    expect(creatOrderResponse.status()).toBe(201);

    const createOrderJsonResp = await creatOrderResponse.json();
    console.log(createOrderJsonResp);

    orderId = createOrderJsonResp.orders[0];
    expect(createOrderJsonResp.message).toEqual('Order Placed Successfully');

})

test('Place an order', async ({ page }) => {

    // passing the user token to bypass login
    page.addInitScript(value => {
        // In window, go to local storage and set an Item
        window.localStorage.setItem('token', value)
    }, token);

    await page.goto('https://rahulshettyacademy.com/client');

    await page.pause();

})