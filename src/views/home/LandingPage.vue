<template>
  <div class="landing-page-wrapper min-h-screen relative flex flex-col bg-background text-gray-900 antialiased overflow-x-hidden selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
    <!-- Ambient Background Orbs -->
    <div class="ambient-orb orb-1"></div>
    <div class="ambient-orb orb-2"></div>
    
    <!-- TopNavBar Component -->
    <nav class="bg-glass-surface dark:bg-primary-container font-title-md text-title-md fixed top-0 w-full backdrop-blur-md border-b border-glass-border shadow-sm z-50">
      <div class="flex justify-between items-center px-container-padding h-20 max-w-[1400px] mx-auto">
        <div class="font-headline-lg text-headline-lg font-bold text-gray-900 dark:text-on-primary">
          EduManager Pro
        </div>
        <!-- Desktop Nav -->
        <ul class="hidden md:flex space-x-stack-md">
          <li><a class="!text-gray-700 hover:!text-black font-semibold transition-colors duration-200 block" href="#features">Tính năng</a></li>
          <li><a class="!text-gray-700 hover:!text-black font-semibold transition-colors duration-200 block" href="#benefits">Lợi ích</a></li>
          <li><a class="!text-gray-700 hover:!text-black font-semibold transition-colors duration-200 block" href="#pricing">Bảng giá</a></li>
        </ul>
        <div class="hidden md:flex items-center space-x-stack-sm">
          <router-link to="/login" class="!text-gray-700 hover:!text-black font-title-md px-4 py-2 hover:opacity-80 transition-opacity font-semibold">
            Đăng nhập
          </router-link>
          <router-link to="/login" class="bg-gray-900 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:bg-black transition-all duration-300 font-semibold">
            Bắt đầu ngay
          </router-link>
        </div>
        <!-- Mobile Menu Toggle -->
        <button class="md:hidden text-gray-900 flex items-center" @click="toggleMobileMenu">
          <span class="material-symbols-outlined">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
        </button>
      </div>
      
      <!-- Mobile Nav Drawer/Menu -->
      <div v-show="mobileMenuOpen" class="md:hidden border-t border-glass-border bg-glass-surface/95 backdrop-blur-md px-container-padding py-4 space-y-4">
        <ul class="space-y-3">
          <li><a class="!text-gray-700 hover:!text-black font-semibold transition-colors duration-200 block py-1" href="#features" @click="mobileMenuOpen = false">Tính năng</a></li>
          <li><a class="!text-gray-700 hover:!text-black font-semibold transition-colors duration-200 block py-1" href="#benefits" @click="mobileMenuOpen = false">Lợi ích</a></li>
          <li><a class="!text-gray-700 hover:!text-black font-semibold transition-colors duration-200 block py-1" href="#pricing" @click="mobileMenuOpen = false">Bảng giá</a></li>
        </ul>
        <div class="pt-4 border-t border-glass-border flex flex-col gap-2">
          <router-link to="/login" class="!text-gray-700 hover:!text-black font-title-md py-2 font-semibold text-center border border-gray-300 rounded-lg" @click="mobileMenuOpen = false">
            Đăng nhập
          </router-link>
          <router-link to="/login" class="bg-gray-900 text-white py-2.5 rounded-lg hover:bg-black transition-colors font-semibold text-center" @click="mobileMenuOpen = false">
            Bắt đầu ngay
          </router-link>
        </div>
      </div>
    </nav>
    
    <!-- Main Content Canvas -->
    <main class="flex-grow pt-28 pb-stack-lg px-container-padding max-w-[1400px] mx-auto w-full flex flex-col gap-y-16">
      <!-- Hero Section -->
      <section class="flex flex-col lg:flex-row items-center justify-between gap-stack-lg mt-stack-md">
        <div class="flex-1 space-y-stack-md z-10 pr-4">
          <h1 class="font-display-lg text-display-lg text-gray-900 leading-tight font-bold">
            Hệ thống quản lý đào tạo toàn diện
          </h1>
          <p class="font-body-lg text-body-lg text-gray-600 max-w-xl">
            Tối ưu hóa quy trình, nâng cao trải nghiệm học viên và tăng trưởng doanh thu với giải pháp công nghệ giáo dục hàng đầu.
          </p>
          <div class="flex flex-wrap gap-stack-sm pt-4">
            <router-link to="/login" class="bg-gray-900 text-white px-8 py-3 rounded-lg font-title-md shadow-md hover:shadow-xl hover:bg-black hover:-translate-y-1 transition-all duration-300 font-semibold">
              Bắt đầu ngay
            </router-link>
          </div>
        </div>
        
        <div class="flex-1 w-full max-w-2xl relative z-10 perspective-1000">
          <div class="relative rounded-xl overflow-hidden shadow-2xl transform rotate-y-[-5deg] rotate-x-[5deg] transition-transform duration-500 hover:rotate-0 border-4 border-surface-container-lowest/50 bg-surface-container-lowest/20 backdrop-blur-sm p-2">
            <img 
              alt="Dashboard" 
              class="w-full h-auto rounded-lg shadow-inner" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFGTE67V0VwVRVcE6c32UytIhoBeeDkY2BaxB9QI3zXLAD-WoUufa4aiFrHMQojjw5BkowZWXva1ONDooFBqMRkNDGzySry3I6XbrgB7IHXDdUvMcweqlIF1eHArn3IVlN2HC81whyjqPCAEzNaCLlZWdPpQw4K5ogkGNBAGL0yQ63AMkK4wxgqmT3_5mm5nljBh2Qjiom5_VlObetu-RLoho21wqHngK3dMpl8zYDR_KzJ7HKgUd-pQ6EwlhkwvrPhwhYOxOWLIyg"
            />
          </div>
          <div class="absolute -inset-4 bg-gradient-to-tr from-tertiary-fixed-dim/30 to-transparent blur-2xl -z-10 rounded-full"></div>
        </div>
      </section>
      
      <!-- Features Section -->
      <section class="space-y-stack-lg z-10 relative mt-8">
        <div class="text-center max-w-2xl mx-auto space-y-2">
          <h2 class="font-headline-lg text-headline-lg font-bold text-gray-900">Tính năng nổi bật</h2>
          <p class="font-body-lg text-body-lg text-gray-600">Mọi công cụ bạn cần để vận hành trung tâm hiệu quả</p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <!-- Card 1 -->
          <div class="glass-panel p-6 rounded-xl flex flex-col gap-3 group hover:border-blue-500 transition-colors duration-300">
            <div class="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-3xl">menu_book</span>
            </div>
            <h3 class="font-title-md text-title-md font-bold text-gray-900 mt-2">Quản lý Khóa học</h3>
            <p class="font-body-sm text-body-sm text-gray-600">Lên lịch, sắp xếp giáo viên và phòng học thông minh.</p>
          </div>
          <!-- Card 2 -->
          <div class="glass-panel p-6 rounded-xl flex flex-col gap-3 group hover:border-emerald-500 transition-colors duration-300">
            <div class="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-3xl">groups</span>
            </div>
            <h3 class="font-title-md text-title-md font-bold text-gray-900 mt-2">Quản lý Học viên</h3>
            <p class="font-body-sm text-body-sm text-gray-600">Theo dõi tiến độ, điểm danh và đánh giá kết quả học tập.</p>
          </div>
          <!-- Card 3 -->
          <div class="glass-panel p-6 rounded-xl flex flex-col gap-3 group hover:border-amber-500 transition-colors duration-300">
            <div class="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-3xl">receipt_long</span>
            </div>
            <h3 class="font-title-md text-title-md font-bold text-gray-900 mt-2">Báo cáo Tài chính</h3>
            <p class="font-body-sm text-body-sm text-gray-600">Kiểm soát thu chi, học phí và xuất báo cáo tự động.</p>
          </div>
          <!-- Card 4 -->
          <div class="glass-panel p-6 rounded-xl flex flex-col gap-3 group hover:border-indigo-500 transition-colors duration-300">
            <div class="w-12 h-12 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-3xl">smartphone</span>
            </div>
            <h3 class="font-title-md text-title-md font-bold text-gray-900 mt-2">App Học viên</h3>
            <p class="font-body-sm text-body-sm text-gray-600">Ứng dụng di động giúp học viên kết nối và tự quản lý.</p>
          </div>
        </div>
      </section>
    </main>
    
    <!-- Footer Component -->
    <footer class="bg-[#f8f9fa] dark:bg-surface-container-lowest font-body-sm text-body-sm w-full mt-auto border-t border-gray-200">
      <div class="flex flex-col md:flex-row justify-between items-center px-container-padding py-6 max-w-[1400px] mx-auto text-gray-900 gap-4">
        <div class="font-title-md font-bold text-gray-900">
          EduManager Pro
        </div>
        <div class="flex flex-wrap justify-center gap-6 font-medium">
          <a class="!text-gray-600 hover:!text-black transition-colors" href="#">Chính sách bảo mật</a>
          <a class="!text-gray-600 hover:!text-black transition-colors" href="#">Điều khoản dịch vụ</a>
          <a class="!text-gray-600 hover:!text-black transition-colors" href="#">Liên hệ</a>
          <a class="!text-gray-600 hover:!text-black transition-colors" href="#">Tuyển dụng</a>
        </div>
        <div class="text-gray-500">
          &copy; 2024 EduManager Pro. Bảo lưu mọi quyền.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<style scoped>
.landing-page-wrapper {
  background-color: #f8f9fa;
  background-image: radial-gradient(circle at top right, rgba(0, 31, 63, 0.03) 0%, transparent 40%),
                    radial-gradient(circle at bottom left, rgba(0, 31, 63, 0.05) 0%, transparent 40%);
  background-attachment: fixed;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0px 12px 24px rgba(0,0,0,0.05);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.ambient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: -1;
  opacity: 0.4;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: #afc8f0;
  top: -100px;
  right: -100px;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: #d8e2ff;
  bottom: -200px;
  left: -200px;
}
</style>
