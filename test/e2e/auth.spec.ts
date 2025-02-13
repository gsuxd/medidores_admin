import { test, expect } from '@playwright/test';
import { loginResponse } from './mocks/fakeUser';
import { logIn } from './helpers';

test.beforeEach(async ({ page }) => {
    await page.goto('/login');
});

test.describe('Auth Routes', () => {
    test('should allow me to login', async ({ page }) => {

        await page.routeFromHAR('./test/e2e/mocks/har/login.har', {
            url: '**/api/auth/login',
        });

        await page.routeFromHAR('./test/e2e/mocks/har/dashboard.har', {
            url: '**/api/admin/dashboard',
        });

        // Get the input element and type some text into it.
        const emailInput = page.getByLabel('Correo');
        const passwordInput = page.getByLabel('Contraseña');

        // Fill in the form and submit it.
        await emailInput.fill('michaelgeisertoro@gmail.com');
        await passwordInput.fill('20242024');

        await page.click('button[type="submit"]');

        await page.waitForURL('/admin/dashboard');
        await expect(page.getByText('Bienvenid@, Michael!', { exact: true })).toBeVisible();
    });

    test('Should show an error message when the login fails', async ({ page }) => {
        await page.route('**/api/auth/login', route => {
            route.fulfill({
                status: 400,
                body: JSON.stringify({ error: 'Usuario no encontrado' }),
            });
        });

        // Get the input element and type some text into it.
        const emailInput = page.getByLabel('Correo');
        const passwordInput = page.getByLabel('Contraseña');

        // Fill in the form and submit it.
        await emailInput.fill('test@test.com');
        await passwordInput.fill('20132013');

        await page.click('button[type="submit"]');

        await expect(page.getByText('Usuario no encontrado', { exact: true })).toBeVisible();
    });

    test("Should allow me to create a master user", async ({ page }) => {
        await page.route('**/api/auth/login', route => {
            route.fulfill({
                status: 400,
                body: JSON.stringify({ error: "CREATE_MASTER" }),
            });
        });

        await page.route('**/api/auth/createMaster', route => {
            route.fulfill({
                status: 200,
                body: JSON.stringify(loginResponse),
            });
        })

        const emailInput = page.getByLabel('Correo');
        const passwordInput = page.getByLabel('Contraseña');

        await emailInput.fill('test@test.com');
        await passwordInput.fill('20132013');

        await page.click('button[type="submit"]');

        await page.waitForURL('/create-master');

        await expect(page.getByText('Crea tu usuario master', { exact: true })).toBeVisible();

        await page.fill('input[name="name"]', 'Michael');
        await page.fill('input[name="lastName"]', 'Geiser');
        await page.fill('input[name="rut"]', '3.403.231-9');
        await page.fill('input[name="address"]', 'Calle Falsa 123');
        await page.fill('input[name="phone"]', '123456789');
        await page.fill('input[name="email"]', 'michaelgeisertoro@gmail.com');
        await page.fill('input[name="password"]', '20242024');

        await page.click('button[type="submit"]');
        await page.waitForURL('/admin/dashboard');

        await expect(page.getByText('Bienvenid@, Michael!', { exact: true })).toBeVisible();
    });

    test("Should redirect to landing page of the app", async ({ page }) => {
        await page.routeFromHAR('./test/e2e/mocks/har/loginPartner.har', {
            url: '**/api/auth/login',
        })


        await page.fill('input[name="email"]', 'test3@test.com');
        await page.fill('input[name="password"]', '20132013');

        await page.click('button[type="submit"]');

        await page.waitForURL('/status/app');

        await expect(page.getByText('Instala la app móvil para acceder.', { exact: true })).toBeVisible();
    })

    test("Should redirect to dashboard if logged", async ({ page }) => {
        await logIn(page);

        await page.waitForURL('/admin/dashboard');

        await expect(page.getByText('Bienvenid@, Michael!', { exact: true })).toBeVisible();
        await expect(page.getByText('Deudas totales', { exact: true })).toBeVisible();
    });
});