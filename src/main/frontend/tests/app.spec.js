const { test, expect } = require('@playwright/test');

test.use({ baseURL: process.env.BASE_URL || 'http://localhost:8080' });


const getUniqueUser = () => `user_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
const pass = 'password123';

async function loginNewUser(page) {
    const user = getUniqueUser();
    await page.goto('/');

    await page.locator('#username').fill(user);
    await page.locator('input[type="password"]').fill(pass);

    const dialogPromise = page.waitForEvent('dialog');
    await page.locator('button:has-text("Регистрация")').click({ force: true });

    const dialog = await dialogPromise;
    await dialog.accept();

    await page.locator('#username').fill(user);
    await page.locator('input[type="password"]').fill(pass);
    await page.locator('button:has-text("Войти")').click({ force: true });
    await page.waitForURL('**/main');
}

test.describe('lab4 - func tests', () => {

    test('TC-01: reg success', async ({ page }) => {
        await page.goto('/');
        await page.locator('#username').fill(getUniqueUser());
        await page.locator('input[type="password"]').fill(pass);

        const dialogPromise = page.waitForEvent('dialog');
        await page.locator('button:has-text("Регистрация")').click({ force: true });

        const dialog = await dialogPromise;
        expect(dialog.message()).toContain('Регистрация успешна');
        await dialog.accept();
    });

    test('TC-02: reg existing', async ({ page }) => {
        const user = getUniqueUser();
        await page.goto('/');

        await page.locator('#username').fill(user);
        await page.locator('input[type="password"]').fill(pass);
        const dialogPromise = page.waitForEvent('dialog');
        await page.locator('button:has-text("Регистрация")').click({ force: true });
        const dialog = await dialogPromise;
        await dialog.accept();

        await page.locator('#username').fill(user);
        await page.locator('input[type="password"]').fill(pass);
        await page.locator('button:has-text("Регистрация")').click({ force: true });

        await expect(page.getByText('already taken', { exact: false })).toBeVisible();
    });

    test('TC-03: reg empty fields', async ({ page }) => {
        await page.goto('/');
        await page.locator('button:has-text("Регистрация")').click({ force: true });
        await expect(page.getByText('Логин не может быть пустым', { exact: false })).toBeVisible();
    });

    test('TC-04: login success', async ({ page }) => {
        const user = getUniqueUser();
        await page.goto('/');
        await page.locator('#username').fill(user);
        await page.locator('input[type="password"]').fill(pass);

        const dialogPromise = page.waitForEvent('dialog');
        await page.locator('button:has-text("Регистрация")').click({ force: true });
        const dialog = await dialogPromise;
        await dialog.accept();

        await page.locator('#username').fill(user);
        await page.locator('input[type="password"]').fill(pass);
        await page.locator('button:has-text("Войти")').click({ force: true });
        await page.waitForURL('**/main');
        await expect(page).toHaveURL(/.*main/);
    });

    test('TC-05: login wrong password', async ({ page }) => {
        await page.goto('/');
        await page.locator('#username').fill('randomuser123');
        await page.locator('input[type="password"]').fill('wrongpassword');

        await page.locator('button:has-text("Войти")').click({ force: true });
        await expect(page.getByText('Неверный логин или пароль', { exact: false })).toBeVisible();
    });

    test('TC-06: logout', async ({ page }) => {
        await loginNewUser(page);
        await page.locator('button:has-text("Выход")').click({ force: true });
        await expect(page).toHaveURL(/.*login/);
    });

    test('TC-07: unauthorized access', async ({ page }) => {
        await page.goto('/main');
        await expect(page).toHaveURL(/.*login/);
    });

    test('TC-08: succes hit form', async ({ page }) => {
        await loginNewUser(page);
        await page.waitForSelector('.input-section');

        const xInput = page.locator('div.form-group:has-text("X")').locator('input');
        const rInput = page.locator('div.form-group:has-text("R")').locator('input');

        await xInput.click();
        await xInput.fill('1');
        await rInput.click();
        await rInput.fill('2');

        await page.locator('button:has-text("Проверить")').click({ force: true });
        await expect(page.locator('table tbody tr').first()).toBeVisible();
    });

    test('TC-09: bad hit form', async ({ page }) => {
        await loginNewUser(page);

        const xInput = page.locator('div.form-group:has-text("X")').locator('input');
        const rInput = page.locator('div.form-group:has-text("R")').locator('input');

        await xInput.click();
        await xInput.fill('2');
        await rInput.click();
        await rInput.fill('1');

        await page.locator('button:has-text("Проверить")').click({ force: true });
        const firstRow = page.locator('table tbody tr').first();
        await expect(firstRow).toContainText('Промах');
    });

    test('TC-10: canvas hit', async ({ page }) => {
        await loginNewUser(page);

        const rInput = page.locator('div.form-group:has-text("R")').locator('input');
        await rInput.click();
        await rInput.fill('1');

        const canvas = page.locator('canvas');
        await canvas.click({ position: { x: 250, y: 150 }, force: true });
        await expect(page.locator('table tbody tr').first()).toBeVisible();
    });

    test('TC-11: x out of range', async ({ page }) => {
        await loginNewUser(page);

        const xInput = page.locator('div.form-group:has-text("X")').locator('input');
        const rInput = page.locator('div.form-group:has-text("R")').locator('input');

        await xInput.click();
        await xInput.fill('10');
        await rInput.click();
        await rInput.fill('2');

        let dialogHandled = false;

        const alertProcessed = new Promise(resolve => {
            page.once('dialog', async dialog => {
                expect(dialog.message()).toContain('X должен быть');
                await dialog.accept();
                dialogHandled = true;
                resolve();
            });
        });

        await page.locator('button:has-text("Проверить")').click({ force: true });

        await alertProcessed;

        expect(dialogHandled).toBe(true);
    });

    test('TC-12: form - R <= 0', async ({ page }) => {
        await loginNewUser(page);

        const xInput = page.locator('div.form-group:has-text("X")').locator('input');
        const rInput = page.locator('div.form-group:has-text("R")').locator('input');

        await xInput.click();
        await xInput.fill('2');
        await rInput.click();
        await rInput.fill('-1');

        let dialogHandled = false;

        const alertProcessed = new Promise(resolve => {
            page.once('dialog', async dialog => {
                expect(dialog.message()).toContain('R должен быть');
                await dialog.accept();
                dialogHandled = true;
                resolve();
            });
        });

        await page.locator('button:has-text("Проверить")').click({ force: true });

        await alertProcessed;
        expect(dialogHandled).toBe(true);
    });

    test('TC-13: remove all points', async ({ page }) => {
        await loginNewUser(page);

        const xInput = page.locator('div.form-group:has-text("X")').locator('input');
        const rInput = page.locator('div.form-group:has-text("R")').locator('input');

        await xInput.click();
        await xInput.fill('1');
        await rInput.click();
        await rInput.fill('2');

        await page.locator('button:has-text("Проверить")').click({ force: true });
        await expect(page.locator('table tbody tr').first()).toBeVisible();

        await page.locator('button:has-text("Очистить")').click({ force: true });
        await expect(page.getByText('Результатов пока нет')).toBeVisible();
    });

    test('TC-14: table restart', async ({ page }) => {
        await loginNewUser(page);

        const xInput = page.locator('div.form-group:has-text("X")').locator('input');
        const rInput = page.locator('div.form-group:has-text("R")').locator('input');

        await xInput.click();
        await xInput.fill('1');
        await rInput.click();
        await rInput.fill('2');

        await page.locator('button:has-text("Проверить")').click({ force: true });
        await expect(page.locator('table tbody tr').first()).toBeVisible();

        await page.reload();
        await expect(page.locator('table tbody tr').first()).toBeVisible();
    });

    test('TC-15: sync r', async ({ page }) => {
        await loginNewUser(page);

        const rInput = page.locator('div.form-group:has-text("R")').locator('input');
        await rInput.click();
        await rInput.fill('4');

        await expect(rInput).toHaveValue('4');
    });
});