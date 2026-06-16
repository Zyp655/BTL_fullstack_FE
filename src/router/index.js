import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: { title: 'Đăng nhập', public: true }
  },
  {
    path: '/',
    name: 'LandingPage',
    component: () => import('../views/home/LandingPage.vue'),
    meta: { title: 'EduManager Pro - Quản lý Đào tạo', public: true }
  },
  {
    path: '/checkout-mock',
    name: 'CheckoutMock',
    component: () => import('../views/payments/CheckoutMock.vue'),
    meta: { title: 'Cổng thanh toán giả lập', public: true }
  },
  {
    path: '/courses',
    name: 'Courses',
    component: () => import('../views/courses/CourseList.vue'),
    meta: { title: 'Quản lý môn học', icon: 'school', roles: ['Admin', 'GiaoVien'] }
  },
  {
    path: '/classes',
    name: 'Classes',
    component: () => import('../views/classes/ClassList.vue'),
    meta: { title: 'Quản lý lớp học', icon: 'groups', roles: ['Admin', 'GiaoVien'] }
  },
  {
    path: '/classes/:id/schedules',
    name: 'ClassSchedules',
    component: () => import('../views/schedules/ScheduleList.vue'),
    meta: { title: 'Lịch học', icon: 'calendar_today', roles: ['Admin', 'GiaoVien', 'HocVien'] }
  },
  {
    path: '/classes/:id/students',
    name: 'ClassStudents',
    component: () => import('../views/classes/ClassStudents.vue'),
    meta: { title: 'Học viên & Học tập lớp học', icon: 'badge', roles: ['Admin', 'GiaoVien'] }
  },
  {
    path: '/students',
    name: 'Students',
    component: () => import('../views/students/StudentList.vue'),
    meta: { title: 'Quản lý học viên', icon: 'person', roles: ['Admin', 'GiaoVien'] }
  },
  {
    path: '/teachers',
    name: 'Teachers',
    component: () => import('../views/teachers/TeacherList.vue'),
    meta: { title: 'Quản lý giảng viên', icon: 'co_present', roles: ['Admin'] }
  },
  {
    path: '/teachers/salary',
    name: 'TeacherSalary',
    component: () => import('../views/teachers/TeacherSalaryList.vue'),
    meta: { title: 'Quản lý lương giảng viên', icon: 'account_balance', roles: ['Admin', 'GiaoVien'] }
  },
  {
    path: '/payments',
    name: 'Payments',
    component: () => import('../views/payments/PaymentList.vue'),
    meta: { title: 'Thanh toán & Báo cáo', icon: 'payments', roles: ['Admin'] }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('../views/categories/CategoryList.vue'),
    meta: { title: 'Quản lý danh mục', icon: 'category', roles: ['Admin'] }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/users/UserList.vue'),
    meta: { title: 'Quản lý tài khoản', icon: 'manage_accounts', adminOnly: true, roles: ['Admin'] }
  },
  {
    path: '/classrooms',
    name: 'Classrooms',
    component: () => import('../views/classrooms/ClassroomList.vue'),
    meta: { title: 'Quản lý phòng học', icon: 'meeting_room', roles: ['Admin'] }
  },
  {
    path: '/support-messages',
    name: 'SupportMessages',
    component: () => import('../views/students/SupportMessages.vue'),
    meta: { title: 'Yêu cầu hỗ trợ', icon: 'chat', roles: ['Admin'] }
  },
  {
    path: '/student-portal',
    name: 'StudentPortal',
    component: () => import('../views/students/StudentPortal.vue'),
    meta: { title: 'Cổng học tập', icon: 'dashboard', roles: ['HocVien', 'Admin'] }
  },
  {
    path: '/register-course',
    name: 'RegisterCourse',
    redirect: to => {
      return { path: '/student-portal', query: { ...to.query, tab: 'register' } }
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/profile/Profile.vue'),
    meta: { title: 'Trang cá nhân', icon: 'person', roles: ['Admin', 'GiaoVien', 'HocVien'] }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  document.title = to.meta?.title ? `${to.meta.title} — Trung tâm đào tạo` : 'Trung tâm đào tạo'
  
  const getHomeRoute = (role) => {
    if (role === 'Admin') return '/courses'
    if (role === 'GiaoVien') return '/classes'
    if (role === 'HocVien') return '/student-portal'
    return '/login'
  }

  if (!to.meta.public && !authStore.isAuthenticated) {
    next('/login')
  } else if (authStore.isAuthenticated && (to.path === '/' || to.name === 'Login')) {
    next(getHomeRoute(authStore.userRole))
  } else {
    // Check roles
    const allowedRoles = to.meta?.roles
    if (allowedRoles && !allowedRoles.includes(authStore.userRole)) {
      // Access denied, redirect to role's home page
      next(getHomeRoute(authStore.userRole))
    } else if (to.meta.adminOnly && !authStore.isAdmin) {
      next(getHomeRoute(authStore.userRole))
    } else {
      next()
    }
  }
})

export default router

