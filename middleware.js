// import { NextResponse } from 'next/server';
// const LOGIN_PATH = '/login';
// const DASHBOARD_PATH = '/dashboard';
// const UNAUTHORIZED_PATH = '/403'; 
// const AUTH_COOKIE = 'authToken';
// // Only pages that are accessible without authentication
// const PUBLIC_PATHS = [
//   '/login',
// ];
// // Optional: role mapping for specific sections (kept for future expansion)
// const ROUTE_ROLE_MAP = [
//   { pattern: /^\/admin(\/.*)?$/, roles: ['admin'] },
//   { pattern: /^\/settings(\/.*)?$/, roles: ['admin'] },
//   { pattern: /^\/users(\/.*)?$/, roles: ['admin', 'manager'] },
//   { pattern: /^\/orders(\/.*)?$/, roles: ['admin', 'manager', 'sales'] },
//   { pattern: /^\/inventory(\/.*)?$/, roles: ['admin', 'manager', 'warehouse'] },
// ];
// // Lightweight decode for JWT payload that works in Edge runtime
// function decodeJwtPayload(token) {
//   try {
//     const base64 = token.split('.')[1];
//     if (!base64) return null;
//     const base64norm = base64.replace(/-/g, '+').replace(/_/g, '/');
//     const padded = base64norm + '==='.slice((base64norm.length + 3) % 4);
//     const json = atob(padded);
//     return JSON.parse(json);
//   } catch {
//     return null;
//   }
// }
// function isPublicPath(pathname) {
//   return PUBLIC_PATHS.some((p) => {
//     if (p === '/') return pathname === '/';
//     return pathname.startsWith(p);
//   });
// }
// function getRequiredRoles(pathname) {
//   const entry = ROUTE_ROLE_MAP.find((r) => r.pattern.test(pathname));
//   return entry ? entry.roles : null; 
// }
// function userHasRequiredRole(userRoles, requiredRoles) {
//   if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) return true;
//   if (!Array.isArray(userRoles) || userRoles.length === 0) return false;
//   return userRoles.some((r) => requiredRoles.includes(r));
// }
// export function middleware(req) {
//   const { pathname, search } = req.nextUrl;
//   const token = req.cookies.get(AUTH_COOKIE)?.value;
//   // Allow all API routes to bypass middleware so login/logout and other API calls work
//   if (pathname.startsWith('/api')) {
//     return NextResponse.next();
//   }
//   // If user is already authenticated, prevent access to the login page
//   if (pathname === LOGIN_PATH && token) {
//     const url = req.nextUrl.clone();
//     url.pathname = DASHBOARD_PATH;
//     url.search = '';
//     return NextResponse.redirect(url);
//   }
//   // Allow access to public paths and Next static assets
//   if (isPublicPath(pathname) || pathname.startsWith('/_next')) {
//     return NextResponse.next();
//   }
//   // If not authenticated, redirect to login with "next" param
//   if (!token) {
//     const url = req.nextUrl.clone();
//     url.pathname = LOGIN_PATH;
//     url.search = `?next=${encodeURIComponent(pathname + (search || ''))}`;
//     return NextResponse.redirect(url);
//   }
//   // Optional: check route-level authorization if configured
//   const payload = decodeJwtPayload(token);
//   const roles = Array.isArray(payload?.roles)
//     ? payload.roles
//     : payload?.role
//       ? [payload.role]
//       : Array.isArray(payload?.permissions)
//         ? payload.permissions
//         : [];
//   const requiredRoles = getRequiredRoles(pathname);
//   if (requiredRoles && !userHasRequiredRole(roles, requiredRoles)) {
//     const url = req.nextUrl.clone();
//     url.pathname = UNAUTHORIZED_PATH;
//     url.search = '';
//     return NextResponse.redirect(url);
//   }
//   return NextResponse.next();
// }
// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico|images|assets).*)',
//   ],
// };
import { NextResponse } from 'next/server';

const LOGIN_PATH = '/login';
const DASHBOARD_PATH = '/dashboard';
const UNAUTHORIZED_PATH = '/403';
const AUTH_COOKIE = 'authToken';

const PUBLIC_PATHS = ['/login'];

const ROUTE_ROLE_MAP = [
  { pattern: /^\/admin(\/.*)?$/, roles: ['admin'] },
  { pattern: /^\/settings(\/.*)?$/, roles: ['admin'] },
  { pattern: /^\/users(\/.*)?$/, roles: ['admin', 'manager'] },
  { pattern: /^\/orders(\/.*)?$/, roles: ['admin', 'manager', 'sales'] },
  { pattern: /^\/inventory(\/.*)?$/, roles: ['admin', 'manager', 'warehouse'] },
];

// Decode JWT payload (Edge runtime friendly)
function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;
    const base64norm = base64.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64norm + '==='.slice((base64norm.length + 3) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isPublicPath(pathname) {
  return PUBLIC_PATHS.some((p) =>
    p === '/' ? pathname === '/' : pathname.startsWith(p)
  );
}

function getRequiredRoles(pathname) {
  const entry = ROUTE_ROLE_MAP.find((r) => r.pattern.test(pathname));
  return entry ? entry.roles : null;
}

function userHasRequiredRole(userRoles, requiredRoles) {
  if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) return true;
  if (!Array.isArray(userRoles) || userRoles.length === 0) return false;
  return userRoles.some((r) => requiredRoles.includes(r));
}

export function middleware(req) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE)?.value;

  // Allow API routes
  if (pathname.startsWith('/api')) return NextResponse.next();

  // Prevent logged-in users from going back to login
  if (pathname === LOGIN_PATH && token) {
    const url = req.nextUrl.clone();
    url.pathname = DASHBOARD_PATH;
    return NextResponse.redirect(url);
  }

  // Allow public & static assets
  if (isPublicPath(pathname) || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // If not authenticated → redirect to login
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.search = `?next=${encodeURIComponent(pathname + (search || ''))}`;
    return NextResponse.redirect(url);
  }

  // Decode JWT payload
  const payload = decodeJwtPayload(token);
  const roles = Array.isArray(payload?.roles)
    ? payload.roles
    : payload?.role
      ? [payload.role]
      : Array.isArray(payload?.permissions)
        ? payload.permissions
        : [];

  // Check role authorization
  const requiredRoles = getRequiredRoles(pathname);
  if (requiredRoles && !userHasRequiredRole(roles, requiredRoles)) {
    const url = req.nextUrl.clone();
    url.pathname = UNAUTHORIZED_PATH;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|assets).*)',
  ],
};
