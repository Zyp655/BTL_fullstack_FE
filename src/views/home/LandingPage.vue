<template>
  <div class="landing-page-wrapper min-h-screen relative flex flex-col bg-[#fbf9f4] text-slate-800 antialiased overflow-x-hidden selection:bg-blue-500/10 selection:text-blue-900">
    <!-- Ambient Background Orbs -->
    <div class="ambient-orb orb-1"></div>
    <div class="ambient-orb orb-2"></div>
    <div class="ambient-orb orb-3"></div>
    
    <!-- TopNavBar Component -->
    <nav class="bg-white/70 fixed top-0 w-full backdrop-blur-xl border-b border-slate-200/50 shadow-sm z-50 transition-all duration-300">
      <div class="flex justify-between items-center px-6 md:px-12 h-20 max-w-[1400px] mx-auto">
        <router-link to="/" class="flex items-center space-x-3 group cursor-pointer">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform duration-300">
            <span class="material-symbols-outlined text-white text-[24px] font-bold">school</span>
          </div>
          <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 tracking-tight">
            EduManager Pro
          </span>
        </router-link>
        <!-- Desktop Nav -->
        <ul class="hidden md:flex space-x-8">
          <li>
            <a class="text-slate-600 hover:text-slate-900 font-semibold transition-colors duration-200 block relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full" href="#features-benefits">
              Tính năng & Lợi ích
            </a>
          </li>
        </ul>
        <div class="hidden md:flex items-center space-x-4">
          <router-link to="/login" class="text-slate-600 hover:text-slate-900 font-semibold px-4 py-2 hover:opacity-80 transition-all font-semibold">
            Đăng nhập
          </router-link>
        </div>
        <!-- Mobile Menu Toggle -->
        <button class="md:hidden text-slate-800 flex items-center p-2 rounded-lg hover:bg-slate-100 transition-colors" @click="toggleMobileMenu">
          <span class="material-symbols-outlined">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
        </button>
      </div>
      
      <!-- Mobile Nav Drawer/Menu -->
      <transition name="fade-slide">
        <div v-show="mobileMenuOpen" class="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-6 py-6 space-y-6 shadow-xl">
          <ul class="space-y-4">
            <li>
              <a class="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200 block py-2" href="#features-benefits" @click="mobileMenuOpen = false">
                Tính năng & Lợi ích
              </a>
            </li>
          </ul>
          <div class="pt-6 border-t border-slate-200 flex flex-col gap-3">
            <router-link to="/login" class="text-slate-600 hover:text-slate-900 font-semibold py-2.5 text-center border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200" @click="mobileMenuOpen = false">
              Đăng nhập
            </router-link>
          </div>
        </div>
      </transition>
    </nav>
    
    <!-- Main Content Canvas -->
    <main class="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto w-full flex flex-col gap-y-28">
      <!-- Hero Section -->
      <section class="flex flex-col lg:flex-row items-center justify-between gap-16 mt-8 relative">
        <div class="flex-1 space-y-8 z-10 pr-4 reveal reveal-fade-right">
          <div class="inline-flex items-center space-x-2 bg-blue-550/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-600 font-medium text-sm bg-blue-50">
            <span class="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
            <span>EduManager Pro v2.0 • Trải nghiệm đẳng cấp mới</span>
          </div>
          <h1 class="text-4xl md:text-5xl lg:text-6xl text-slate-900 leading-tight font-extrabold tracking-tight">
            Hệ thống quản lý <br/>
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-sky-600 to-sky-500">
              đào tạo toàn diện
            </span>
          </h1>
          <p class="text-lg text-slate-600 max-w-xl leading-relaxed">
            Tối ưu hóa quy trình vận hành giảng dạy, nâng cao hiệu suất học tập của học viên và gia tăng doanh thu vượt trội với nền tảng quản trị thông minh hàng đầu.
          </p>
          <div class="flex flex-wrap gap-4 pt-4">
            <router-link to="/login" class="relative group overflow-hidden bg-gradient-to-r from-blue-600 to-sky-500 text-white px-8 py-4 rounded-xl font-semibold shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300">
              <span class="relative z-10 flex items-center justify-center gap-2">
                Bắt đầu ngay <span class="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </span>
              <div class="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-sky-500 to-blue-600 transition-transform duration-300 -z-0"></div>
            </router-link>
          </div>
        </div>
        
        <div class="flex-1 w-full max-w-2xl relative z-10 reveal reveal-fade-left">
          <!-- Mockup with floating glass effects -->
          <div class="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white/60 backdrop-blur-md p-2 shadow-blue-500/[0.03] group hover:border-slate-300 transition-all duration-500 hover:shadow-blue-500/[0.08] mockup-float">
            <div class="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-sky-500/5 opacity-50 pointer-events-none"></div>
            <img 
              alt="Dashboard" 
              class="w-full h-auto rounded-xl shadow-inner border border-slate-100 transition-transform duration-500" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFGTE67V0VwVRVcE6c32UytIhoBeeDkY2BaxB9QI3zXLAD-WoUufa4aiFrHMQojjw5BkowZWXva1ONDooFBqMRkNDGzySry3I6XbrgB7IHXDdUvMcweqlIF1eHArn3IVlN2HC81whyjqPCAEzNaCLlZWdPpQw4K5ogkGNBAGL0yQ63AMkK4wxgqmT3_5mm5nljBh2Qjiom5_VlObetu-RLoho21wqHngK3dMpl8zYDR_KzJ7HKgUd-pQ6EwlhkwvrPhwhYOxOWLIyg"
            />
          </div>
          <!-- Blur glow background behind image -->
          <div class="absolute -inset-10 bg-gradient-to-tr from-blue-600/10 to-sky-600/10 blur-3xl -z-10 rounded-full opacity-50"></div>
        </div>
      </section>
      
      <!-- Features & Benefits Section -->
      <section id="features-benefits" class="space-y-24 z-10 relative mt-8">
        <!-- Part A: Features -->
        <div class="space-y-12 reveal reveal-fade-up">
          <div class="text-center max-w-2xl mx-auto space-y-3">
            <span class="text-blue-600 font-semibold text-sm tracking-wider uppercase bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">Tính năng cốt lõi</span>
            <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Giải pháp quản lý đào tạo toàn diện</h2>
            <p class="text-base text-slate-500">Mọi công cụ cần thiết giúp tối ưu quy trình giảng dạy và nâng tầm trải nghiệm học vụ</p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <!-- Card 1 -->
            <div class="glass-panel p-8 rounded-2xl flex flex-col gap-4 group hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/[0.02] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-3xl pointer-events-none"></div>
              <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all duration-300">
                <span class="material-symbols-outlined text-2xl">menu_book</span>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mt-2 group-hover:text-blue-600 transition-colors duration-300">Quản lý Khóa học</h3>
              <p class="text-sm text-slate-600 leading-relaxed">Lên lịch lớp, sắp xếp thời khóa biểu và phân công giảng viên tối ưu hiệu suất.</p>
            </div>
            <!-- Card 2 -->
            <div class="glass-panel p-8 rounded-2xl flex flex-col gap-4 group hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/[0.02] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-3xl pointer-events-none"></div>
              <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-md group-hover:shadow-emerald-500/20 transition-all duration-300">
                <span class="material-symbols-outlined text-2xl">groups</span>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mt-2 group-hover:text-emerald-600 transition-colors duration-300">Hồ sơ Học viên</h3>
              <p class="text-sm text-slate-600 leading-relaxed">Điểm danh thông minh, theo dõi kết quả chuyên cần và quản lý bảng điểm chi tiết.</p>
            </div>
            <!-- Card 3 -->
            <div class="glass-panel p-8 rounded-2xl flex flex-col gap-4 group hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/[0.02] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-3xl pointer-events-none"></div>
              <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-md group-hover:shadow-amber-500/20 transition-all duration-300">
                <span class="material-symbols-outlined text-2xl">payments</span>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mt-2 group-hover:text-amber-600 transition-colors duration-300">Học phí & Doanh thu</h3>
              <p class="text-sm text-slate-600 leading-relaxed">Theo dõi công nợ học phí, xuất hóa đơn điện tử và đối soát thanh toán tự động.</p>
            </div>
            <!-- Card 4 -->
            <div class="glass-panel p-8 rounded-2xl flex flex-col gap-4 group hover:border-sky-500/30 hover:shadow-xl hover:shadow-sky-500/[0.02] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-sky-500/5 to-transparent rounded-bl-3xl pointer-events-none"></div>
              <div class="w-12 h-12 rounded-xl bg-sky-550/10 text-sky-600 border border-sky-100 bg-sky-50 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-sky-500/20 transition-all duration-300">
                <span class="material-symbols-outlined text-2xl">smartphone</span>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mt-2 group-hover:text-sky-600 transition-colors duration-300">Cổng học tập học viên</h3>
              <p class="text-sm text-slate-600 leading-relaxed">Giao diện riêng giúp học viên chủ động thanh toán, tra cứu lịch học và bảng điểm.</p>
            </div>
          </div>
        </div>

        <!-- Part B: Benefits -->
        <div class="space-y-12 border-t border-slate-200/60 pt-16 reveal reveal-fade-up">
          <div class="text-center max-w-2xl mx-auto space-y-3">
            <span class="text-emerald-600 font-semibold text-sm tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Lợi ích thực tế</span>
            <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Tại sao lựa chọn EduManager Pro?</h2>
            <p class="text-base text-slate-500">Giải pháp toàn diện tối ưu hóa hiệu quả cho cả giảng viên và học viên</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <!-- Benefit 1 -->
            <div class="flex gap-5 items-start p-6 bg-white/60 rounded-2xl border border-slate-200/60 hover:bg-white hover:border-slate-350 hover:shadow-md transition-all duration-300 relative group overflow-hidden">
              <div class="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-500/[0.02] rounded-full blur-2xl group-hover:bg-emerald-500/[0.05] transition-colors duration-300"></div>
              <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span class="material-symbols-outlined text-2xl font-bold">trending_up</span>
              </div>
              <div class="space-y-2 relative z-10">
                <h4 class="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors duration-300">Tiết kiệm 80% thời gian vận hành</h4>
                <p class="text-sm text-slate-600 leading-relaxed">Tự động hóa hoàn toàn các tác vụ lặp đi lặp lại như xếp lớp, điểm danh trực tuyến, nhắc lịch học và tính toán chi phí.</p>
              </div>
            </div>

            <!-- Benefit 2 -->
            <div class="flex gap-5 items-start p-6 bg-white/60 rounded-2xl border border-slate-200/60 hover:bg-white hover:border-slate-350 hover:shadow-md transition-all duration-300 relative group overflow-hidden">
              <div class="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-500/[0.02] rounded-full blur-2xl group-hover:bg-emerald-500/[0.05] transition-colors duration-300"></div>
              <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span class="material-symbols-outlined text-2xl font-bold">verified_user</span>
              </div>
              <div class="space-y-2 relative z-10">
                <h4 class="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors duration-300">Chính xác và Minh bạch tài chính</h4>
                <p class="text-sm text-slate-600 leading-relaxed">Kết nối cổng thanh toán trực tuyến và đối soát học phí qua SePay VietQR thông minh giúp giảm thiểu sai lệch tối đa.</p>
              </div>
            </div>

            <!-- Benefit 3 -->
            <div class="flex gap-5 items-start p-6 bg-white/60 rounded-2xl border border-slate-200/60 hover:bg-white hover:border-slate-350 hover:shadow-md transition-all duration-300 relative group overflow-hidden">
              <div class="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-500/[0.02] rounded-full blur-2xl group-hover:bg-emerald-500/[0.05] transition-colors duration-300"></div>
              <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span class="material-symbols-outlined text-2xl font-bold">devices</span>
              </div>
              <div class="space-y-2 relative z-10">
                <h4 class="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors duration-300">Nâng cao chất lượng kết nối học vụ</h4>
                <p class="text-sm text-slate-600 leading-relaxed">Cung cấp cổng thông tin chuyên nghiệp cho cả học viên và giảng viên trao đổi bài tập, cập nhật điểm và phản hồi liên tục.</p>
              </div>
            </div>

            <!-- Benefit 4 -->
            <div class="flex gap-5 items-start p-6 bg-white/60 rounded-2xl border border-slate-200/60 hover:bg-white hover:border-slate-350 hover:shadow-md transition-all duration-300 relative group overflow-hidden">
              <div class="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-500/[0.02] rounded-full blur-2xl group-hover:bg-emerald-500/[0.05] transition-colors duration-300"></div>
              <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span class="material-symbols-outlined text-2xl font-bold">query_stats</span>
              </div>
              <div class="space-y-2 relative z-10">
                <h4 class="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors duration-300">Báo cáo trực quan & Ra quyết định nhanh chóng</h4>
                <p class="text-sm text-slate-600 leading-relaxed">Biểu đồ động tổng quát doanh thu, công nợ và số lượng học viên thực tế theo thời gian thực giúp tối ưu hóa định hướng giáo dục.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer Section -->
    <footer class="relative z-10 border-t border-slate-200/80 bg-white/80 backdrop-blur-xl mt-auto">
      <div class="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <!-- Logo & Brand Info -->
          <div class="lg:col-span-2 space-y-6">
            <router-link to="/" class="flex items-center space-x-3 group cursor-pointer w-fit">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform duration-300">
                <span class="material-symbols-outlined text-white text-[24px] font-bold">school</span>
              </div>
              <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 tracking-tight">
                EduManager Pro
              </span>
            </router-link>
            <p class="text-slate-600 text-sm leading-relaxed max-w-sm">
              Hệ thống quản lý đào tạo toàn diện giúp tối ưu hóa quy trình giảng dạy, nâng cao chất lượng học tập và gia tăng hiệu suất vận hành của các trung tâm giáo dục.
            </p>
            <div class="flex items-center space-x-4">
              <!-- Facebook -->
              <a :href="facebookUrl" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300" aria-label="Facebook">
                <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Column 2: Features -->
          <div class="space-y-4">
            <h4 class="text-slate-900 font-semibold tracking-wide text-sm uppercase">Giải pháp</h4>
            <ul class="space-y-2.5 text-sm text-slate-600">
              <li>
                <a href="#features-benefits" class="hover:text-blue-600 transition-colors duration-200 block">
                  Quản lý khóa học
                </a>
              </li>
              <li>
                <a href="#features-benefits" class="hover:text-blue-600 transition-colors duration-200 block">
                  Hồ sơ học viên
                </a>
              </li>
              <li>
                <a href="#features-benefits" class="hover:text-blue-600 transition-colors duration-200 block">
                  Quản lý tài chính
                </a>
              </li>
              <li>
                <a href="#features-benefits" class="hover:text-blue-600 transition-colors duration-200 block">
                  Cổng học tập học viên
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 3: Support & Legal -->
          <div class="space-y-4">
            <h4 class="text-slate-900 font-semibold tracking-wide text-sm uppercase">Hỗ trợ & Pháp lý</h4>
            <ul class="space-y-2.5 text-sm text-slate-600">
              <li>
                <a href="#" class="hover:text-blue-600 transition-colors duration-200 block">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-blue-600 transition-colors duration-200 block">
                  Điều khoản dịch vụ
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-blue-600 transition-colors duration-200 block">
                  Hướng dẫn sử dụng
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-blue-600 transition-colors duration-200 block">
                  Trung tâm hỗ trợ
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 4: Contact -->
          <div class="space-y-4">
            <h4 class="text-slate-900 font-semibold tracking-wide text-sm uppercase">Liên hệ</h4>
            <ul class="space-y-3 text-sm text-slate-600">
              <li class="flex items-start space-x-2.5">
                <span class="material-symbols-outlined text-[18px] text-blue-600 mt-0.5">mail</span>
                <span>leehieu655@gmail.com</span>
              </li>
              <li class="flex items-start space-x-2.5">
                <span class="material-symbols-outlined text-[18px] text-blue-600 mt-0.5">call</span>
                <span>+84 987 654 321</span>
              </li>
              <li class="flex items-start space-x-2.5">
                <span class="material-symbols-outlined text-[18px] text-blue-600 mt-0.5">location_on</span>
                <span>Hà Nội, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-slate-200 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 EduManager Pro. Tất cả quyền được bảo lưu.</p>
          <div class="flex items-center space-x-2">
            <span>Phát triển bằng</span>
            <span class="material-symbols-outlined text-xs text-red-500 animate-pulse">favorite</span>
            <span>cho nền giáo dục hiện đại.</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const facebookUrl = import.meta.env.VITE_FACEBOOK_URL || 'https://www.facebook.com/hieu.minh.793013/'
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      }
    })
  }, {
    threshold: 0.1
  })

  document.querySelectorAll('.reveal').forEach((el) => {
    observer.observe(el)
  })
})
</script>

