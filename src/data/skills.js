// span = how many of 12 grid columns the card takes on desktop
export const skillGroups = [
  {
    id: 'frontend',
    title: 'Frontend',
    blurb: 'Fast, responsive interfaces',
    span: 7,
    items: ['React.js', 'Next.js', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Vite', 'Module Federation'],
  },
  {
    id: 'mobile',
    title: 'Mobile',
    blurb: 'Cross-platform apps',
    span: 5,
    items: ['React Native', 'Android development', 'iOS development', 'Expo', 'Navigation', 'State management'],
  },
  {
    id: 'backend',
    title: 'Backend',
    blurb: 'Robust, secure services',
    span: 5,
    items: ['C#', '.NET', 'ASP.NET Core', 'REST APIs'],
  },
  {
    id: 'architecture',
    title: 'Architecture',
    blurb: 'Structure that scales',
    span: 7,
    items: [
      'Repository Pattern',
      'Service Layer',
      'Dependency Injection',
      'Layered Architecture',
      'Microfrontend',
    ],
  },
  {
    id: 'database',
    title: 'Database',
    blurb: 'Queries and stored procedures',
    span: 4,
    items: ['SQL', 'SQL Server', 'MySQL', 'PostgreSQL'],
  },
  {
    id: 'api',
    title: 'API & Security',
    blurb: 'Connected, documented, protected',
    span: 4,
    items: ['API Integration', 'API Consumption', 'JWT Authentication', 'Swagger', 'Dapper'],
  },
  {
    id: 'tools',
    title: 'Languages & Tools',
    blurb: 'Everyday toolkit',
    span: 4,
    items: ['C++', 'C#', 'Java', 'Git', 'GitHub', 'VS Code', 'Visual Studio'],
  },
]

// Shown as the skill labels in the animated intro's profile panel and in search-engine metadata.
// Edit this list to change them. (Everything else on the site reads from skillGroups above.)
export const headlineSkills = [
  'React.js',
  'React Native',
  'Next.js',
  'SQL',
  'Android development',
  'iOS development',
  'API integration',
]
