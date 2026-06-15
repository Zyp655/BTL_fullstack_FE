<template>
  <div class="landing-page-wrapper min-h-screen relative flex flex-col bg-[#fbf9f4] text-slate-800 antialiased overflow-x-hidden selection:bg-blue-500/10 selection:text-blue-900">
    <!-- Ambient Background Orbs -->
    <div class="ambient-orb orb-1"></div>
    <div class="ambient-orb orb-2"></div>
    <div class="ambient-orb orb-3"></div>
    
    <!-- Background Floating Particles -->
    <div class="floating-particles">
      <div v-for="i in 8" :key="i" class="particle" :class="'particle-' + i"></div>
    </div>
    
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
          <router-link to="/login" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-200">
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
            <router-link to="/login" class="w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold py-3 text-center rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-200" @click="mobileMenuOpen = false">
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
            <span class="inline-flex flex-col h-[1.2em] overflow-hidden relative select-none align-bottom py-1">
              <span class="carousel-word-wrapper">
                <span v-for="(word, index) in words" :key="index" class="carousel-word bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-sky-600 to-sky-500 block">
                  {{ word }}
                </span>
              </span>
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
          <!-- Static premium Mockup card -->
          <div 
            class="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white/60 backdrop-blur-md p-2 shadow-blue-500/[0.03] border-slate-300 hover:shadow-blue-500/[0.08] transition-shadow duration-300"
            style="transform: perspective(1000px) rotateX(4deg) rotateY(-6deg) scale3d(1, 1, 1); transform-style: preserve-3d; backface-visibility: hidden;"
          >
            <div class="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-sky-500/5 opacity-50 pointer-events-none"></div>
            <img 
              alt="Dashboard" 
              class="w-full h-auto rounded-xl shadow-inner border border-slate-100" 
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
            <div @click="open3DModal('course')" class="glass-panel p-8 rounded-2xl flex flex-col gap-4 group hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/[0.02] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden cursor-pointer" title="Xem mô phỏng 3D">
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-3xl pointer-events-none"></div>
              <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all duration-300">
                <span class="material-symbols-outlined text-2xl">menu_book</span>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mt-2 group-hover:text-blue-600 transition-colors duration-300">Quản lý Khóa học</h3>
              <p class="text-sm text-slate-600 leading-relaxed">Lên lịch lớp, sắp xếp thời khóa biểu và phân công giảng viên tối ưu hiệu suất.</p>
              <div class="mt-auto text-xs font-bold text-blue-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Khám phá 3D</span>
                <span class="material-symbols-outlined text-[14px]">chevron_right</span>
              </div>
            </div>
            <!-- Card 2 -->
            <div @click="open3DModal('student')" class="glass-panel p-8 rounded-2xl flex flex-col gap-4 group hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/[0.02] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden cursor-pointer" title="Xem mô phỏng 3D">
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-3xl pointer-events-none"></div>
              <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-md group-hover:shadow-emerald-500/20 transition-all duration-300">
                <span class="material-symbols-outlined text-2xl">groups</span>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mt-2 group-hover:text-emerald-600 transition-colors duration-300">Hồ sơ Học viên</h3>
              <p class="text-sm text-slate-600 leading-relaxed">Điểm danh thông minh, theo dõi kết quả chuyên cần và quản lý bảng điểm chi tiết.</p>
              <div class="mt-auto text-xs font-bold text-emerald-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Khám phá 3D</span>
                <span class="material-symbols-outlined text-[14px]">chevron_right</span>
              </div>
            </div>
            <!-- Card 3 -->
            <div @click="open3DModal('finance')" class="glass-panel p-8 rounded-2xl flex flex-col gap-4 group hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/[0.02] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden cursor-pointer" title="Xem mô phỏng 3D">
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-3xl pointer-events-none"></div>
              <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-md group-hover:shadow-amber-500/20 transition-all duration-300">
                <span class="material-symbols-outlined text-2xl">payments</span>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mt-2 group-hover:text-amber-600 transition-colors duration-300">Học phí & Doanh thu</h3>
              <p class="text-sm text-slate-600 leading-relaxed">Theo dõi công nợ học phí, xuất hóa đơn điện tử và đối soát thanh toán tự động.</p>
              <div class="mt-auto text-xs font-bold text-amber-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Khám phá 3D</span>
                <span class="material-symbols-outlined text-[14px]">chevron_right</span>
              </div>
            </div>
            <!-- Card 4 -->
            <div @click="open3DModal('portal')" class="glass-panel p-8 rounded-2xl flex flex-col gap-4 group hover:border-sky-500/30 hover:shadow-xl hover:shadow-sky-500/[0.02] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden cursor-pointer" title="Xem mô phỏng 3D">
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-sky-500/5 to-transparent rounded-bl-3xl pointer-events-none"></div>
              <div class="w-12 h-12 rounded-xl bg-sky-550/10 text-sky-600 border border-sky-100 bg-sky-50 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-sky-500/20 transition-all duration-300">
                <span class="material-symbols-outlined text-2xl">smartphone</span>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mt-2 group-hover:text-sky-600 transition-colors duration-300">Cổng học tập học viên</h3>
              <p class="text-sm text-slate-600 leading-relaxed">Giao diện riêng giúp học viên chủ động thanh toán, tra cứu lịch học và bảng điểm.</p>
              <div class="mt-auto text-xs font-bold text-sky-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Khám phá 3D</span>
                <span class="material-symbols-outlined text-[14px]">chevron_right</span>
              </div>
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

    <!-- 3D Interactive Modal Popup -->
    <teleport to="body">
      <transition name="modal-fade">
        <div v-if="active3DModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div class="bg-white/95 backdrop-blur-[24px] border border-white/50 shadow-[0_20px_40px_rgba(0,31,63,0.15)] w-full max-w-4xl rounded-2xl overflow-hidden animate-scale-in flex flex-col md:flex-row h-[90vh] md:h-[520px]">
            
            <!-- 3D Canvas Container -->
            <div class="flex-1 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 relative min-h-[300px] md:min-h-0 flex items-center justify-center overflow-hidden">
              <canvas ref="threeCanvas" class="w-full h-full block cursor-grab active:cursor-grabbing"></canvas>
              
              <!-- 3D Drag Tip Overlay -->
              <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-[10px] font-bold text-white/70 uppercase tracking-widest flex items-center gap-1.5 pointer-events-none select-none">
                <span class="material-symbols-outlined text-[13px] animate-pulse">drag_pan</span>
                Kéo chuột để xoay 3D
              </div>

              <!-- Loading scene placeholder -->
              <div v-if="loading3D" class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-955/80 transition-opacity duration-300">
                <span class="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
                <span class="text-xs text-white/50 font-bold uppercase tracking-wide">Đang khởi tạo 3D...</span>
              </div>
            </div>

            <!-- Modal Info Description Panel -->
            <div class="w-full md:w-[380px] p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-200 bg-white">
              <div class="space-y-6">
                <!-- Header Title & Tag -->
                <div class="space-y-2">
                  <span class="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border border-blue-500/20 text-blue-600 bg-blue-50 inline-block">
                    Mô phỏng 3D
                  </span>
                  <h3 class="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    {{ modalInfo.title }}
                  </h3>
                </div>

                <!-- Description Text -->
                <p class="text-sm text-slate-600 leading-relaxed">
                  {{ modalInfo.description }}
                </p>

                <!-- Feature list items -->
                <div class="space-y-3 pt-2">
                  <div v-for="(feat, idx) in modalInfo.features" :key="idx" class="flex items-start gap-2.5 text-xs text-slate-700 font-semibold">
                    <span class="material-symbols-outlined text-[16px] text-blue-600 shrink-0 mt-0.5" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                    <span>{{ feat }}</span>
                  </div>
                </div>
              </div>

              <!-- Footer Buttons -->
              <div class="flex gap-3 pt-6 border-t border-slate-100">
                <router-link to="/login" class="flex-1 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-sky-500 hover:to-blue-600 text-white font-bold text-center py-3 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 transition-all text-xs flex items-center justify-center">
                  Thử nghiệm ngay
                </router-link>
                <button @click="close3DModal" class="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors text-xs cursor-pointer">
                  Đóng
                </button>
              </div>

            </div>

          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import * as THREE from 'three'

