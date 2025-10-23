// Route constants
export const SCREEN_PATH = {
  DASHBOARD: {
    pathname: '/dashboard',
    key: 'dashboard',
  },
  HOME: {
    pathname: '/',
    key: 'home',
  },
  SERVICES: {
    pathname: '/services',
    key: 'services',
  },
  BOOK: {
    pathname: '/book',
    key: 'book',
  },
  APPOINTMENT: {
    pathname: '/appointment',
    key: 'appointment',
  },
  CONTACT: {
    pathname: '/contact',
    key: 'contact',
  },
  SEARCH: {
    pathname: '/search',
    key: 'search',
  },
  PROFILE: {
    pathname: '/profile',
    key: 'profile',
  },
} as const;

export const LANDING_PAGE_PATHS = [
  SCREEN_PATH.HOME.pathname,
  SCREEN_PATH.SERVICES.pathname,
  SCREEN_PATH.BOOK.pathname,
  SCREEN_PATH.CONTACT.pathname,
];

export const NO_LAYOUT_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
];
