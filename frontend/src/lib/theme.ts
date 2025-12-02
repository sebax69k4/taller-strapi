// Utilidades para el manejo del tema claro/oscuro

export type Theme = 'light' | 'dark' | 'system';

/**
 * Obtiene el tema actual guardado
 */
export function getSavedTheme(): Theme {
  if (typeof localStorage === 'undefined') return 'system';
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return 'system';
}

/**
 * Aplica el tema al documento
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  
  const html = document.documentElement;
  
  if (theme === 'dark') {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else if (theme === 'light') {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    // system
    localStorage.removeItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
  
  // Disparar evento para notificar a otros componentes
  window.dispatchEvent(new CustomEvent('theme-changed', { 
    detail: { theme: html.classList.contains('dark') ? 'dark' : 'light' } 
  }));
}

/**
 * Alterna entre tema claro y oscuro
 */
export function toggleTheme(): void {
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  applyTheme(isDark ? 'light' : 'dark');
}

/**
 * Inicializa el tema al cargar la página
 * Debe llamarse lo antes posible para evitar flash
 */
export function initTheme(): void {
  const savedTheme = getSavedTheme();
  
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    // system
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }
}

/**
 * Escucha cambios en la preferencia del sistema
 */
export function watchSystemPreference(): void {
  if (typeof window === 'undefined') return;
  
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const savedTheme = getSavedTheme();
    if (savedTheme === 'system') {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });
}