const facebookUrl = import.meta.env.VITE_FACEBOOK_URL || 'https://www.facebook.com/hieu.minh.793013/'
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Word Carousel variables
const words = [
  'đào tạo toàn diện',
  'vận hành tối ưu',
  'học vụ thông minh',
  'đào tạo toàn diện'
]

// 3D Modal References & States
const active3DModal = ref(null)
const threeCanvas = ref(null)
const loading3D = ref(false)

const featureDetails = {
  course: {
    title: "Hệ thống Quản lý Khóa học",
    description: "Tối ưu hóa sắp xếp lịch dạy, tránh trùng lặp thời khóa biểu và tự động điều phối phòng học cùng giáo viên phụ trách.",
    features: ["Tự động xếp lịch thông minh", "Cảnh báo trùng lịch ngay lập tức", "Báo cáo hiệu suất sử dụng phòng học"]
  },
  student: {
    title: "Hồ sơ & Chuyên cần Học viên",
    description: "Số hóa học bạ điện tử, điểm danh thông minh bằng QR/nhận diện và tự động hóa hệ thống chấm điểm chuyên cần của trung tâm.",
    features: ["Theo dõi chuyên cần theo thời gian thực", "Điểm danh trực quan bằng biểu đồ", "Đồng bộ hóa kết quả thi và học bạ"]
  },
  finance: {
    title: "Học phí & Quản trị Doanh thu",
    description: "Tự động hóa hoàn toàn các giao dịch đóng học phí, đối soát thông minh qua VietQR SePay và cảnh báo công nợ định kỳ.",
    features: ["Giao dịch tự động VietQR SePay", "Theo dõi công nợ học phí tự động", "Báo cáo doanh thu & tăng trưởng trực quan"]
  },
  portal: {
    title: "Cổng học vụ riêng cho Học viên",
    description: "Không gian cá nhân hóa giúp học viên dễ dàng theo dõi tiến độ, tra cứu lịch học, xem bảng điểm và thực hiện thanh toán trực tuyến.",
    features: ["Ví tích lũy bảo lưu học phí", "Tra cứu thời khóa biểu cá nhân", "Cổng thanh toán học phí trực tiếp"]
  }
}