<style scoped>
.landing-page-wrapper {
  background-color: #fbf9f4; /* Organic Soft-Tech background */
  background-image: 
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.035'/%3E%3C/svg%3E"),
    radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 100% 100%, rgba(99, 102, 241, 0.05) 0%, transparent 50%);
  background-attachment: fixed;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 4px 30px rgba(19, 51, 75, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.ambient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  z-index: 0;
  pointer-events: none;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0) 70%);
  top: -100px;
  right: -50px;
  animation: float-slow 20s infinite ease-in-out alternate;
}

.orb-2 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, rgba(3, 105, 161, 0) 70%);
  bottom: 10%;
  left: -150px;
  animation: float-slow 25s infinite ease-in-out alternate-reverse;
}

.orb-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, rgba(14, 165, 233, 0) 70%);
  top: 40%;
  right: 10%;
  animation: float-slow 15s infinite ease-in-out alternate;
}

@keyframes float-slow {
  0% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-40px) scale(1.1) rotate(20deg);
  }
  100% {
    transform: translateY(20px) scale(0.95) rotate(-10deg);
  }
}

.mockup-float {
  animation: float-mockup 6s infinite ease-in-out;
}

@keyframes float-mockup {
  0%, 100% {
    transform: translateY(0px) rotate-y(-6deg) rotate-x(4deg);
    box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.08);
  }
  50% {
    transform: translateY(-15px) rotate-y(-2deg) rotate-x(2deg);
    box-shadow: 0 35px 60px -10px rgba(59, 130, 246, 0.12);
  }
}

/* Scroll Reveal Animations */
.reveal {
  opacity: 0;
  transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal-fade-up {
  transform: translateY(40px);
}

.reveal-fade-right {
  transform: translateX(-40px);
}

.reveal-fade-left {
  transform: translateX(40px);
}

.reveal.is-visible {
  opacity: 1;
  transform: translate(0) rotate(0);
}

/* Slide in from top mobile menu animation */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease-out;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
