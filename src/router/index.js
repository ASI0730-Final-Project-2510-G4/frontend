import { createRouter, createWebHistory } from "vue-router";

import HomeComponent from "../public/pages/home.component.vue";
import AboutComponent from "../public/pages/about.component.vue";
import CategoryManagementComponent from "../publishing/pages/category-management.component.vue";
import ProfilePage from "../portfolio/pages/profile-page.component.vue";
import Portfolio from '../portfolio/pages/portfolio.component.vue'
import Dashboard from "../public/pages/dashboard.component.vue";

import DesignerQualificationsPage from '../qualifications/pages/designer-qualifications.page.vue'
import ProfileQualificationsPage from '../qualifications/pages/profile-qualifications.page.vue'


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/home',     name: 'home',     component: HomeComponent,     meta: { title: 'Home' } },
        { path: '/dashboard', name: 'Dashboard', component: Dashboard },
        { path: '/about',    name: 'about',    component: AboutComponent,    meta: { title: 'About us' } },
        { path: '/profile',  name: 'profile',  component: ProfilePage,       meta: { title: 'Profile' } },
        { path: '/portfolio', name: 'Portfolio', component: Portfolio },
        {
            path:'/qualifications',
            name:'DesignerQualifications',
            component: DesignerQualificationsPage,
            meta: { title: 'My Qualifications', role: 'designer' }
        },
        {
            path: '/designer/:id/qualifications',
            name: 'ProfileQualifications',
            component: ProfileQualificationsPage,
            meta: { title: 'Rate Designer' }
        },
        { path: '/', redirect: '/home' }
    ]
});

router.beforeEach((to, from, next) => {
    const baseTitle = 'CreateLink';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    next();
});

export default router;
