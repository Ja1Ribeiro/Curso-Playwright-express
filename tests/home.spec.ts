import { test, expect } from '@playwright/test'

test('webapp deve estar online', async ({ page }) => {

    await page.goto('http://localhost:8080/')
    await expect(page).toHaveTitle('Gerencie suas tarefas com Mark L')

})



