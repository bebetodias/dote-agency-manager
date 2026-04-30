const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  { path: 'src/app/(dashboard)/clientes/page.tsx', depth: 3 },
  { path: 'src/app/(dashboard)/jobs/page.tsx', depth: 3 },
  { path: 'src/app/(dashboard)/producao/page.tsx', depth: 3 },
  { path: 'src/app/(dashboard)/config/page.tsx', depth: 3 },
  { path: 'src/app/(dashboard)/equipe/page.tsx', depth: 3 },
  { path: 'src/app/(dashboard)/clientes/[id]/page.tsx', depth: 4 },
  { path: 'src/app/(dashboard)/jobs/[id]/page.tsx', depth: 4 },
  { path: 'src/app/(dashboard)/equipe/[id]/page.tsx', depth: 4 },
  { path: 'src/app/page.tsx', depth: 1 }, // Landing
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, file.path);
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');

  // Add "use client";
  if (!content.includes('"use client"')) {
    content = '"use client";\n\n' + content;
  }

  // Replace imports
  content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]react-router-dom['"];/g, (match, p1) => {
    let newImports = p1.replace('useNavigate', 'useRouter');
    return `import { ${newImports.trim()} } from 'next/navigation';`;
  });

  content = content.replace(/const navigate = useNavigate\(\);/g, 'const router = useRouter();');
  content = content.replace(/navigate\(/g, 'router.push(');

  // Fix relative paths for components, types, services
  // Old path was `../components/UI`, `../services/mockData`, `../types`
  // New path prefix depends on depth
  const newPrefix = '../'.repeat(file.depth);
  
  content = content.replace(/from\s+['"]\.\.\/components/g, `from '${newPrefix}components`);
  content = content.replace(/from\s+['"]\.\.\/services/g, `from '${newPrefix}services`);
  content = content.replace(/from\s+['"]\.\.\/types/g, `from '${newPrefix}types`);
  
  // Landing specific Layout import
  if(file.path === 'src/app/page.tsx') {
    content = content.replace(/from\s+['"]\.\/components\/Layouts['"]/g, `from './components/Layouts'`);
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated: ${file.path}`);
});
