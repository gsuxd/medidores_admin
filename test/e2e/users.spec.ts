import { test, expect } from '@playwright/test';
import { logIn } from './helpers';

test.beforeEach(async ({ page }) => {
    await logIn(page);

    await page.routeFromHAR('./test/e2e/mocks/har/ssrUsers.har', {
        url: 'https://h2ogestion.cl/api/admin/ssr',
    })

})

test.describe('Users Routes', () => {
    test("Should navigate to users page", async ({ page}) => {
        
        await page.routeFromHAR('./test/e2e/mocks/har/users.har', {
            url: 'https://h2ogestion.cl/api/admin/users',
        });
        
        await page.getByRole('link', { name: 'Usuarios' }).click();

        expect(page.getByText("Administración de Usuarios", {exact: true})).toBeVisible();

        await page.waitForSelector('text="Pagina 1 de 5"');
        
        //Verifica que renderiza los elementos
        expect(page.getByText("Administrador Prueba 1", {exact: true})).toBeVisible();
        expect(page.getByText("gsuxdxd@gmail.com", {exact: true})).toBeVisible();

        //Verifica que renderiza TODOS los elementos
        expect(page.locator("tr")).toHaveCount(11);
    })

    test("Should change page", async ({ page }) => {
        await page.routeFromHAR('./test/e2e/mocks/har/users.har', {
            url: 'https://h2ogestion.cl/api/admin/users',
        });

        await page.routeFromHAR('./test/e2e/mocks/har/usersPage.har', {
            url: 'https://h2ogestion.cl/api/admin/users?page=2',
        });


        await page.getByRole('link', { name: 'Usuarios' }).click();
        
        await page.waitForSelector('text="Pagina 1 de 5"');
        
        await page.locator('[data-testid=ArrowForwardIosIcon]').click();
        await page.waitForSelector('text="Pagina 2 de 5"');
        
        expect(page.getByText('José Correa', {exact: true})).toBeVisible();
        expect(page.getByText('jcorrea@gmail.com', {exact: true})).toBeVisible();
        expect(page.locator("tr")).toHaveCount(11);
    });

    test("Should search user", async ({ page }) => {
        await page.routeFromHAR('./test/e2e/mocks/har/users.har', {
            url: 'https://h2ogestion.cl/api/admin/users',
        });

        await page.routeFromHAR('./test/e2e/mocks/har/usersSearch.har', {
            url: 'https://h2ogestion.cl/api/admin/user/?page=0&limit=25&name=Admin&lastName=&email=&phone=&rut=&order=desc&orderBy=name&ssrId=-1&enabled=true',
        });

        await page.routeFromHAR('./test/e2e/mocks/har/usersSearch2.har', {
            url: 'https://h2ogestion.cl/api/admin/user/?page=0&limit=25&name=Admin&lastName=Test&email=&phone=&rut=&order=desc&orderBy=name&ssrId=-1&enabled=true',
        });

        await page.routeFromHAR('./test/e2e/mocks/har/usersSearch3.har', {
            url: 'https://h2ogestion.cl/api/admin/user/?page=0&limit=25&name=Admin&lastName=Test&email=&phone=&rut=&order=desc&orderBy=name&ssrId=1&enabled=true',
        });

        await page.routeFromHAR('./test/e2e/mocks/har/usersSearch4.har', {
            url: 'https://h2ogestion.cl/api/admin/user/?page=0&limit=25&name=Admin&lastName=Test&email=&phone=&rut=&order=desc&orderBy=name&ssrId=2&enabled=true',
        });

        await page.getByRole('link', { name: 'Usuarios' }).click();

        
        await page.getByRole('textbox', { name: 'Nombre' }).fill('Admin');
        
        await page.locator('#role').click();
        await page.locator('[data-value=admin]').click();
        await page.getByRole('button', { name: 'Filtrar' }).click();
        
        await page.waitForSelector('text="Pagina 1 de 1"');
        expect(page.getByText('Administrador Prueba 1', {exact: true})).toBeVisible();
        
        await page.getByRole('textbox', { name: 'Apellido' }).fill('Test');
        
        await page.waitForSelector('text="Pagina 1 de 1"');
        expect(page.getByText("Admin Test", {exact: true})).toBeVisible();
        
        
        await page.locator('#ssrId').click();
        await page.getByText('Los Confines', {exact: true}).click();

        await page.waitForSelector('text="Pagina 1 de 0"');
        expect(page.getByText("No se encontraron resultados", {exact: true})).toBeVisible();
    });
})

