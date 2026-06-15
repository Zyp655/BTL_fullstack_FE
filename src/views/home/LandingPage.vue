<template>
  <div class="landing-page-wrapper min-h-screen relative flex flex-col bg-[#f8f9fa] text-[#191c1d] antialiased overflow-x-hidden selection:bg-[#2b83ff]/10 selection:text-[#001f3f]">
    <!-- Ambient Background Orbs -->
    <div class="ambient-orb orb-1"></div>
    <div class="ambient-orb orb-2"></div>
    <div class="ambient-orb orb-3"></div>
    
    <!-- Background Floating Particles -->
    <div class="floating-particles">
      <div v-for="i in 8" :key="i" class="particle" :class="'particle-' + i"></div>
    </div>
    
    <!-- TopNavBar Component -->
    <nav class="bg-white/70 fixed top-0 w-full backdrop-blur-xl border-b border-white/40 shadow-sm z-50 transition-all duration-300">
      <!-- Scroll Progress Bar -->
      <div class="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-[#001f3f] to-[#2b83ff] transition-all duration-75" :style="{ width: scrollProgress + '%' }"></div>
      
      <div class="flex justify-between items-center px-6 md:px-12 h-20 w-full">
        <router-link to="/" class="flex items-center space-x-3 group cursor-pointer">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#001f3f] to-[#2b83ff] flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform duration-300">
            <span class="material-symbols-outlined text-white text-[24px] font-bold">school</span>
          </div>
          <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#000613] via-[#001f3f] to-[#2b83ff] tracking-tight">
            EduManager Pro
          </span>
        </router-link>
        <!-- Desktop Nav -->
        <ul class="hidden md:flex space-x-8">
          <li>
            <a class="text-[#5d5f5f] hover:text-[#000613] font-semibold transition-colors duration-200 block relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#2b83ff] after:transition-all after:duration-300 hover:after:w-full" href="#features">
              Tính năng
            </a>
          </li>
          <li>
            <a class="text-[#5d5f5f] hover:text-[#000613] font-semibold transition-colors duration-200 block relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#2b83ff] after:transition-all after:duration-300 hover:after:w-full" href="#tour">
              Trải nghiệm thực tế
            </a>
          </li>
          <li>
            <a class="text-[#5d5f5f] hover:text-[#000613] font-semibold transition-colors duration-200 block relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#2b83ff] after:transition-all after:duration-300 hover:after:w-full" href="#pricing">
              Bảng giá
            </a>
          </li>
        </ul>
        <div class="hidden md:flex items-center space-x-4">
          <router-link to="/login" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#001f3f] to-[#2b83ff] text-white font-bold shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-0.5 active:scale-95 transition-all duration-200">
            Đăng nhập
          </router-link>
        </div>
        <!-- Mobile Menu Toggle -->
        <button class="md:hidden text-[#000613] flex items-center p-2 rounded-lg hover:bg-slate-100 transition-colors" @click="toggleMobileMenu">
          <span class="material-symbols-outlined">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
        </button>
      </div>
      
      <!-- Mobile Nav Drawer/Menu -->
      <transition name="fade-slide">
        <div v-show="mobileMenuOpen" class="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-6 py-6 space-y-6 shadow-xl">
          <ul class="space-y-4">
            <li>
              <a class="text-[#5d5f5f] hover:text-[#000613] font-medium transition-colors duration-200 block py-2" href="#features" @click="mobileMenuOpen = false">
                Tính năng
              </a>
            </li>
            <li>
              <a class="text-[#5d5f5f] hover:text-[#000613] font-medium transition-colors duration-200 block py-2" href="#tour" @click="mobileMenuOpen = false">
                Trải nghiệm thực tế
              </a>
            </li>
            <li>
              <a class="text-[#5d5f5f] hover:text-[#000613] font-medium transition-colors duration-200 block py-2" href="#pricing" @click="mobileMenuOpen = false">
                Bảng giá
              </a>
            </li>
          </ul>
          <div class="pt-6 border-t border-slate-200 flex flex-col gap-3">
            <router-link to="/login" class="w-full bg-gradient-to-r from-[#001f3f] to-[#2b83ff] text-white font-bold py-3 text-center rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-0.5 active:scale-95 transition-all duration-200" @click="mobileMenuOpen = false">
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
          <div class="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-[#2b83ff] font-medium text-sm">
            <span class="w-2 h-2 rounded-full bg-[#2b83ff] animate-ping"></span>
            <span>EduManager Pro v2.0 • Trải nghiệm đẳng cấp mới</span>
          </div>
          <h1 class="text-4xl md:text-5xl lg:text-6xl text-[#000613] leading-tight font-extrabold tracking-tight">
            Hệ thống quản lý <br/>
            <span class="inline-flex flex-col h-[1.2em] overflow-hidden relative select-none align-bottom py-1">
              <span class="carousel-word-wrapper">
                <span v-for="(word, index) in words" :key="index" class="carousel-word bg-clip-text text-transparent bg-gradient-to-r from-[#001f3f] via-[#2b83ff] to-cyan-500 block">
                  {{ word }}
                </span>
              </span>
            </span>
          </h1>
          <p class="text-lg text-[#43474e] max-w-xl leading-relaxed">
            Tối ưu hóa quy trình vận hành giảng dạy, nâng cao hiệu suất học tập của học viên và gia tăng doanh thu vượt trội với nền tảng quản trị thông minh hàng đầu.
          </p>
          <div class="flex flex-wrap gap-4 pt-4">
            <router-link to="/login" class="relative group overflow-hidden bg-gradient-to-r from-[#001f3f] to-[#2b83ff] text-white px-8 py-4 rounded-xl font-semibold shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300">
              <span class="relative z-10 flex items-center justify-center gap-2">
                Bắt đầu ngay <span class="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </span>
              <div class="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-[#2b83ff] to-[#001f3f] transition-transform duration-300 -z-0"></div>
            </router-link>
            <a href="#tour" class="px-8 py-4 bg-white/60 backdrop-blur-md border border-white/40 text-[#000613] rounded-xl font-semibold hover:bg-white/80 hover:-translate-y-1 transition-all shadow-sm flex items-center justify-center gap-2">
              <span class="material-symbols-outlined">play_circle</span>
              Xem trải nghiệm
            </a>
          </div>
        </div>
        
        <div class="flex-1 w-full max-w-2xl relative z-10 reveal reveal-fade-left">
          <!-- 3D Interactive Hero Showcase -->
          <div class="relative w-full h-[380px] md:h-[420px] rounded-xl overflow-hidden border border-white/40 bg-gradient-to-br from-[#0f131b] via-[#1c2028] to-[#0a0e16] shadow-2xl flex items-center justify-center">
            <canvas ref="heroCanvas" class="w-full h-full block cursor-grab active:cursor-grabbing"></canvas>
            
            <!-- Floating interactive tip -->
            <div class="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white/90 uppercase tracking-widest flex items-center gap-1.5 pointer-events-none select-none">
              <span class="material-symbols-outlined text-[13px] text-[#2b83ff]">3d_rotation</span>
              Di chuột để xoay thiết bị 3D
            </div>
          </div>
          <!-- Blur glow background behind image -->
          <div class="absolute -inset-10 bg-gradient-to-tr from-[#2b83ff]/10 to-cyan-500/10 blur-3xl -z-10 rounded-full opacity-50"></div>
        </div>
      </section>

      <!-- Stats Bar Section -->
      <section class="max-w-5xl mx-auto w-full glass-panel p-8 rounded-xl relative shadow-xl border border-white/50 -mt-8 reveal reveal-fade-up">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200/50">
          <div class="p-2 transition-transform duration-300 hover:scale-105">
            <div class="text-4xl md:text-5xl font-black text-[#2b83ff] mb-2 tracking-tight">1,000+</div>
            <div class="text-sm font-semibold text-[#5d5f5f]">Trung tâm tin dùng</div>
          </div>
          <div class="p-2 pt-6 md:pt-2 transition-transform duration-300 hover:scale-105">
            <div class="text-4xl md:text-5xl font-black text-[#2b83ff] mb-2 tracking-tight">500,000+</div>
            <div class="text-sm font-semibold text-[#5d5f5f]">Học viên đang học</div>
          </div>
          <div class="p-2 pt-6 md:pt-2 transition-transform duration-300 hover:scale-105">
            <div class="text-4xl md:text-5xl font-black text-[#2b83ff] mb-2 tracking-tight">98%</div>
            <div class="text-sm font-semibold text-[#5d5f5f]">Tỷ lệ hài lòng</div>
          </div>
        </div>
      </section>
      
      <!-- Features Section -->
      <section id="features" class="space-y-24 z-10 relative mt-8">
        <div class="space-y-12 reveal reveal-fade-up">
          <div class="text-center max-w-2xl mx-auto space-y-3">
            <span class="text-[#2b83ff] font-semibold text-sm tracking-wider uppercase bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">Tính năng cốt lõi</span>
            <h2 class="text-3xl md:text-4xl font-extrabold text-[#000613] tracking-tight">Giải pháp quản lý đào tạo toàn diện</h2>
            <p class="text-base text-[#5d5f5f]">Mọi công cụ cần thiết giúp tối ưu quy trình giảng dạy và nâng tầm trải nghiệm học vụ</p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <!-- Card 1 -->
            <div @click="open3DModal('course')" class="glass-panel p-8 rounded-xl flex flex-col gap-4 group hover:border-[#2b83ff]/30 hover:shadow-2xl hover:shadow-blue-500/[0.04] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden cursor-pointer" title="Xem mô phỏng 3D">
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#2b83ff]/5 to-transparent rounded-bl-3xl pointer-events-none"></div>
              <div class="w-12 h-12 rounded-xl bg-blue-50 text-[#2b83ff] border border-blue-100 flex items-center justify-center group-hover:bg-[#2b83ff] group-hover:text-white group-hover:scale-110 group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all duration-300">
                <span class="material-symbols-outlined text-2xl">menu_book</span>
              </div>
              <h3 class="text-xl font-bold text-[#000613] mt-2 group-hover:text-[#2b83ff] transition-colors duration-300">Quản lý Khóa học</h3>
              <p class="text-sm text-[#5d5f5f] leading-relaxed">Lên lịch lớp, sắp xếp thời khóa biểu và phân công giảng viên tối ưu hiệu suất.</p>
              <div class="mt-auto text-xs font-bold text-[#2b83ff] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Khám phá 3D</span>
                <span class="material-symbols-outlined text-[14px]">chevron_right</span>
              </div>
            </div>
            <!-- Card 2 -->
            <div @click="open3DModal('student')" class="glass-panel p-8 rounded-xl flex flex-col gap-4 group hover:border-[#2e7d32]/30 hover:shadow-2xl hover:shadow-emerald-500/[0.04] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden cursor-pointer" title="Xem mô phỏng 3D">
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-3xl pointer-events-none"></div>
              <div class="w-12 h-12 rounded-xl bg-emerald-50 text-[#2e7d32] border border-emerald-100 flex items-center justify-center group-hover:bg-[#2e7d32] group-hover:text-white group-hover:scale-110 group-hover:shadow-md group-hover:shadow-emerald-500/20 transition-all duration-300">
                <span class="material-symbols-outlined text-2xl">groups</span>
              </div>
              <h3 class="text-xl font-bold text-[#000613] mt-2 group-hover:text-[#2e7d32] transition-colors duration-300">Hồ sơ Học viên</h3>
              <p class="text-sm text-[#5d5f5f] leading-relaxed">Điểm danh thông minh, theo dõi kết quả chuyên cần và quản lý bảng điểm chi tiết.</p>
              <div class="mt-auto text-xs font-bold text-[#2e7d32] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Khám phá 3D</span>
                <span class="material-symbols-outlined text-[14px]">chevron_right</span>
              </div>
            </div>
            <!-- Card 3 -->
            <div @click="open3DModal('finance')" class="glass-panel p-8 rounded-xl flex flex-col gap-4 group hover:border-[#f57f17]/30 hover:shadow-2xl hover:shadow-amber-500/[0.04] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden cursor-pointer" title="Xem mô phỏng 3D">
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-3xl pointer-events-none"></div>
              <div class="w-12 h-12 rounded-xl bg-amber-50 text-[#f57f17] border border-amber-100 flex items-center justify-center group-hover:bg-[#f57f17] group-hover:text-white group-hover:scale-110 group-hover:shadow-md group-hover:shadow-amber-500/20 transition-all duration-300">
                <span class="material-symbols-outlined text-2xl">payments</span>
              </div>
              <h3 class="text-xl font-bold text-[#000613] mt-2 group-hover:text-[#f57f17] transition-colors duration-300">Học phí & Doanh thu</h3>
              <p class="text-sm text-[#5d5f5f] leading-relaxed">Theo dõi công nợ học phí, xuất hóa đơn điện tử và đối soát thanh toán tự động.</p>
              <div class="mt-auto text-xs font-bold text-[#f57f17] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Khám phá 3D</span>
                <span class="material-symbols-outlined text-[14px]">chevron_right</span>
              </div>
            </div>
            <!-- Card 4 -->
            <div @click="open3DModal('portal')" class="glass-panel p-8 rounded-xl flex flex-col gap-4 group hover:border-sky-500/30 hover:shadow-2xl hover:shadow-sky-500/[0.04] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden cursor-pointer" title="Xem mô phỏng 3D">
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-sky-500/5 to-transparent rounded-bl-3xl pointer-events-none"></div>
              <div class="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-sky-500/20 transition-all duration-300">
                <span class="material-symbols-outlined text-2xl">smartphone</span>
              </div>
              <h3 class="text-xl font-bold text-[#000613] mt-2 group-hover:text-sky-600 transition-colors duration-300">Cổng học tập học viên</h3>
              <p class="text-sm text-[#5d5f5f] leading-relaxed">Giao diện riêng giúp học viên chủ động thanh toán, tra cứu lịch học và bảng điểm.</p>
              <div class="mt-auto text-xs font-bold text-sky-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Khám phá 3D</span>
                <span class="material-symbols-outlined text-[14px]">chevron_right</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Part A.5: Interactive App Tour Simulation -->
        <div id="tour" class="space-y-12 border-t border-slate-200/60 pt-16 reveal reveal-fade-up">
          <div class="text-center max-w-2xl mx-auto space-y-3">
            <span class="text-indigo-600 font-semibold text-sm tracking-wider uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Trải nghiệm tương tác</span>
            <h2 class="text-3xl md:text-4xl font-extrabold text-[#000613] tracking-tight">Khám phá hoạt động của hệ thống</h2>
            <p class="text-base text-[#5d5f5f]">Xem trước cách EduManager Pro tự động hóa vận hành đào tạo trong nháy mắt</p>
          </div>

          <div class="flex flex-col lg:flex-row gap-8 items-stretch mt-8">
            <!-- Left side: Tour Navigation Steps -->
            <div class="flex-grow lg:w-[420px] shrink-0 flex flex-col gap-4 justify-center">
              <div 
                v-for="(step, index) in tourSteps" 
                :key="index"
                @click="selectTourStep(index)"
                :class="[
                  'p-5 rounded-xl border cursor-pointer transition-all duration-300 flex items-start gap-4 relative overflow-hidden group',
                  activeTourStep === index 
                    ? 'bg-white border-[#2b83ff] shadow-lg shadow-blue-500/[0.04]' 
                    : 'bg-white/40 border-slate-200/80 hover:bg-white hover:border-slate-300'
                ]"
              >
                <!-- Filling progress bar for active tab autoplay -->
                <div 
                  v-if="activeTourStep === index" 
                  class="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-[#001f3f] to-[#2b83ff] transition-all duration-[50ms] ease-linear"
                  :style="{ width: stepProgress + '%' }"
                ></div>

                <div 
                  :class="[
                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300',
                    activeTourStep === index 
                      ? 'bg-[#2b83ff] text-white shadow-md shadow-blue-500/20' 
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'
                  ]"
                >
                  <span class="material-symbols-outlined text-[20px]">{{ step.icon }}</span>
                </div>
                
                <div class="space-y-1">
                  <h4 
                    :class="[
                      'font-bold text-sm tracking-tight transition-colors duration-300',
                      activeTourStep === index ? 'text-[#2b83ff]' : 'text-[#000613]'
                    ]"
                  >
                    {{ step.title }}
                  </h4>
                  <p class="text-xs text-[#5d5f5f] leading-relaxed">{{ step.description }}</p>
                </div>
              </div>
            </div>

            <!-- Right side: Live Simulator Browser Window -->
            <div class="flex-grow min-h-[380px] lg:min-h-0 glass-panel border border-white/50 rounded-xl shadow-2xl overflow-hidden flex flex-col relative">
              <!-- Browser Header -->
              <div class="bg-slate-100/80 border-b border-slate-200/50 px-4 py-3 flex items-center gap-3">
                <!-- Three dots -->
                <div class="flex gap-1.5 shrink-0">
                  <span class="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]/80"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-[#f57f17]/80"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-[#2e7d32]/80"></span>
                </div>
                <!-- Address bar -->
                <div class="bg-white/90 border border-slate-200/60 rounded px-3 py-1 text-[10px] text-slate-500 font-mono flex items-center gap-1.5 w-full max-w-sm mx-auto select-none shadow-inner">
                  <span class="material-symbols-outlined text-[10px] text-emerald-600">lock</span>
                  <span>admin.edumanagerpro.com/dashboard/{{ tourSteps[activeTourStep].path }}</span>
                </div>
              </div>

              <!-- Browser Web Content Screen -->
              <div class="flex-grow p-6 text-[#191c1d] font-sans relative overflow-hidden bg-white/50 backdrop-blur-md flex flex-col justify-center select-none min-h-[280px]">
                <!-- Simulated view loader backdrop -->
                <transition name="tab-fade" mode="out-in">
                  <!-- Step 0: Training Scheduler -->
                  <div v-if="activeTourStep === 0" key="step0" class="flex-grow flex flex-col gap-4 justify-between h-full">
                    <div class="flex justify-between items-center">
                      <div class="text-xs font-bold text-[#000613]">Lớp học tuyển sinh</div>
                      <span class="text-[9px] bg-blue-50 border border-blue-100 text-[#2b83ff] px-2 py-0.5 rounded-full font-bold">Lịch thông minh</span>
                    </div>

                    <!-- Mock Table -->
                    <div class="bg-white border border-slate-200/50 rounded-xl overflow-hidden text-xs shadow-sm">
                      <div class="grid grid-cols-3 bg-slate-50/50 px-3 py-2 text-[10px] font-bold text-slate-500">
                        <div>Lớp học</div>
                        <div>Giáo viên</div>
                        <div>Trạng thái</div>
                      </div>
                      <div class="divide-y divide-slate-100">
                        <div class="grid grid-cols-3 px-3 py-2.5 items-center">
                          <div class="font-bold text-[#001f3f]">WEB-FULLSTACK</div>
                          <div class="text-[#5d5f5f]">Trần Văn A</div>
                          <div>
                            <span class="text-[9px] bg-emerald-50 text-[#2e7d32] px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1 w-fit">
                              <span class="w-1.5 h-1.5 rounded-full bg-[#2e7d32] animate-pulse"></span> Hoạt động
                            </span>
                          </div>
                        </div>
                        <div class="grid grid-cols-3 px-3 py-2.5 items-center">
                          <div class="font-bold text-[#001f3f]">MOBILE-DEV</div>
                          <div class="text-[#5d5f5f]">Lê Hoàng B</div>
                          <div>
                            <span class="text-[9px] bg-amber-50 text-[#f57f17] px-2 py-0.5 rounded-full border border-amber-100 w-fit font-bold">Tuyển sinh</span>
                          </div>
                        </div>
                        <!-- New row scheduled by micro-animation -->
                        <div 
                          :class="[
                            'grid grid-cols-3 px-3 py-2.5 items-center transition-all duration-[750ms]',
                            simData.schedulerRowVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                          ]"
                        >
                          <div class="font-bold text-[#2b83ff]">REACT-NATIVE</div>
                          <div class="text-[#5d5f5f]">Phạm Văn C</div>
                          <div>
                            <span class="text-[9px] bg-blue-50 text-[#2b83ff] px-2 py-0.5 rounded-full border border-blue-100 w-fit font-bold">Đã xếp phòng</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Simulator Console Log Info -->
                    <div class="bg-[#e3f2fd]/80 border border-[#bbdefb] p-3 rounded-lg flex items-start gap-2 text-[10px] text-[#1565c0] leading-relaxed shadow-sm">
                      <span class="material-symbols-outlined text-[14px] text-[#2b83ff] shrink-0">info</span>
                      <span>Hệ thống vừa tự động xếp phòng **P-302** cho lớp React Native vào thứ 3, 5, 7. Tránh hoàn toàn trùng lịch dạy của giảng viên Phạm Văn C.</span>
                    </div>
                  </div>

                  <!-- Step 1: Attendance Check -->
                  <div v-else-if="activeTourStep === 1" key="step1" class="flex-grow flex flex-col gap-4 justify-between h-full">
                    <div class="flex justify-between items-center">
                      <div class="text-xs font-bold text-[#000613]">Điểm danh lớp WEB-FULLSTACK</div>
                      <div class="text-[9px] text-[#5d5f5f]">Sĩ số: 3/3</div>
                    </div>

                    <!-- Attendance checklist -->
                    <div class="bg-white border border-slate-200/50 rounded-xl divide-y divide-slate-100 text-xs shadow-sm">
                      <div class="flex justify-between items-center px-4 py-2.5">
                        <div class="flex items-center gap-2">
                          <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-[#001f3f] to-[#2b83ff] text-white flex items-center justify-center text-[10px] font-bold">TH</div>
                          <div class="font-bold text-[#001f3f]">Nguyễn Thu Hà</div>
                        </div>
                        <span class="material-symbols-outlined text-[#2e7d32] text-lg">check_circle</span>
                      </div>
                      <div class="flex justify-between items-center px-4 py-2.5">
                        <div class="flex items-center gap-2">
                          <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-[#001f3f] to-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">MA</div>
                          <div class="font-bold text-[#001f3f]">Lê Minh Anh</div>
                        </div>
                        <span class="material-symbols-outlined text-[#2e7d32] text-lg">check_circle</span>
                      </div>
                      <div class="flex justify-between items-center px-4 py-2.5">
                        <div class="flex items-center gap-2">
                          <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-600 to-sky-400 text-white flex items-center justify-center text-[10px] font-bold">PB</div>
                          <div class="font-bold text-[#001f3f]">Phạm Quốc Bảo</div>
                        </div>
                        <!-- State changes with check animation -->
                        <span 
                          :class="[
                            'material-symbols-outlined text-lg transition-all duration-300',
                            simData.attendanceChecked ? 'text-[#2e7d32] scale-110' : 'text-slate-300 scale-95'
                          ]"
                        >
                          {{ simData.attendanceChecked ? 'check_circle' : 'radio_button_unchecked' }}
                        </span>
                      </div>
                    </div>

                    <!-- Statistic summary card -->
                    <div class="grid grid-cols-2 gap-3">
                      <div class="bg-white border border-slate-200/50 p-3 rounded-xl shadow-sm">
                        <div class="text-[9px] text-[#5d5f5f] uppercase tracking-wider font-bold">Tỉ lệ chuyên cần</div>
                        <div class="text-lg font-black text-[#001f3f] mt-0.5 transition-all duration-500">
                          {{ simData.attendanceChecked ? '96%' : '92%' }}
                        </div>
                        <div class="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div 
                            class="bg-[#2e7d32] h-full transition-all duration-500" 
                            :style="{ width: simData.attendanceChecked ? '96%' : '92%' }"
                          ></div>
                        </div>
                      </div>
                      <div class="bg-[#e8f5e9]/80 border border-[#c8e6c9] p-3 rounded-xl flex items-center justify-center text-center shadow-sm">
                        <div class="text-[9px] text-[#2e7d32] leading-tight font-medium">Báo cáo học vụ tự động đồng bộ qua Telegram phụ huynh</div>
                      </div>
                    </div>
                  </div>

                  <!-- Step 2: VietQR Pay Invoice -->
                  <div v-else-if="activeTourStep === 2" key="step2" class="flex-grow flex flex-col justify-between h-full">
                    <div class="flex justify-between items-center">
                      <div class="text-xs font-bold text-[#000613]">Hóa đơn thanh toán học phí</div>
                      <span 
                        :class="[
                          'text-[9px] px-2 py-0.5 rounded-full font-bold border transition-colors duration-300',
                          simData.paymentPaid 
                            ? 'bg-emerald-50 text-[#2e7d32] border-emerald-250' 
                            : 'bg-amber-50 text-[#f57f17] border-amber-250'
                        ]"
                      >
                        {{ simData.paymentPaid ? 'Đã thanh toán' : 'Chờ giao dịch' }}
                      </span>
                    </div>

                    <div class="flex items-center gap-6 bg-white border border-slate-200/50 p-4 rounded-xl relative overflow-hidden my-2 shadow-sm">
                      <!-- Mock QR Code -->
                      <div class="w-20 h-20 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center relative shadow-sm border border-slate-100">
                        <!-- Simulated QR Grid -->
                        <div class="w-full h-full bg-[#000613] flex flex-wrap p-0.5 gap-0.5 rounded overflow-hidden opacity-90">
                          <div v-for="n in 36" :key="n" :class="['w-2.5 h-2.5 rounded-[2px]', (n % 3 === 0 || n % 5 === 0) ? 'bg-white' : 'bg-transparent']"></div>
                        </div>
                        <!-- VietQR icon center -->
                        <div class="absolute inset-0 m-auto w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-[7px] text-white font-bold tracking-tight">QR</div>
                        
                        <!-- Paid glow screen overlay -->
                        <div 
                          :class="[
                            'absolute inset-0 bg-[#2e7d32]/90 rounded-lg flex items-center justify-center transition-all duration-500',
                            simData.paymentPaid ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
                          ]"
                        >
                          <span class="material-symbols-outlined text-white text-3xl animate-bounce">check</span>
                        </div>
                      </div>

                      <div class="space-y-1 text-xs">
                        <div class="text-[#5d5f5f]">Học viên: <span class="text-[#001f3f] font-bold">Nguyễn Thu Hà</span></div>
                        <div class="text-[#5d5f5f]">Khóa học: <span class="text-[#001f3f]">Web Fullstack</span></div>
                        <div class="text-[14px] font-black text-[#2b83ff] mt-1">3.500.000đ</div>
                        <div class="text-[9px] text-slate-400 leading-tight">Giao dịch tự động VietQR SePay API</div>
                      </div>
                    </div>

                    <!-- Payment status logger -->
                    <div 
                      :class="[
                        'p-2.5 rounded-lg text-center text-[10px] font-semibold border flex items-center justify-center gap-1.5 transition-all duration-500',
                        simData.paymentPaid 
                          ? 'bg-emerald-50 border-emerald-200 text-[#2e7d32]' 
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      ]"
                    >
                      <span class="material-symbols-outlined text-[13px]" :class="{'animate-spin': !simData.paymentPaid}">
                        {{ simData.paymentPaid ? 'check_circle' : 'sync' }}
                      </span>
                      <span>
                        {{ simData.paymentPaid ? 'Nhận thành công 3.500.000đ - Kích hoạt khóa học!' : 'Đang chờ VietQR chuyển khoản ngân hàng...' }}
                      </span>
                    </div>
                  </div>

                  <!-- Step 3: Student Portal -->
                  <div v-else-if="activeTourStep === 3" key="step3" class="flex-grow flex flex-col justify-between h-full">
                    <div class="flex justify-between items-center">
                      <div class="text-xs font-bold text-[#000613]">Cổng thông tin học viên (Mobile View)</div>
                      <span class="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold">Trải nghiệm học viên</span>
                    </div>

                    <!-- Mobile responsive inner frame simulation -->
                    <div class="bg-white border border-slate-200/50 rounded-xl p-3 space-y-3 relative overflow-hidden flex-grow my-2 shadow-inner">
                      <!-- Welcome user -->
                      <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-[#2b83ff] text-[11px] font-bold flex items-center justify-center text-white">N</div>
                        <div>
                          <div class="text-[10px] text-slate-400 leading-none">Xin chào học viên</div>
                          <div class="text-xs font-black text-[#001f3f] mt-0.5">Nguyễn Thu Hà</div>
                        </div>
                      </div>

                      <!-- Sub tabs view -->
                      <div class="grid grid-cols-2 gap-2 text-[10px]">
                        <div class="bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex flex-col justify-between shadow-sm">
                          <span class="text-slate-400">Thời khóa biểu</span>
                          <span class="font-bold text-[#001f3f] mt-1 flex items-center gap-1">
                            <span class="w-1.5 h-1.5 rounded-full bg-[#2b83ff]"></span> 18:30 Hôm nay
                          </span>
                        </div>
                        <div 
                          :class="[
                            'p-2.5 rounded-lg border flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-sm',
                            simData.portalCardExpanded 
                              ? 'bg-blue-50/50 border-[#2b83ff]/30' 
                              : 'bg-white border-slate-200'
                          ]"
                        >
                          <span class="text-[#5d5f5f]">Bảng điểm thi</span>
                          <span class="font-bold text-[#001f3f] mt-1 flex items-center justify-between">
                            <span>8.5 (Giỏi)</span>
                            <span class="material-symbols-outlined text-[10px] text-[#2b83ff]">open_in_new</span>
                          </span>
                        </div>
                      </div>

                      <!-- Expandable grades content overlay simulated -->
                      <div 
                        :class="[
                          'bg-white border border-slate-200 p-2.5 rounded-lg text-[9px] space-y-1 transition-all duration-500 absolute bottom-3 left-3 right-3 shadow-md',
                          simData.portalCardExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                        ]"
                      >
                        <div class="font-bold text-[#001f3f] border-b border-slate-100 pb-1 flex justify-between">
                          <span>Chi tiết điểm thi kì I</span>
                          <span class="text-[#2b83ff] font-black">Môn Web</span>
                        </div>
                        <div class="flex justify-between text-slate-500 mt-1"><span>Lý thuyết:</span> <span class="font-bold text-[#001f3f]">9.0/10</span></div>
                        <div class="flex justify-between text-slate-500"><span>Thực hành:</span> <span class="font-bold text-[#001f3f]">8.0/10</span></div>
                      </div>
                    </div>

                    <div class="text-[9px] text-[#5d5f5f] text-center font-mono select-none">
                      Học sinh chủ động nộp học phí, theo dõi chuyên cần và điểm thi 100% online.
                    </div>
                  </div>
                </transition>

                <!-- Virtual Cursor Floating Simulator -->
                <div 
                  class="absolute w-5 h-5 pointer-events-none z-50 transition-all duration-500 bg-transparent flex items-center justify-center"
                  :style="{ 
                    left: cursorSim.x + '%', 
                    top: cursorSim.y + '%', 
                    transform: cursorSim.clicking ? 'scale(0.85)' : 'scale(1)',
                    opacity: cursorSim.visible ? 1 : 0
                  }"
                >
                  <!-- SVG Cursor design -->
                  <svg class="w-4 h-4 fill-slate-900 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" viewBox="0 0 24 24">
                    <path d="M4 0l16 12.27-7.9 1.58L16 22l-3 1.34-4.03-8.28L4 18.23z"/>
                  </svg>
                  
                  <!-- Click pulse shockwave ring -->
                  <div 
                    v-if="cursorSim.clicking" 
                    class="absolute w-6 h-6 border-2 border-[#2b83ff] rounded-full animate-ping-once pointer-events-none"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Part B: Benefits -->
        <div class="space-y-12 border-t border-slate-200/60 pt-16 reveal reveal-fade-up">
          <div class="text-center max-w-2xl mx-auto space-y-3">
            <span class="text-[#2e7d32] font-semibold text-sm tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Lợi ích thực tế</span>
            <h2 class="text-3xl md:text-4xl font-extrabold text-[#000613] tracking-tight">Tại sau lựa chọn EduManager Pro?</h2>
            <p class="text-base text-[#5d5f5f]">Giải pháp toàn diện tối ưu hóa hiệu quả cho cả giảng viên và học viên</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <!-- Benefit 1 -->
            <div class="flex gap-5 items-start p-6 bg-white/60 rounded-xl border border-white/40 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all duration-300 relative group overflow-hidden">
              <div class="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-500/[0.02] rounded-full blur-2xl group-hover:bg-emerald-500/[0.05] transition-colors duration-300"></div>
              <div class="w-12 h-12 rounded-xl bg-emerald-50 text-[#2e7d32] border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span class="material-symbols-outlined text-2xl font-bold">trending_up</span>
              </div>
              <div class="space-y-2 relative z-10">
                <h4 class="text-lg font-bold text-[#000613] group-hover:text-[#2e7d32] transition-colors duration-300">Tiết kiệm 80% thời gian vận hành</h4>
                <p class="text-sm text-[#5d5f5f] leading-relaxed">Tự động hóa hoàn toàn các tác vụ lặp đi lặp lại như xếp lớp, điểm danh trực tuyến, nhắc lịch học và tính toán chi phí.</p>
              </div>
            </div>

            <!-- Benefit 2 -->
            <div class="flex gap-5 items-start p-6 bg-white/60 rounded-xl border border-white/40 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all duration-300 relative group overflow-hidden">
              <div class="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-500/[0.02] rounded-full blur-2xl group-hover:bg-emerald-500/[0.05] transition-colors duration-300"></div>
              <div class="w-12 h-12 rounded-xl bg-emerald-50 text-[#2e7d32] border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span class="material-symbols-outlined text-2xl font-bold">verified_user</span>
              </div>
              <div class="space-y-2 relative z-10">
                <h4 class="text-lg font-bold text-[#000613] group-hover:text-[#2e7d32] transition-colors duration-300">Chính xác và Minh bạch tài chính</h4>
                <p class="text-sm text-[#5d5f5f] leading-relaxed">Kết nối cổng thanh toán trực tuyến và đối soát học phí qua SePay VietQR thông minh giúp giảm thiểu sai lệch tối đa.</p>
              </div>
            </div>

            <!-- Benefit 3 -->
            <div class="flex gap-5 items-start p-6 bg-white/60 rounded-xl border border-white/40 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all duration-300 relative group overflow-hidden">
              <div class="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-500/[0.02] rounded-full blur-2xl group-hover:bg-emerald-500/[0.05] transition-colors duration-300"></div>
              <div class="w-12 h-12 rounded-xl bg-emerald-50 text-[#2e7d32] border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span class="material-symbols-outlined text-2xl font-bold">devices</span>
              </div>
              <div class="space-y-2 relative z-10">
                <h4 class="text-lg font-bold text-[#000613] group-hover:text-[#2e7d32] transition-colors duration-300">Nâng cao chất lượng kết nối học vụ</h4>
                <p class="text-sm text-[#5d5f5f] leading-relaxed">Cung cấp cổng thông tin chuyên nghiệp cho cả học viên và giảng viên trao đổi bài tập, cập nhật điểm và phản hồi liên tục.</p>
              </div>
            </div>

            <!-- Benefit 4 -->
            <div class="flex gap-5 items-start p-6 bg-white/60 rounded-xl border border-white/40 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all duration-300 relative group overflow-hidden">
              <div class="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-500/[0.02] rounded-full blur-2xl group-hover:bg-emerald-500/[0.05] transition-colors duration-300"></div>
              <div class="w-12 h-12 rounded-xl bg-emerald-50 text-[#2e7d32] border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span class="material-symbols-outlined text-2xl font-bold">query_stats</span>
              </div>
              <div class="space-y-2 relative z-10">
                <h4 class="text-lg font-bold text-[#000613] group-hover:text-[#2e7d32] transition-colors duration-300">Báo cáo trực quan & Đưa quyết định nhanh chóng</h4>
                <p class="text-sm text-[#5d5f5f] leading-relaxed">Biểu đồ động tổng quát doanh thu, công nợ và số lượng học viên thực tế theo thời gian thực giúp tối ưu hóa định hướng giáo dục.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pricing Section -->
        <div id="pricing" class="space-y-12 border-t border-slate-200/60 pt-16 reveal reveal-fade-up">
          <div class="text-center max-w-2xl mx-auto space-y-3">
            <span class="text-[#2b83ff] font-semibold text-sm tracking-wider uppercase bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">Bảng giá dịch vụ</span>
            <h2 class="text-3xl md:text-4xl font-extrabold text-[#000613] tracking-tight">Chọn gói phù hợp với trung tâm</h2>
            <p class="text-base text-[#5d5f5f]">Bắt đầu dùng thử miễn phí trong 14 ngày, không yêu cầu thẻ tín dụng.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch mt-8">
            <!-- Tier 1: Basic -->
            <div class="glass-panel p-8 rounded-xl flex flex-col justify-between border border-white/50 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-bold text-[#5d5f5f] mb-1">Cơ bản</h3>
                  <div class="text-3xl font-black text-[#000613] tracking-tight">Miễn phí<span class="text-xs font-normal text-[#5d5f5f]"> / 14 ngày</span></div>
                </div>
                <div class="w-full h-px bg-slate-200/50"></div>
                <ul class="space-y-3 text-xs text-[#42474d]">
                  <li class="flex items-center gap-2 font-semibold"><span class="material-symbols-outlined text-[#2e7d32] text-[18px]">check</span>Tối đa 50 học viên</li>
                  <li class="flex items-center gap-2 font-semibold"><span class="material-symbols-outlined text-[#2e7d32] text-[18px]">check</span>Quản lý lớp học cơ bản</li>
                  <li class="flex items-center gap-2 font-semibold"><span class="material-symbols-outlined text-[#2e7d32] text-[18px]">check</span>Hỗ trợ qua Email</li>
                </ul>
              </div>
              <router-link to="/login" class="mt-8 w-full py-3 text-center bg-white border border-slate-300 text-[#001f3f] font-bold rounded-lg hover:bg-slate-50 transition-colors text-xs">
                Dùng thử ngay
              </router-link>
            </div>

            <!-- Tier 2: Professional -->
            <div class="glass-panel p-8 rounded-xl flex flex-col justify-between border-2 border-[#2b83ff] shadow-2xl relative transform md:-translate-y-4 transition-all duration-300 hover:-translate-y-5">
              <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2b83ff] text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">PHỔ BIẾN NHẤT</div>
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-bold text-[#2b83ff] mb-1">Chuyên nghiệp</h3>
                  <div class="text-3xl font-black text-[#000613] tracking-tight">999k<span class="text-xs font-normal text-[#5d5f5f]"> / tháng</span></div>
                </div>
                <div class="w-full h-px bg-slate-250"></div>
                <ul class="space-y-3 text-xs text-[#42474d]">
                  <li class="flex items-center gap-2 font-semibold"><span class="material-symbols-outlined text-[#2e7d32] text-[18px]">check</span>Không giới hạn học viên</li>
                  <li class="flex items-center gap-2 font-semibold"><span class="material-symbols-outlined text-[#2e7d32] text-[18px]">check</span>Báo cáo tài chính chi tiết</li>
                  <li class="flex items-center gap-2 font-semibold"><span class="material-symbols-outlined text-[#2e7d32] text-[18px]">check</span>Cổng thông tin phụ huynh/học sinh</li>
                  <li class="flex items-center gap-2 font-semibold"><span class="material-symbols-outlined text-[#2e7d32] text-[18px]">check</span>Hỗ trợ ưu tiên 24/7</li>
                </ul>
              </div>
              <router-link to="/login" class="mt-8 w-full py-3 text-center bg-gradient-to-r from-[#001f3f] to-[#2b83ff] text-white font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all text-xs shadow-md shadow-blue-500/10">
                Chọn gói này
              </router-link>
            </div>

            <!-- Tier 3: Enterprise -->
            <div class="glass-panel p-8 rounded-xl flex flex-col justify-between border border-white/50 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-bold text-[#5d5f5f] mb-1">Doanh nghiệp</h3>
                  <div class="text-3xl font-black text-[#000613] tracking-tight">Liên hệ</div>
                </div>
                <div class="w-full h-px bg-slate-200/50"></div>
                <ul class="space-y-3 text-xs text-[#42474d]">
                  <li class="flex items-center gap-2 font-semibold"><span class="material-symbols-outlined text-[#2e7d32] text-[18px]">check</span>Tất cả tính năng gói Pro</li>
                  <li class="flex items-center gap-2 font-semibold"><span class="material-symbols-outlined text-[#2e7d32] text-[18px]">check</span>Quản lý đa chi nhánh hệ thống</li>
                  <li class="flex items-center gap-2 font-semibold"><span class="material-symbols-outlined text-[#2e7d32] text-[18px]">check</span>Tùy chỉnh hệ thống theo yêu cầu</li>
                  <li class="flex items-center gap-2 font-semibold"><span class="material-symbols-outlined text-[#2e7d32] text-[18px]">check</span>Tài khoản quản lý riêng biệt</li>
                </ul>
              </div>
              <a href="mailto:leehieu655@gmail.com" class="mt-8 w-full py-3 text-center bg-white border border-slate-300 text-[#001f3f] font-bold rounded-lg hover:bg-slate-50 transition-colors text-xs">
                Nhận báo giá riêng
              </a>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <section class="max-w-[1400px] mx-auto py-16 reveal reveal-fade-up">
          <div class="bg-gradient-to-br from-[#001f3f] to-[#000613] text-white rounded-xl p-12 text-center relative overflow-hidden shadow-2xl">
            <!-- Decorative blurred circles for depth -->
            <div class="absolute -top-24 -left-24 w-64 h-64 bg-[#2b83ff]/30 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>
            <h2 class="text-3xl md:text-4xl font-extrabold mb-4 relative z-10 tracking-tight leading-tight">
              Sẵn sàng bắt đầu chuyển đổi số trung tâm của bạn?
            </h2>
            <p class="text-[#abcae8] max-w-2xl mx-auto mb-8 relative z-10 text-base leading-relaxed">
              Tham gia cùng hàng ngàn trung tâm giáo dục đang sử dụng EduManager Pro để tối ưu hóa quản lý và tăng trưởng doanh thu vượt trội.
            </p>
            <router-link to="/login" class="inline-block px-8 py-4 bg-white text-[#000613] hover:bg-slate-50 rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all text-sm relative z-10">
              Đăng ký dùng thử miễn phí
            </router-link>
          </div>
        </section>
      </section>
    </main>

    <!-- Footer Section -->
    <footer class="relative z-10 border-t border-slate-200/80 bg-white/80 backdrop-blur-xl mt-auto">
      <div class="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <!-- Logo & Brand Info -->
          <div class="lg:col-span-2 space-y-6">
            <router-link to="/" class="flex items-center space-x-3 group cursor-pointer w-fit">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#001f3f] to-[#2b83ff] flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform duration-300">
                <span class="material-symbols-outlined text-white text-[24px] font-bold">school</span>
              </div>
              <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#000613] via-[#001f3f] to-[#2b83ff] tracking-tight">
                EduManager Pro
              </span>
            </router-link>
            <p class="text-[#5d5f5f] text-sm leading-relaxed max-w-sm">
              Hệ thống quản lý đào tạo toàn diện giúp tối ưu hóa quy trình giảng dạy, nâng cao chất lượng học tập và gia tăng hiệu suất vận hành của các trung tâm giáo dục.
            </p>
            <div class="flex items-center space-x-4">
              <!-- Facebook -->
              <a :href="facebookUrl" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-[#5d5f5f] hover:text-[#2b83ff] hover:bg-blue-50 hover:border-blue-200 transition-all duration-300" aria-label="Facebook">
                <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Column 2: Solutions -->
          <div class="space-y-4">
            <h4 class="text-[#000613] font-semibold tracking-wide text-sm uppercase">Giải pháp</h4>
            <ul class="space-y-2.5 text-sm text-[#5d5f5f]">
              <li>
                <a href="#features" class="hover:text-[#2b83ff] transition-colors duration-200 block">
                  Quản lý khóa học
                </a>
              </li>
              <li>
                <a href="#features" class="hover:text-[#2b83ff] transition-colors duration-200 block">
                  Hồ sơ học viên
                </a>
              </li>
              <li>
                <a href="#features" class="hover:text-[#2b83ff] transition-colors duration-200 block">
                  Quản lý tài chính
                </a>
              </li>
              <li>
                <a href="#features" class="hover:text-[#2b83ff] transition-colors duration-200 block">
                  Cổng học tập học viên
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 3: Support & Legal -->
          <div class="space-y-4">
            <h4 class="text-[#000613] font-semibold tracking-wide text-sm uppercase">Hỗ trợ & Pháp lý</h4>
            <ul class="space-y-2.5 text-sm text-[#5d5f5f]">
              <li>
                <a href="#" class="hover:text-[#2b83ff] transition-colors duration-200 block">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-[#2b83ff] transition-colors duration-200 block">
                  Điều khoản dịch vụ
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-[#2b83ff] transition-colors duration-200 block">
                  Hướng dẫn sử dụng
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-[#2b83ff] transition-colors duration-200 block">
                  Trung tâm hỗ trợ
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 4: Contact -->
          <div class="space-y-4">
            <h4 class="text-[#000613] font-semibold tracking-wide text-sm uppercase">Liên hệ</h4>
            <ul class="space-y-3 text-sm text-[#5d5f5f]">
              <li class="flex items-start space-x-2.5">
                <span class="material-symbols-outlined text-[18px] text-[#2b83ff] mt-0.5">mail</span>
                <span>leehieu655@gmail.com</span>
              </li>
              <li class="flex items-start space-x-2.5">
                <span class="material-symbols-outlined text-[18px] text-[#2b83ff] mt-0.5">call</span>
                <span>+84 987 654 321</span>
              </li>
              <li class="flex items-start space-x-2.5">
                <span class="material-symbols-outlined text-[18px] text-[#2b83ff] mt-0.5">location_on</span>
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
          <div class="bg-white/95 backdrop-blur-[24px] border border-white/50 shadow-[0_20px_40px_rgba(0,31,63,0.15)] w-full max-w-4xl rounded-xl overflow-hidden animate-scale-in flex flex-col md:flex-row h-[90vh] md:h-[520px]">
            
            <!-- 3D Canvas Container -->
            <div class="flex-1 bg-gradient-to-br from-[#0f131b] via-[#1c2028] to-[#0a0e16] relative min-h-[300px] md:min-h-0 flex items-center justify-center overflow-hidden">
              <canvas ref="threeCanvas" class="w-full h-full block cursor-grab active:cursor-grabbing"></canvas>
              
              <!-- 3D Drag Tip Overlay -->
              <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-[10px] font-bold text-white/70 uppercase tracking-widest flex items-center gap-1.5 pointer-events-none select-none">
                <span class="material-symbols-outlined text-[13px] animate-pulse">drag_pan</span>
                Kéo chuột để xoay 3D
              </div>

              <!-- Loading scene placeholder -->
              <div v-if="loading3D" class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-900/80 transition-opacity duration-300">
                <span class="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
                <span class="text-xs text-white/50 font-bold uppercase tracking-wide">Đang khởi tạo 3D...</span>
              </div>
            </div>

            <!-- Modal Info Description Panel -->
            <div class="w-full md:w-[380px] p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-200 bg-white">
              <div class="space-y-6">
                <!-- Header Title & Tag -->
                <div class="space-y-2">
                  <span class="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border border-blue-500/20 text-[#2b83ff] bg-blue-50 inline-block">
                    Mô phỏng 3D
                  </span>
                  <h3 class="text-2xl font-black text-[#000613] tracking-tight leading-tight">
                    {{ modalInfo.title }}
                  </h3>
                </div>

                <!-- Description Text -->
                <p class="text-sm text-[#5d5f5f] leading-relaxed">
                  {{ modalInfo.description }}
                </p>

                <!-- Feature list items -->
                <div class="space-y-3 pt-2">
                  <div v-for="(feat, idx) in modalInfo.features" :key="idx" class="flex items-start gap-2.5 text-xs text-[#42474d] font-semibold">
                    <span class="material-symbols-outlined text-[16px] text-[#2b83ff] shrink-0 mt-0.5" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                    <span>{{ feat }}</span>
                  </div>
                </div>
              </div>

              <!-- Footer Buttons -->
              <div class="flex gap-3 pt-6 border-t border-slate-100">
                <router-link to="/login" class="flex-1 bg-gradient-to-r from-[#001f3f] to-[#2b83ff] text-white font-bold text-center py-3 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 transition-all text-xs flex items-center justify-center">
                  Thử nghiệm ngay
                </router-link>
                <button @click="close3DModal" class="px-5 py-3 rounded-xl border border-slate-200 text-[#5d5f5f] font-bold hover:bg-slate-50 transition-colors text-xs cursor-pointer">
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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'

const facebookUrl = import.meta.env.VITE_FACEBOOK_URL || 'https://www.facebook.com/hieu.minh.793013/'
const mobileMenuOpen = ref(false)
const scrollProgress = ref(0)

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

// 3D References & States
const active3DModal = ref(null)
const threeCanvas = ref(null)
const loading3D = ref(false)

const heroCanvas = ref(null)

// Interactive Product Tour variables & states
const activeTourStep = ref(0)
const stepProgress = ref(0)
const tourIntervalTime = 7000 // 7 seconds per slide
let tourTimer = null
let animationTickTimer = null

const tourSteps = [
  {
    title: "Xếp lịch & Đào tạo thông minh",
    description: "Tự động phân lịch giảng viên và quản lý lớp học tuyển sinh trực quan.",
    icon: "event_note",
    path: "scheduler"
  },
  {
    title: "Hồ sơ Học viên & Điểm danh",
    description: "Theo dõi sĩ số chuyên cần, cập nhật bảng điểm tự động đồng bộ hóa.",
    icon: "fact_check",
    path: "attendance"
  },
  {
    title: "Thanh toán VietQR SePay",
    description: "Quét mã QR, tự động xác thực đối soát thanh toán ngân hàng tức thì.",
    icon: "qr_code_scanner",
    path: "tuition"
  },
  {
    title: "Cổng học vụ Cá nhân hóa",
    description: "Không gian riêng để học viên kiểm tra điểm thi và thời khóa biểu di động.",
    icon: "account_box",
    path: "portal"
  }
]

// Mock data states for simulated app views
const simData = ref({
  schedulerRowVisible: false,
  attendanceChecked: false,
  paymentPaid: false,
  portalCardExpanded: false
})

// Mock cursor state
const cursorSim = ref({
  x: 20,
  y: 80,
  visible: false,
  clicking: false
})

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

// Three.js Hero Scene Variables
let heroScene, heroCamera, heroRenderer, heroAnimationFrameId, heroGroup

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
    color: 0x2b83ff,
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
    color: 0x2b83ff,
    emissive: 0x003366,
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
    color: 0x38bdf8,
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
    color: 0x000613,
    roughness: 0.4,
    metalness: 0.9
  })
  const frame = new THREE.Mesh(frameGeo, frameMat)
  group.add(frame)

  // Screen
  const screenGeo = new THREE.BoxGeometry(1.5, 3.1, 0.04)
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x2b83ff,
    emissive: 0x003366,
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
      color: 0x001f3f,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x003366,
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

// Interactive Product Tour Navigation & Autoplay
const selectTourStep = (index) => {
  activeTourStep.value = index
  resetTourAutoplay()
  runStepAnimation(index)
}

const startTourAutoplay = () => {
  if (tourTimer) clearInterval(tourTimer)
  
  const tickMs = 50
  let elapsed = 0
  
  tourTimer = setInterval(() => {
    elapsed += tickMs
    stepProgress.value = (elapsed / tourIntervalTime) * 100
    
    if (elapsed >= tourIntervalTime) {
      elapsed = 0
      stepProgress.value = 0
      activeTourStep.value = (activeTourStep.value + 1) % tourSteps.length
      runStepAnimation(activeTourStep.value)
    }
  }, tickMs)
}

const resetTourAutoplay = () => {
  stepProgress.value = 0
  if (tourTimer) {
    clearInterval(tourTimer)
    startTourAutoplay()
  }
}

const runStepAnimation = (stepIndex) => {
  if (animationTickTimer) clearTimeout(animationTickTimer)
  
  // Reset states
  simData.value.schedulerRowVisible = false
  simData.value.attendanceChecked = false
  simData.value.paymentPaid = false
  simData.value.portalCardExpanded = false
  
  cursorSim.value.visible = true
  cursorSim.value.clicking = false

  if (stepIndex === 0) {
    cursorSim.value.x = 20
    cursorSim.value.y = 85
    animationTickTimer = setTimeout(() => {
      cursorSim.value.x = 80
      cursorSim.value.y = 35
      animationTickTimer = setTimeout(() => {
        cursorSim.value.clicking = true
        animationTickTimer = setTimeout(() => {
          cursorSim.value.clicking = false
          simData.value.schedulerRowVisible = true
          animationTickTimer = setTimeout(() => {
            cursorSim.value.visible = false
          }, 1000)
        }, 300)
      }, 1200)
    }, 500)

  } else if (stepIndex === 1) {
    cursorSim.value.x = 10
    cursorSim.value.y = 80
    animationTickTimer = setTimeout(() => {
      cursorSim.value.x = 90
      cursorSim.value.y = 52
      animationTickTimer = setTimeout(() => {
        cursorSim.value.clicking = true
        animationTickTimer = setTimeout(() => {
          cursorSim.value.clicking = false
          simData.value.attendanceChecked = true
          animationTickTimer = setTimeout(() => {
            cursorSim.value.visible = false
          }, 1000)
        }, 300)
      }, 1200)
    }, 500)

  } else if (stepIndex === 2) {
    cursorSim.value.x = 10
    cursorSim.value.y = 80
    animationTickTimer = setTimeout(() => {
      cursorSim.value.x = 30
      cursorSim.value.y = 50
      animationTickTimer = setTimeout(() => {
        cursorSim.value.clicking = true
        animationTickTimer = setTimeout(() => {
          cursorSim.value.clicking = false
          animationTickTimer = setTimeout(() => {
            simData.value.paymentPaid = true
            animationTickTimer = setTimeout(() => {
              cursorSim.value.visible = false
            }, 1000)
          }, 1500)
        }, 300)
      }, 1000)
    }, 500)

  } else if (stepIndex === 3) {
    cursorSim.value.x = 90
    cursorSim.value.y = 85
    animationTickTimer = setTimeout(() => {
      cursorSim.value.x = 75
      cursorSim.value.y = 52
      animationTickTimer = setTimeout(() => {
        cursorSim.value.clicking = true
        animationTickTimer = setTimeout(() => {
          cursorSim.value.clicking = false
          simData.value.portalCardExpanded = true
          animationTickTimer = setTimeout(() => {
            cursorSim.value.visible = false
          }, 1000)
        }, 300)
      }, 1200)
    }, 500)
  }
}

// Procedural Dashboard Canvas for the 3D device screen
const createDashboardCanvas = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 340
  const ctx = canvas.getContext('2d')
  
  // Background
  ctx.fillStyle = '#0f131b'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Header
  ctx.fillStyle = '#1c2028'
  ctx.fillRect(0, 0, canvas.width, 50)
  
  ctx.fillStyle = '#2b83ff'
  ctx.font = 'bold 20px sans-serif'
  ctx.fillText('EduManager Pro', 20, 32)
  
  // Decorative grid lines
  ctx.strokeStyle = '#262a33'
  ctx.lineWidth = 1
  for (let i = 0; i < canvas.width; i += 40) {
    ctx.beginPath()
    ctx.moveTo(i, 50)
    ctx.lineTo(i, canvas.height)
    ctx.stroke()
  }
  for (let i = 50; i < canvas.height; i += 40) {
    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(canvas.width, i)
    ctx.stroke()
  }

  // Draw a bar chart
  ctx.fillStyle = '#2b83ff'
  const data = [60, 120, 180, 140, 220, 190, 240]
  data.forEach((val, index) => {
    const x = 50 + index * 50
    const y = canvas.height - val - 40
    ctx.fillRect(x, y, 30, val)
  })
  
  // Draw a line chart (orange/amber)
  ctx.strokeStyle = '#f59e0b'
  ctx.lineWidth = 4
  ctx.beginPath()
  const points = [80, 160, 110, 200, 150, 230, 210]
  points.forEach((val, index) => {
    const x = 65 + index * 50
    const y = canvas.height - val - 40
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()
  
  // Draw some UI buttons / circles
  ctx.fillStyle = '#2e7d32'
  ctx.beginPath()
  ctx.arc(430, 100, 30, 0, Math.PI * 2)
  ctx.fill()
  
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 12px sans-serif'
  ctx.fillText('ACTIVE', 410, 104)

  ctx.fillStyle = '#bdcabf'
  ctx.font = '12px sans-serif'
  ctx.fillText('Revenue Growth: +24%', 20, 90)
  ctx.fillText('Active Students: 1,482', 20, 110)

  return canvas
}

const handleHeroResize = () => {
  const canvas = heroCanvas.value
  if (!canvas || !heroCamera || !heroRenderer) return
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  heroCamera.aspect = width / height
  heroCamera.updateProjectionMatrix()
  heroRenderer.setSize(width, height, false)
}

const initHeroThree = () => {
  const canvas = heroCanvas.value
  if (!canvas) return

  const width = canvas.clientWidth
  const height = canvas.clientHeight

  heroScene = new THREE.Scene()
  
  heroCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  heroCamera.position.set(0, 0.8, 6.0)

  heroRenderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  })
  heroRenderer.setSize(width, height, false)
  heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.6)
  heroScene.add(ambient)

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
  dirLight.position.set(5, 10, 5)
  heroScene.add(dirLight)

  const blueLight = new THREE.PointLight(0x2b83ff, 2, 10)
  blueLight.position.set(-3, 2, 2)
  heroScene.add(blueLight)

  const purpleLight = new THREE.PointLight(0xa855f7, 2, 10)
  purpleLight.position.set(3, -2, 2)
  heroScene.add(purpleLight)

  // Group for the laptop and its orbiting assets
  heroGroup = new THREE.Group()
  
  // Sleek Laptop Body
  const baseGeo = new THREE.BoxGeometry(3.6, 0.1, 2.4)
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x001f3f,
    metalness: 0.8,
    roughness: 0.2
  })
  const base = new THREE.Mesh(baseGeo, baseMat)
  base.position.y = -0.5
  heroGroup.add(base)

  // Screen hinge / connection
  const hingeGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.2, 16)
  const hingeMat = new THREE.MeshStandardMaterial({ color: 0x001f3f })
  const hinge = new THREE.Mesh(hingeGeo, hingeMat)
  hinge.rotation.z = Math.PI / 2
  hinge.position.set(0, -0.45, -1.1)
  heroGroup.add(hinge)

  // Screen Lid
  const lidGeo = new THREE.BoxGeometry(3.4, 2.3, 0.08)
  const lidMat = new THREE.MeshStandardMaterial({
    color: 0x000613,
    metalness: 0.8,
    roughness: 0.3
  })
  const lid = new THREE.Mesh(lidGeo, lidMat)
  lid.rotation.x = -0.15
  lid.position.set(0, 0.6, -1.0)
  heroGroup.add(lid)

  // Screen Panel showing Dashboard
  const screenGeo = new THREE.PlaneGeometry(3.2, 2.1)
  const dbCanvas = createDashboardCanvas()
  const screenTex = new THREE.CanvasTexture(dbCanvas)
  const screenMat = new THREE.MeshStandardMaterial({
    map: screenTex,
    roughness: 0.1,
    metalness: 0.1
  })
  const screen = new THREE.Mesh(screenGeo, screenMat)
  screen.rotation.x = -0.15
  screen.position.set(0, 0.6, -0.95)
  heroGroup.add(screen)

  // Orbiting Graduation Cap
  const capGroup = new THREE.Group()
  
  const capBoardGeo = new THREE.BoxGeometry(0.5, 0.02, 0.5)
  const capBoardMat = new THREE.MeshStandardMaterial({ color: 0x001f3f, roughness: 0.4 })
  const capBoard = new THREE.Mesh(capBoardGeo, capBoardMat)
  capGroup.add(capBoard)

  const capSkullGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.1, 16)
  const capSkullMat = new THREE.MeshStandardMaterial({ color: 0x000613 })
  const capSkull = new THREE.Mesh(capSkullGeo, capSkullMat)
  capSkull.position.y = -0.06
  capGroup.add(capSkull)
  
  heroGroup.add(capGroup)

  // Floating gear representing system management
  const gearGeo = new THREE.TorusGeometry(0.22, 0.06, 8, 24)
  const gearMat = new THREE.MeshStandardMaterial({ color: 0x2b83ff, metalness: 0.6, roughness: 0.3 })
  const gear = new THREE.Mesh(gearGeo, gearMat)
  gear.position.set(2.0, 1.2, 0.5)
  heroGroup.add(gear)

  // Floating gold coin representing finance
  const coinGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 24)
  const coinMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 })
  const coin = new THREE.Mesh(coinGeo, coinMat)
  coin.position.set(-2.0, -0.2, 0.8)
  coin.rotation.x = Math.PI / 3
  heroGroup.add(coin)

  heroScene.add(heroGroup)

  // Mouse tilt controller variables
  let targetRotationX = 0.15
  let targetRotationY = -0.45
  let currentRotationX = 0.15
  let currentRotationY = -0.45

  const handleMouseMove = (event) => {
    const rect = canvas.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    
    targetRotationY = x * 0.5 - 0.45
    targetRotationX = y * 0.3 + 0.15
  }

  canvas.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', handleHeroResize)

  // Render loop
  const clock = new THREE.Clock()
  const animateHero = () => {
    if (!heroRenderer) return
    heroAnimationFrameId = requestAnimationFrame(animateHero)

    const elapsed = clock.getElapsedTime()

    // Smooth easing for rotation
    currentRotationX += (targetRotationX - currentRotationX) * 0.05
    currentRotationY += (targetRotationY - currentRotationY) * 0.05

    heroGroup.rotation.x = currentRotationX
    heroGroup.rotation.y = currentRotationY

    // Animate the cap
    capGroup.position.x = Math.sin(elapsed * 1.2) * 2.2
    capGroup.position.z = Math.cos(elapsed * 1.2) * 2.2
    capGroup.position.y = 0.6 + Math.sin(elapsed * 2.0) * 0.2
    capGroup.rotation.y = elapsed * 1.5

    // Animate the gear
    gear.rotation.z = -elapsed * 0.8
    gear.position.y = 1.0 + Math.sin(elapsed * 1.5) * 0.15

    // Animate the coin
    coin.rotation.y = elapsed * 1.2
    coin.position.y = -0.2 + Math.sin(elapsed * 1.8) * 0.1

    heroRenderer.render(heroScene, heroCamera)
  }

  animateHero()
}

