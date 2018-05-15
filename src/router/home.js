import HomePage from '@/pages/HomePage';
import SignInPage from '@/pages/SignInPage';
import MyAccountPage from '@/pages/MyAccountPage';

export default [
  { path: '/', component: HomePage },
  { path: '/sign-in', name: 'signIn', component: SignInPage, meta: { title: 'Авторизация' } },
  { path: '/account/my', name: 'myAccount', component: MyAccountPage },
];
