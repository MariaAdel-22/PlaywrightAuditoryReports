const { chromium } = require('playwright'); 
const axe = require('axe-core');
const PDFDocument = require('pdfkit');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 600, height: 400 });

// Función para generar gráficos
async function generateChart(data, labels, title) {
  const config = {
    type: 'bar',
    data: { labels, datasets: [{ data, backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'] }] },
    options: { plugins: { title: { display: true, text: title } } }
  };
  return await chartJSNodeCanvas.renderToBuffer(config);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const url = 'http://localhost:80'; // Asegúrate de que la app CRUD está corriendo
  await page.goto(url);

  const pageTitle = await page.title();
  const steps = []; // Registro dinámico de acciones

  // Función para registrar pasos de forma automática
  const trackStep = async (description, action) => {
    const start = performance.now();
    try {
      await action();
      steps.push({ action: description, duration: Math.round(performance.now() - start) });
    } catch (error) {
      console.error(`Error en paso: ${description} -> ${error.message}`);
      steps.push({ action: `❌ ERROR: ${description}`, duration: 0 });
      await page.screenshot({ path: `error-${description.replace(/\s+/g, '_')}.png` });
    }
  };

  // Interceptar eventos de carga de página y solicitudes
  page.on('domcontentloaded', () => steps.push({ action: 'DOM cargado', duration: 0 }));
  page.on('load', () => steps.push({ action: 'Página completamente cargada', duration: 0 }));
  page.on('request', request => steps.push({ action: `Solicitud realizada: ${request.url()}`, duration: 0 }));


  // **Monitorización de Cabeceras HTTP y Seguridad**
  const headers = await page.evaluate(() => {
    return fetch(window.location.href, { method: 'HEAD' })
      .then(response => Object.fromEntries(response.headers.entries()))
      .catch(() => null);
  });

console.log("🔹 Cabeceras HTTP Capturadas:", headers);


  // **Monitorización de Eventos de Usuario**
  const userEvents = [];
  page.on('click', event => userEvents.push(`Clic en ${event.target}`));

  // **Simulación de Registro de Usuario**
  await trackStep('Navegar a la página de registro', async () => page.goto(`${url}/signup`));
  await trackStep('Rellenar nombre', async () => page.fill('input[name="firstName"]', 'Juana'));
  await trackStep('Rellenar apellidos', async () => page.fill('input[name="lastName"]', 'Paez'));
  await trackStep('Rellenar email', async () => page.fill('input[name="username"]', 'juana.paez@example.com'));
  await trackStep('Rellenar contraseña', async () => page.fill('input[name="password"]', 'Password333'));
  await trackStep('Confirmar contraseña', async () => page.fill('input[name="confirmPassword"]', 'Password333'));
  await trackStep('Hacer click en "Crear Cuenta"', async () => page.locator('button', { hasText: 'Login ' }).click());
  await page.waitForTimeout(2000);

  // **Simulación de Inicio de Sesión**
  await trackStep('Navegar a la página de login', async () => page.goto(`${url}/login`));
  await trackStep('Rellenar email', async () => page.fill('input[name="username"]', 'juana.paez@example.com'));
  await trackStep('Rellenar contraseña', async () => page.fill('input[name="password"]', 'Password333'));
  await trackStep('Hacer click en "Iniciar Sesión"', async () => page.locator('button', { hasText: 'Login ' }).click());

  let loginSuccess = false;
  await trackStep('Validar inicio de sesión', async () => {
    try {
      await page.waitForSelector('.dashboard', { timeout: 3000 });
      loginSuccess = true;
    } catch (error) {
      loginSuccess = false;
    }
  });

  // **Monitorización de APIs y Peticiones Externas**
  const apiResponses = [];
  page.on('response', response => apiResponses.push(`${response.url()} - ${response.status()}`));

  // **Métricas de Rendimiento**
  const performanceMetrics = await page.evaluate(() => ({
    loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
    responseTime: performance.timing.responseEnd - performance.timing.requestStart,
    domComplete: performance.timing.domComplete - performance.timing.navigationStart,
    domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
    userAgent: navigator.userAgent,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight
  }));

  const kpis = {
    loginSuccess: loginSuccess ? 1 : 0,
    loadTime: performanceMetrics.loadTime + ' ms',
    responseTime: performanceMetrics.responseTime + ' ms',
    domComplete: performanceMetrics.domComplete + ' ms',
    domContentLoaded: performanceMetrics.domContentLoaded + ' ms',
    screenSize: `${performanceMetrics.screenWidth}x${performanceMetrics.screenHeight}`,
    userAgent: performanceMetrics.userAgent
  };

  // **Generar gráfico de tiempos de ejecución**
  const stepLabels = steps.map(step => step.action);
  const stepDurations = steps.map(step => step.duration);
  const stepChartBuffer = await generateChart(stepDurations, stepLabels, 'Tiempos de Ejecución de Pasos');

  // **Crear el PDF**
  const doc = new PDFDocument();
  const pdfPath = `audit-report-${pageTitle.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
  doc.pipe(fs.createWriteStream(pdfPath));

  doc.fontSize(20).text(`Informe de Auditoría - ${pageTitle}`, { align: 'center' });

  // **KPIs**
  doc.moveDown().fontSize(16).text('KPIs de Auditoría', { underline: true });
  doc.fontSize(12).list(Object.entries(kpis).map(([key, value]) => `${key}: ${value}`));

  // **Gráfico de KPIs**
  doc.moveDown().image(await generateChart(Object.values(kpis), Object.keys(kpis), 'KPIs Generales'), { fit: [500, 300], align: 'center' });

  // **Registro de Pasos en Playwright**
  doc.addPage().fontSize(16).text('Pasos de Prueba en Playwright', { underline: true });
  steps.forEach((step, index) => {
    doc.fontSize(12).text(`${index + 1}. ${step.action} (${step.duration} ms)`);
  });

  // **Gráfico de tiempos de ejecución**
  doc.addPage().fontSize(16).text('Tiempos de Ejecución en Playwright', { underline: true });
  doc.moveDown().image(stepChartBuffer, { fit: [500, 300], align: 'center' });

  doc.end();
  console.log('✅ Informe PDF generado:', pdfPath);
  await browser.close();
})();
