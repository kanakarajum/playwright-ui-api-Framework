import { expect } from '@playwright/test';
import customtest from '../utils/fixtures';

customtest('Testing Fixture flow', async ({ authenticatedPage, createOrderViaAPI, testDataProducts }) => {
    // print the orderID and verify
    const orderID = createOrderViaAPI.orderId;
    console.log(orderID);
    await authenticatedPage.locator('//*[@routerlink="/dashboard/myorders"]').click();
    await authenticatedPage.locator('//tbody').waitFor();
    await expect(authenticatedPage.getByText(orderID)).toBeVisible();
    console.log(testDataProducts.ProductName)
})