const modalInfo = computed(() => {
  return featureDetails[active3DModal.value] || { title: '', description: '', features: [] }
})

// Three.js Scene Variables
let scene, camera, renderer, animationFrameId, activeMesh
let isDragging = false
let previousMousePosition = { x: 0, y: 0 }

const open3DModal = (type) => {
  active3DModal.value = type
  loading3D.value = true
  
  nextTick(() => {
    initThree(type)
  })
}

const close3DModal = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  
  window.removeEventListener('resize', handleResize)
  
  const canvas = threeCanvas.value
  if (canvas) {
    canvas.removeEventListener('pointerdown', onPointerDown)
    canvas.removeEventListener('pointermove', onPointerMove)
    canvas.removeEventListener('pointerup', onPointerUp)
    canvas.removeEventListener('pointerleave', onPointerUp)
  }

  if (scene) {
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose()
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose())
        } else {
          object.material.dispose()
        }
      }
    })
    scene = null
  }

  if (renderer) {
    renderer.dispose()
    renderer = null
  }

  camera = null
  activeMesh = null
  active3DModal.value = null
  loading3D.value = false
}

// Pointer Drag Event Listeners
const onPointerDown = (e) => {
  isDragging = true
}

const onPointerMove = (e) => {
  const deltaMove = {
    x: e.offsetX - previousMousePosition.x,
    y: e.offsetY - previousMousePosition.y
  }

  if (isDragging && activeMesh) {
    activeMesh.rotation.y += deltaMove.x * 0.007
    activeMesh.rotation.x += deltaMove.y * 0.007
  }

  previousMousePosition = {
    x: e.offsetX,
    y: e.offsetY
  }
}

const onPointerUp = () => {
  isDragging = false
}

const handleResize = () => {
  const canvas = threeCanvas.value
  if (!canvas || !camera || !renderer) return
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height, false)
}

