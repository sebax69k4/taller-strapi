const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = path.join(__dirname, '../../frontend/src/pages');

// Patrones a reemplazar
const replacements = [
  // Reemplazar verificación de JWT
  {
    from: /const (jwt|token) = Astro\.cookies\.get\('jwt'\)\?\.value;?\s*if\s*\(!(jwt|token)\)\s*\{\s*return Astro\.redirect\('\/login'\);\s*\}/g,
    to: `const userRole = Astro.cookies.get('user_role')?.value;\nif (!userRole) {\n  return Astro.redirect('/login');\n}`
  },
  // Reemplazar headers con Bearer
  {
    from: /headers:\s*\{\s*'Authorization':\s*`Bearer\s+\$\{(jwt|token)\}`\s*\}/g,
    to: `headers: {}`
  },
  {
    from: /headers:\s*\{\s*'Content-Type':\s*'application\/json',\s*'Authorization':\s*`Bearer\s+\$\{(jwt|token)\}`\s*\}/g,
    to: `headers: { 'Content-Type': 'application/json' }`
  },
  // Reemplazar fetch con helper
  {
    from: /fetch\('http:\/\/localhost:1337(\/api\/[^']+)',\s*\{\s*headers:\s*\{\s*\}\s*\}\)/g,
    to: `fetchStrapi('$1')`
  }
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  replacements.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      modified = true;
    }
  });

  if (modified) {
    // Asegurar que tenga el import de strapi
    if (!content.includes("from '../../lib/strapi'") && !content.includes("from '../lib/strapi'")) {
      const importMatch = content.match(/^---\s*\n/);
      if (importMatch) {
        const depth = filePath.split('pages')[1].split(path.sep).length - 2;
        const libPath = '../'.repeat(depth) + 'lib/strapi';
        content = content.replace(/^---\s*\n/, `---\nimport { fetchStrapi, strapiGet, strapiPost, strapiPut } from '${libPath}';\n`);
      }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Actualizado: ${path.relative(FRONTEND_DIR, filePath)}`);
    return true;
  }

  return false;
}

function walkDir(dir) {
  let updated = 0;
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      updated += walkDir(filePath);
    } else if (file.endsWith('.astro')) {
      if (processFile(filePath)) {
        updated++;
      }
    }
  });

  return updated;
}

console.log('\n🔧 Eliminando JWT y actualizando archivos...\n');
const totalUpdated = walkDir(FRONTEND_DIR);
console.log(`\n✅ Total de archivos actualizados: ${totalUpdated}\n`);