const cleanupHeroThree = () => {
  if (heroAnimationFrameId) {
    cancelAnimationFrame(heroAnimationFrameId)
    heroAnimationFrameId = null
  }
  window.removeEventListener('resize', handleHeroResize)
  
  if (heroScene) {
    heroScene.traverse((object) => {
      if (object.geometry) object.geometry.dispose()
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((mat) => mat.dispose())
        } else {
          object.material.dispose()
        }
      }
    })
    heroScene = null
  }
  
  if (heroRenderer) {
    heroRenderer.dispose()
    heroRenderer = null
  }
  
  heroCamera = null
  heroGroup = null
}

const handleScroll = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
}

onMounted(() => {
  initHeroThree()
  startTourAutoplay()
  runStepAnimation(0)
  window.addEventListener('scroll', handleScroll)

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

onUnmounted(() => {
  cleanupHeroThree()
  window.removeEventListener('scroll', handleScroll)
  if (tourTimer) clearInterval(tourTimer)
  if (animationTickTimer) clearTimeout(animationTickTimer)
})
</script>

<style scoped>
.landing-page-wrapper {
  background-color: #f8f9fa;
  background-image: 
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E"),
    radial-gradient(circle at 10% 10%, rgba(43, 131, 255, 0.04) 0%, transparent 50%),
    radial-gradient(circle at 90% 90%, rgba(99, 102, 241, 0.04) 0%, transparent 50%);
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
  background: radial-gradient(circle, rgba(43, 131, 255, 0.25) 0%, rgba(56, 189, 248, 0.08) 60%, transparent 100%);
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

/* Glass panel premium card hover shimmers & glow borders */
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0px 12px 24px rgba(0, 31, 63, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.4);
  position: relative;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
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
    rgba(255, 255, 255, 0.45),
    transparent
  );
  transition: all 0.7s ease-in-out;
}

.glass-panel:hover {
  border-color: rgba(43, 131, 255, 0.3);
  box-shadow: 0 15px 35px rgba(0, 31, 63, 0.06), 0 0 20px rgba(43, 131, 255, 0.05);
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
  background: radial-gradient(circle, rgba(43, 131, 255, 0.22) 0%, rgba(37, 99, 235, 0) 70%);
  top: -100px;
  right: -50px;
  animation: float-slow 18s infinite ease-in-out alternate;
}

.orb-2 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0, 31, 63, 0.12) 0%, rgba(0, 31, 63, 0) 70%);
  bottom: 10%;
  left: -150px;
  animation: float-slow 22s infinite ease-in-out alternate-reverse;
}

.orb-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0) 70%);
  top: 40%;
  right: 10%;
  animation: float-slow 15s infinite ease-in-out alternate;
}

@keyframes float-slow {
  0% {
    transform: translateY(0px) scale(1) rotate(0deg);
  }
  50% {
    transform: translateY(-40px) scale(1.08) rotate(10deg);
  }
  100% {
    transform: translateY(20px) scale(0.95) rotate(-5deg);
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

/* Product Tour transitions */
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}

.tab-fade-enter-from {
  opacity: 0;
  transform: scale(0.98) translateY(5px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: scale(0.98) translateY(-5px);
}

/* Custom CSS animation for cursor click shockwave */
@keyframes ping-once {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}

.animate-ping-once {
  animation: ping-once 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
}

.duration-750 {
  transition-duration: 750ms;
}

/* Scale in animation for Modal */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-scale-in {
  animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Modal fade animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
