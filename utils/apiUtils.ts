import { request, expect, APIRequestContext } from '@playwright/test';

const loginReqURL = "https://rahulshettyacademy.com/api/ecom/auth/login";
const createOrderReqURL = "https://rahulshettyacademy.com/api/ecom/order/create-order";

class ApiUtils {

    apiContext: APIRequestContext;
    loginDataPayload: any;

    constructor(apiContext: APIRequestContext, loginDataPayload: any) {
        this.apiContext = apiContext;
        this.loginDataPayload = loginDataPayload;
    }

    async getToken() {

        const loginResponse = await this.apiContext.post(loginReqURL, {
            data: this.loginDataPayload
        });

        expect(loginResponse.ok()).toBeTruthy();
        expect(loginResponse.status()).toBe(200);

        const jsonResponse = await loginResponse.json();

        const token = jsonResponse.token;

        console.log("Token:", token);

        return token;
    }

    async createOrder(createOrderDataPayload: any) {

        const response: any = {};

        // Get authentication token
        response.token = await this.getToken();

        // Create order
        const createOrderResponse = await this.apiContext.post(createOrderReqURL, {
            data: createOrderDataPayload,
            headers: {
                'Authorization': response.token
            }
        });

        // Validate response
        expect(createOrderResponse.ok()).toBeTruthy();
        expect(createOrderResponse.status()).toBe(201);

        const createOrderJsonResp = await createOrderResponse.json();

        console.log(createOrderJsonResp);

        // Extract order ID
        response.orderId = createOrderJsonResp.orders[0];

        expect(createOrderJsonResp.message).toEqual('Order Placed Successfully');

        return response;
    }
}

export default ApiUtils;
