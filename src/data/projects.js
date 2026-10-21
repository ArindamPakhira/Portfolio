/* Sample entries with PLACEHOLDER links. Replace titles, descriptions, links and images.
   - category: 'Web' | 'Mobile' | 'Backend'  (filter buttons are created automatically)
   - featured: true makes the card full width
   - image: import a screenshot from src/assets (any png/jpg/webp/svg). Leave '' to show a glyph card.
   - github / live: leave '' to hide that button */
import img1 from '../assets/project-1.svg'
import img2 from '../assets/project-2.svg'
import img3 from '../assets/project-3.svg'
import img4 from '../assets/project-4.svg'

export const projects = [
  {
    id: 'employee-master',
    title: 'Employee Master',
    category: 'Mobile',
    featured: true,
    description:
      'A React Native (Expo) app for managing employee records, with cascading Unit, Department and Designation dropdowns and an add/edit modal that keeps related fields in sync.',
    technologies: ['React Native', 'Expo', 'REST API'],
    github: 'https://github.com/YOUR_USERNAME/project-name',
    live: 'https://your-live-demo.example.com',
    image: img1,
    glyph: 'RN',
  },
  {
    id: 'layered-api',
    title: 'Layered REST API',
    category: 'Backend',
    featured: false,
    description:
      'An ASP.NET Core Web API built with the Repository pattern, a service layer and dependency injection. Secured with JWT, documented with Swagger, backed by Dapper and stored procedures.',
    technologies: ['ASP.NET Core', 'C#', 'JWT', 'Dapper', 'SQL Server'],
    github: 'https://github.com/YOUR_USERNAME/project-name',
    live: '',
    image: img2,
    glyph: '.NET',
  },
  {
    id: 'microfrontend',
    title: 'Microfrontend Platform',
    category: 'Web',
    featured: false,
    description:
      'A React and Vite application split into independently deployable microfrontends using Module Federation, sharing state and a common design system.',
    technologies: ['React', 'Vite', 'Module Federation'],
    github: 'https://github.com/YOUR_USERNAME/project-name',
    live: '',
    image: img3,
    glyph: 'MF',
  },
  {
    id: 'portfolio',
    title: 'This Portfolio',
    category: 'Web',
    featured: false,
    description:
      'The site you are on: a cinematic intro, custom cursor, magnetic buttons and scroll animations, with all content kept in editable data files.',
    technologies: ['React', 'Vite', 'Framer Motion', 'CSS'],
    github: 'https://github.com/YOUR_USERNAME/project-name',
    live: 'https://your-live-demo.example.com',
    image: img4,
    glyph: 'AP',
  },
]
