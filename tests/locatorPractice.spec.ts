import{test, expect} from '@playwright/test';

test('locator practice test', async({page})=> {

    test.setTimeout(10000);
    await page.goto('https://rahulshettyacademy.com/locatorspractice/');
    await expect(page).toHaveTitle('Rahul Shetty Academy - Login page', {timeout:3000});
    await expect(page.getByRole('heading', { name: 'Sign in' })).toContainText('Sign in');
    await page.getByPlaceholder('Username').fill('test@gmail.com');
    await page.getByPlaceholder('Password').fill('Test@1234');
    await page.getByLabel(' Remember my username').check();
    await expect(page.getByLabel(' Remember my username1')).toBeChecked();

})