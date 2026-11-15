import {test, expect} from '@playwright/test'

test('Dialog handling', async({page})=>{
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    // handle radiobutton
    await page.locator("//input[@value='radio1']").click();
    await expect(page.locator("//input[@value='radio1']")).toBeChecked();
    // await page.getByRole('button', {name: 'Confirm'}).click()
    // await page.pause();

    // Confirm dialog - Accept
    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', {name: 'Confirm'}).click();
    // Confirm dialog - Dismiss
    page.on('dialog', dialog1 => dialog1.dismiss());
    await page.getByRole('button', {name: 'Confirm'}).click();
    // Prompt dialog
    page.on('dialog', dialog2 => dialog2.accept('Hello, this is prompt'));
    await page.getByRole('button', {name: 'Confirm'}).click();

    // hover
    await page.locator('#mousehover').hover();
    await page.getByRole('link', { name: 'Top' }).click();
    await expect(page).toHaveURL(/#top/);

})