// Procedural 3D Builders
const createCourse3D = () => {
  const group = new THREE.Group()

  // 1. The Book Cover
  const coverGeo = new THREE.BoxGeometry(2.2, 3.0, 0.3)
  const coverMat = new THREE.MeshStandardMaterial({
    color: 0x2563eb,
    roughness: 0.3,
    metalness: 0.1
  })
  const cover = new THREE.Mesh(coverGeo, coverMat)
  group.add(cover)

  // 2. The Book Pages
  const pagesGeo = new THREE.BoxGeometry(2.0, 2.8, 0.25)
  const pagesMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.8
  })
  const pages = new THREE.Mesh(pagesGeo, pagesMat)
  pages.position.x = 0.05
  group.add(pages)

  // 3. Floating Ring
  const ringGeo = new THREE.TorusGeometry(2.0, 0.03, 8, 48)
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true
  })
  const ring = new THREE.Mesh(ringGeo, ringMat)
  ring.rotation.x = Math.PI / 2.5
  group.add(ring)

  return group
}

const createStudent3D = () => {
  const group = new THREE.Group()
  const count = 12
  const nodes = []

  const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16)
  const nodeMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x047857,
    roughness: 0.1
  })

  for (let i = 0; i < count; i++) {
    const mesh = new THREE.Mesh(nodeGeo, nodeMat)
    const u = Math.random()
    const v = Math.random()
    const theta = u * 2.0 * Math.PI
    const phi = Math.acos(2.0 * v - 1.0)
    const r = 1.5 + Math.random() * 0.3
    
    mesh.position.x = r * Math.sin(phi) * Math.cos(theta)
    mesh.position.y = r * Math.sin(phi) * Math.sin(theta)
    mesh.position.z = r * Math.cos(phi)
    
    group.add(mesh)
    nodes.push(mesh.position)
  }

  const lineMat = new THREE.LineBasicMaterial({
    color: 0x34d399,
    transparent: true,
    opacity: 0.4
  })

  const points = []
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const dist = nodes[i].distanceTo(nodes[j])
      if (dist < 2.5) {
        points.push(nodes[i].clone())
        points.push(nodes[j].clone())
      }
    }
  }

  const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
  const lines = new THREE.LineSegments(lineGeo, lineMat)
  group.add(lines)

  return group
}

const createPortal3D = () => {
  const group = new THREE.Group()

  // Phone Frame
  const frameGeo = new THREE.BoxGeometry(1.6, 3.2, 0.15)
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.4,
    metalness: 0.9
  })
  const frame = new THREE.Mesh(frameGeo, frameMat)
  group.add(frame)

  // Screen
  const screenGeo = new THREE.BoxGeometry(1.5, 3.1, 0.04)
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9,
    emissive: 0x0369a1,
    roughness: 0.1
  })
  const screen = new THREE.Mesh(screenGeo, screenMat)
  screen.position.z = 0.06
  group.add(screen)

  return group
}

// Init Three.js Scene
const initThree = (type) => {
  const canvas = threeCanvas.value
  if (!canvas) return

  // 1. Create Scene
  scene = new THREE.Scene()

  // 2. Camera Setup
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.z = 6.5

  // 3. Renderer Setup
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  })
  renderer.setSize(width, height, false)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // 4. Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.7)
  scene.add(ambient)

  const light1 = new THREE.DirectionalLight(0x38bdf8, 1.2)
  light1.position.set(5, 5, 5)
  scene.add(light1)

  const light2 = new THREE.PointLight(0xa855f7, 1.5, 10)
  light2.position.set(-3, -3, 3)
  scene.add(light2)

  // 5. Build Procedural 3D Mesh
  if (type === 'course') {
    activeMesh = createCourse3D()
  } else if (type === 'student') {
    activeMesh = createStudent3D()
  } else if (type === 'finance') {
    const group = new THREE.Group()
    const cardGeo = new THREE.BoxGeometry(3.0, 1.8, 0.08)
    const cardMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.15
    })
    const card = new THREE.Mesh(cardGeo, cardMat)
    group.add(card)

    const coinGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.12, 24)
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.2
    })
    for (let i = 0; i < 4; i++) {
      const coin = new THREE.Mesh(coinGeo, coinMat)
      coin.position.set(-0.6, -1.0 + (i * 0.15), 0.2)
      coin.rotation.x = 0.2
      group.add(coin)
    }
    activeMesh = group
  } else if (type === 'portal') {
    activeMesh = createPortal3D()
  }

  if (activeMesh) {
    scene.add(activeMesh)
  }

  // 6. Interaction listeners
  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointerleave', onPointerUp)
  window.addEventListener('resize', handleResize)

  loading3D.value = false

  // 7. Render Loop
  const clock = new THREE.Clock()
  const animate = () => {
    if (!renderer) return
    animationFrameId = requestAnimationFrame(animate)

    const elapsed = clock.getElapsedTime()

    if (activeMesh && !isDragging) {
      activeMesh.rotation.y = Math.sin(elapsed * 0.4) * 0.3
      activeMesh.rotation.x = Math.sin(elapsed * 0.2) * 0.15
    }

    renderer.render(scene, camera)
  }

  animate()
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
    radial-gradient(circle at 10% 10%, rgba(59, 130, 246, 0.06) 0%, transparent 50%),
    radial-gradient(circle at 90% 90%, rgba(99, 102, 241, 0.06) 0%, transparent 50%);
  background-attachment: scroll;
  background-size: 200% 200%;
  animation: bg-gradient-shift 22s ease infinite alternate;
}

