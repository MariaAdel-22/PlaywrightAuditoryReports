# **Automatización de Auditorías Web con Playwright e IA**

## **Descripción**

Este proyecto automatiza la auditoría de aplicaciones web mediante el uso de herramientas como **Playwright**, **axe-core** y **PDFKit**. El sistema permite realizar un análisis exhaustivo de diversas métricas, como el rendimiento, la accesibilidad, los errores en consola, las solicitudes fallidas y las cabeceras HTTP, entre otros. El resultado de la auditoría se presenta en un **informe PDF** con gráficos interactivos, lo que facilita la comprensión y análisis de los datos.

## **Objetivos**

- **Automatización de auditorías web** para evaluar el rendimiento y accesibilidad.
- **Generación de informes detallados** en formato PDF, con métricas clave de rendimiento, accesibilidad y más.
- **Integración de Playwright** para la automatización de pruebas de interacción con la aplicación web.
- **Análisis de la accesibilidad** utilizando axe-core para asegurar la compatibilidad con las normativas WCAG.
- **Captura de errores en consola** y **solicitudes fallidas** para asegurar el buen funcionamiento de la aplicación.
- **Validación de cabeceras HTTP y seguridad web**, monitoreo de **APIs externas** y análisis de las interacciones del usuario.

## **Tecnologías utilizadas**

- **Playwright**: Framework de automatización para pruebas de aplicaciones web, utilizado para interactuar con la aplicación y registrar métricas de rendimiento.
- **axe-core**: Biblioteca de análisis de accesibilidad, utilizada para evaluar el cumplimiento con las WCAG y ARIA.
- **PDFKit**: Librería utilizada para la creación de informes en PDF, incluyendo gráficos generados con **Chart.js**.
- **ChartJS-Node-Canvas**: Herramienta para generar gráficos a partir de los datos recopilados en las auditorías.

## **Dependencias**

### **playwright**
- **Funcionalidad**: Utilizado para realizar la automatización de las pruebas de la aplicación web.
- **Descripción**: Permite la simulación de navegación, clics y entrada de datos en formularios.

### **axe-core**
- **Funcionalidad**: Herramienta para realizar auditorías de accesibilidad, cumpliendo con las normas WCAG y ARIA.
- **Descripción**: Identifica posibles problemas de accesibilidad que puedan afectar la experiencia del usuario.

### **pdfkit**
- **Funcionalidad**: Utilizado para generar informes PDF con los resultados de la auditoría.
- **Descripción**: Permite la creación de informes visualmente atractivos y fáciles de interpretar.

### **chartjs-node-canvas**
- **Funcionalidad**: Usado para crear gráficos interactivos que muestran el análisis de KPIs y tiempos de ejecución.
- **Descripción**: Los gráficos se incluyen en los informes generados en PDF.

## **Cómo ejecutar el proyecto**

### **Instalación de dependencias**

Primero, clona el repositorio e instala las dependencias necesarias:

```bash
git clone <url_del_repositorio>
cd <nombre_del_directorio>
npm install playwright axe-core pdfkit chartjs-node-canvas
```
### **### **Instalación de dependencias**
```node
node audit.js
```
