import{test, expect} from '@playwright/test';

test('Practice app - Angular app',async({page})=>{
    test.setTimeout(120000);
    await page.goto('https://rahulshettyacademy.com/angularpractice/', {timeout: 6000});
    await page.getByLabel('Check me out if you Love IceCreams!').check();
    expect(page.getByLabel('Employed')).toBeVisible({timeout: 10000});
    await page.getByLabel('Employed').click({timeout:3000});
    await page.getByLabel('Gender').selectOption('Male');
    await page.getByPlaceholder('Password').fill('Test1234');
    // await page.getByRole('textbox', {name: 'name'}).fill('Testing');
    // await page.getByRole("textbox", {name: "email"}).fill("test@gmail.com");
    await page.locator('input[name="email"]').fill('test@gmail.com', {timeout: 2000});



    
});