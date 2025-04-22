# ✅ Nextask Administrador

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Dnd Kit](https://img.shields.io/badge/DndKit-5932EA?style=for-the-badge&logoColor=white)](https://dndkit.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

Nextask es una aplicación web para la gestión de tareas desarrollada con React. Permite organizar tus tareas de manera intuitiva mediante categorías, ordenarlas manualmente con drag and drop, aplicar filtros, editar, completar o eliminar tareas. Está diseñada para ofrecer una experiencia rápida, simple y adaptable en cualquier dispositivo.

---

## ✨ Funcionalidades

- 📝 Gestión completa de tareas: crear, editar, eliminar y marcar como completadas  
- 🗂️ Organización por categorías, con opción de agregar y editar categorías  
- 🔎 Filtro de tareas por categoría desde la barra de navegación  
- 📅 Fechas de inicio y fin, con formato amigable (Hoy, Mañana, DD/MM)  
- 🖱️ Drag and Drop para reorganizar tareas manualmente (con `@dnd-kit`)  
- 🔄 Botón en el Navbar para **restablecer tareas a los datos base**  
- 🌙 Cambio dinámico de favicon y tema claro/oscuro según preferencia del usuario  
- 📱 Diseño responsive para escritorio y móvil  

---

## ⚠️ Importante

Cualquier cambio realizado en la app (agregar, editar o eliminar tareas/categorías) **afecta directamente la base de datos compartida** utilizada por todos los usuarios.  
El botón "Restablecer tareas" permite volver rápidamente al ejemplo base.

---

## 🧰 Tecnologías utilizadas

- **React** – Librería principal de desarrollo  
- **Context API** – Gestión global del estado  
- **React Router** – Navegación entre páginas  
- **Axios** – Consumo de API REST  
- **@dnd-kit** – Drag and drop moderno y accesible  
- **Vite** – Bundler de alto rendimiento  
- **Railway** – Hosting del backend simulado  

---

## 🚀 Cómo empezar

### Requisitos previos

- Node.js (>= 14.x)  
- npm o yarn  

### Instalación

```bash
git clone https://github.com/fakkugz/nextask-administrador.git
cd nextask-administrador
npm install
```

### Ejecutar el proyecto

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:5173](http://localhost:5173)

---

## 📁 Estructura del proyecto (resumen)

```bash
public/                 # Archivos públicos (favicon, etc.)
src/
├── assets/             # Imágenes, íconos y recursos estáticos
├── components/         # Componentes reutilizables (Navbar, List, Modals, etc.)
├── context/            # Contextos globales (TasksContext)
├── data/               # Datos base de tareas y categorías
├── pages/              # Vistas principales (Home, Error 404)
├── styles/             # Estilos globales (variables, reseteos)
├── App.jsx             # Configuración principal de rutas y contexto
└── main.jsx            # Punto de entrada de la app
```

---

## 🧪 Scripts disponibles

- `npm run dev` – Inicia el servidor de desarrollo  
- `npm run build` – Genera la app para producción  
- `npm run preview` – Previsualiza la versión de producción

---

## 🙌 Contribuciones

¡Las contribuciones son bienvenidas!  
Podés hacer un fork del proyecto, crear una rama con tu funcionalidad o corrección y enviar un pull request.

---

## 📄 Licencia

Este proyecto es de código abierto y se distribuye bajo la [Licencia MIT](LICENSE).

---

## 🌐 Demo

[https://fakkugz.github.io/nextask-administrador/](https://fakkugz.github.io/nextask-administrador/)


---

## 📫 Contacto

Si tenés dudas, sugerencias o simplemente querés saludar:

- GitHub: [@fakkugz](https://github.com/fakkugz)  
- Email: fakku5@live.com.ar
- LinkedIn: [Facundo González](https://www.linkedin.com/in/facundoegonzalez/)
