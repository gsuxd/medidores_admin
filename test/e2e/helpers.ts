import { Page } from "playwright";

export const logIn = async (page: Page) => {
    await page.goto('/');
    await page.routeFromHAR('./test/e2e/mocks/har/login.har', {
        url: 'https://h2ogestion.cl/api/auth/login',
    });
    await page.getByRole('link', { name: 'Iniciar Sesión' }).click();
    await page.getByRole('textbox', { name: 'Correo' }).click();
    await page.getByRole('textbox', { name: 'Correo' }).fill('michaelgeisertoro@gmail.com');
    await page.getByRole('textbox', { name: 'Correo' }).press('Tab');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('20242024');
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
}