// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    view: (name: string) => path(ROOTS_DASHBOARD, `/chat/${name}`),
  },
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (name: string) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    new: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    view: (name: string) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}`),
    edit: (name: string) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    demoView: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, '/invoice'),
    list: path(ROOTS_DASHBOARD, '/invoice/list'),
    new: path(ROOTS_DASHBOARD, '/invoice/new'),
    view: (id: string) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    demoView: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    new: path(ROOTS_DASHBOARD, '/blog/new'),
    view: (title: string) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
    demoView: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  },
  area: {
    root: path(ROOTS_DASHBOARD, '/area'),
    list: path(ROOTS_DASHBOARD, '/area/list'),
    new: path(ROOTS_DASHBOARD, '/area/new'),
    view: (id: string) => path(ROOTS_DASHBOARD, `/area/${id}`),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/area/${id}/edit`),
  },
  location: {
    root: path(ROOTS_DASHBOARD, '/location'),
    list: path(ROOTS_DASHBOARD, '/location/list'),
    new: path(ROOTS_DASHBOARD, '/location/new'),
    view: (id: string) => path(ROOTS_DASHBOARD, `/location/${id}`),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/location /${id}/edit`),
  },
  category: {
    root: path(ROOTS_DASHBOARD, '/category'),
    list: path(ROOTS_DASHBOARD, '/category/list'),
    new: path(ROOTS_DASHBOARD, '/category/new'),
    view: (id: string) => path(ROOTS_DASHBOARD, `/category/${id}`),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/category /${id}/edit`),
  },
  menu: {
    root: path(ROOTS_DASHBOARD, '/menu'),
    list: path(ROOTS_DASHBOARD, '/menu/list'),
    new: path(ROOTS_DASHBOARD, '/menu/new'),
    view: (id: string) => path(ROOTS_DASHBOARD, `/menu/${id}`),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/menu /${id}/edit`),
  },
  product: {
    root: path(ROOTS_DASHBOARD, '/product'),
    list: path(ROOTS_DASHBOARD, '/product/list'),
    new: path(ROOTS_DASHBOARD, '/product/new'),
    view: (id: string) => path(ROOTS_DASHBOARD, `/product/${id}`),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/product /${id}/edit`),
  },
  supplier: {
    root: path(ROOTS_DASHBOARD, '/supplier'),
    list: path(ROOTS_DASHBOARD, '/supplier/list'),
    new: path(ROOTS_DASHBOARD, '/supplier/new'),
    view: (id: string) => path(ROOTS_DASHBOARD, `/supplier/${id}`),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/supplier /${id}/edit`),
  },
  order: {
    root: path(ROOTS_DASHBOARD, '/order'),
    list: path(ROOTS_DASHBOARD, '/order/list'),
    view: (id: string) => path(ROOTS_DASHBOARD, `/supplier/${id}`),
  },
  report: {
    root: path(ROOTS_DASHBOARD, '/report'),
    list: path(ROOTS_DASHBOARD, '/report/list'),
  },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