@keyframes bg-gradient-shift {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 50% 0%;
  }
}

/* Background Floating Particles */
.floating-particles {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(56, 189, 248, 0.1) 60%, transparent 100%);
  filter: blur(3px);
  pointer-events: none;
  animation: float-drift infinite linear;
  bottom: -150px;
}

.particle-1 { width: 100px; height: 100px; left: 8%; animation-duration: 26s; animation-delay: 0s; }
.particle-2 { width: 80px; height: 80px; left: 35%; animation-duration: 32s; animation-delay: -5s; }
.particle-3 { width: 120px; height: 120px; left: 65%; animation-duration: 38s; animation-delay: -12s; }
.particle-4 { width: 90px; height: 90px; left: 88%; animation-duration: 29s; animation-delay: -3s; }
.particle-5 { width: 70px; height: 70px; left: 22%; animation-duration: 34s; animation-delay: -18s; }
.particle-6 { width: 110px; height: 110px; left: 50%; animation-duration: 28s; animation-delay: -8s; }
.particle-7 { width: 60px; height: 60px; left: 78%; animation-duration: 24s; animation-delay: -15s; }
.particle-8 { width: 100px; height: 100px; left: 93%; animation-duration: 33s; animation-delay: -22s; }

@keyframes float-drift {
  0% {
    transform: translateY(0px) translateX(0px) scale(0.8);
    opacity: 0;
  }
  15% {
    opacity: 0.75;
  }
  85% {
    opacity: 0.75;
  }
  100% {
    transform: translateY(-110vh) translateX(50px) scale(1.15);
    opacity: 0;
  }
}

/* Word Carousel styling */
.carousel-word-wrapper {
  display: flex;
  flex-direction: column;
  animation: word-carousel 9s cubic-bezier(0.76, 0, 0.24, 1) infinite;
}

@keyframes word-carousel {
  0%, 25% {
    transform: translateY(0);
  }
  33.33%, 58.33% {
    transform: translateY(-25%);
  }
  66.66%, 91.66% {
    transform: translateY(-50%);
  }
  100% {
    transform: translateY(-75%);
  }
}

.carousel-word {
  height: 1.2em;
  line-height: 1.2em;
}

/* Glass panel premium card hover shimmers */
.glass-panel {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 4px 30px rgba(19, 51, 75, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.6);
  position: relative;
  overflow: hidden;
}

.glass-panel::after {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.35),
    transparent
  );
  transition: all 0.7s ease-in-out;
}

.glass-panel:hover::after {
  left: 150%;
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
  background: radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0) 70%);
  top: -100px;
  right: -50px;
  animation: float-slow 20s infinite ease-in-out alternate;
}

.orb-2 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(3, 105, 161, 0) 70%);
  bottom: 10%;
  left: -150px;
  animation: float-slow 25s infinite ease-in-out alternate-reverse;
}

.orb-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(14, 165, 233, 0) 70%);
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
