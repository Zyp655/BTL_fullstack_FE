<template>
  <div class="landing-page-container min-h-screen relative overflow-x-hidden bg-background text-on-background font-body-md">
    <!-- Ambient Background Blobs -->
    <div class="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none noise-bg">
      <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-fixed opacity-30 blur-[80px] organic-blob"></div>
      <div class="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-tertiary-fixed opacity-30 blur-[60px] organic-blob animation-delay-2000"></div>
    </div>

    <!-- TopNavBar -->
    <header class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-surface-container-high/40 shadow-sm">
      <div class="flex justify-between items-center px-container-padding py-4 max-w-7xl mx-auto">
        <div class="text-headline-md font-headline-md text-primary tracking-tight">EduManager Pro</div>
        <nav class="hidden md:flex gap-8">
          <a class="text-on-surface-variant hover:text-primary transition-colors font-label-md text-[14px] font-semibold" href="#features">Tính năng</a>
          <a class="text-on-surface-variant hover:text-primary transition-colors font-label-md text-[14px] font-semibold" href="#benefits">Lợi ích</a>
          <a class="text-on-surface-variant hover:text-primary transition-colors font-label-md text-[14px] font-semibold" href="#pricing">Bảng giá</a>
        </nav>
        <div class="flex gap-4 items-center">
          <router-link to="/login" class="text-on-surface-variant hover:text-primary transition-colors font-label-md text-[14px] font-semibold hover:opacity-90 active:scale-95 duration-200">
            Đăng nhập
          </router-link>
          <router-link to="/login" class="bg-primary text-on-primary px-6 py-2 rounded-full font-label-md text-[14px] font-semibold hover:opacity-90 active:scale-95 duration-200 shadow-sm">
            Bắt đầu ngay
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="pt-[90px]">
      <!-- Hero Section -->
      <section class="px-container-padding py-section-gap max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-gutter relative">
        <div class="flex-1 flex flex-col gap-stack-md z-10 text-left">
          <h1 class="font-headline-xl text-[44px] lg:text-[56px] leading-[1.1] font-bold text-on-background tracking-tight">
            Hệ thống quản lý đào tạo toàn diện
          </h1>
          <p class="font-body-lg text-[16px] lg:text-[18px] text-on-surface-variant leading-relaxed">
            Tối ưu hóa quy trình, nâng cao trải nghiệm học viên và tăng trưởng doanh thu với giải pháp công nghệ giáo dục hàng đầu.
          </p>
          <div class="flex flex-wrap gap-4 mt-2">
            <router-link to="/login" class="bg-primary text-on-primary px-8 py-3.5 rounded-full font-label-md text-[15px] font-semibold hover:-translate-y-0.5 hover:shadow-md transition-all shadow-ambient">
              Bắt đầu ngay
            </router-link>
            <router-link to="/login" class="border-2 border-secondary-container text-primary px-8 py-3.5 rounded-full font-label-md text-[15px] font-semibold hover:bg-surface-container transition-colors hover:-translate-y-0.5 transition-all">
              Xem Demo
            </router-link>
          </div>
        </div>
        <div class="flex-1 relative w-full mt-8 lg:mt-0">
          <div class="relative w-full aspect-[4/3] rounded-card overflow-hidden shadow-ambient border-[6px] border-surface">
            <img 
              alt="EduManager Pro Dashboard" 
              class="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDl1elafLCPghijQdJABaeXlSDas7vMHFxq4QP_ojTmY829Uup4HTvQv50YbDVlnhlkO59867-CK41lSNAM0xxgVE8aaiwpIECpMOsEKT0k-JIR5A1xb2vbgWFEpK3cMwov_Gh6_nCXdRFXG7CcjQIzFgR02JkEGaQApNb9NsQGOwFYdjln5zcsD7F1O2N3mdZ96aMdjAq92KfI9P_QzcQk7RhSmtzD7RGB9-d-Tt3koE1SiTKlF7-GliHD84ea6KhZMJmmpO8O2MGi"
            />
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="px-container-padding py-section-gap max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="font-headline-lg text-[32px] font-bold text-on-background tracking-tight">Tính năng nổi bật</h2>
          <p class="font-body-md text-[16px] text-on-surface-variant mt-3">Mọi công cụ bạn cần để vận hành trung tâm hiệu quả</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          <!-- Feature Card 1 -->
          <div class="bg-surface rounded-card p-6 shadow-ambient flex flex-col gap-4 hover:-translate-y-1.5 transition-all duration-300 border border-surface-container/60 group">
            <div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-[24px]">menu_book</span>
            </div>
            <h3 class="font-headline-md text-[20px] font-bold text-on-background">Quản lý Môn học</h3>
            <p class="font-body-md text-[14px] text-on-surface-variant leading-relaxed">Lên lịch, sắp xếp giáo viên và phòng học thông minh.</p>
          </div>

          <!-- Feature Card 2 -->
          <div class="bg-surface rounded-card p-6 shadow-ambient flex flex-col gap-4 hover:-translate-y-1.5 transition-all duration-300 border border-surface-container/60 group">
            <div class="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary-container group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-[24px]">groups</span>
            </div>
            <h3 class="font-headline-md text-[20px] font-bold text-on-background">Quản lý Học viên</h3>
            <p class="font-body-md text-[14px] text-on-surface-variant leading-relaxed">Theo dõi tiến độ, điểm danh và đánh giá kết quả học tập.</p>
          </div>

          <!-- Feature Card 3 -->
          <div class="bg-surface rounded-card p-6 shadow-ambient flex flex-col gap-4 hover:-translate-y-1.5 transition-all duration-300 border border-surface-container/60 group">
            <div class="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-[24px]">request_quote</span>
            </div>
            <h3 class="font-headline-md text-[20px] font-bold text-on-background">Báo cáo Tài chính</h3>
            <p class="font-body-md text-[14px] text-on-surface-variant leading-relaxed">Kiểm soát thu chi, học phí và xuất báo cáo tự động.</p>
          </div>

          <!-- Feature Card 4 -->
          <div class="bg-surface rounded-card p-6 shadow-ambient flex flex-col gap-4 hover:-translate-y-1.5 transition-all duration-300 border border-surface-container/60 group">
            <div class="w-12 h-12 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary-container group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-[24px]">smartphone</span>
            </div>
            <h3 class="font-headline-md text-[20px] font-bold text-on-background">App Học viên</h3>
            <p class="font-body-md text-[14px] text-on-surface-variant leading-relaxed">Ứng dụng di động giúp học viên kết nối và tự quản lý.</p>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="w-full py-12 bg-surface-container text-secondary flex flex-col md:flex-row justify-between items-center px-container-padding gap-6 mt-16 border-t border-surface-container-high/40">
      <div class="text-[20px] font-bold text-primary tracking-tight">EduManager Pro</div>
      <div class="flex flex-wrap justify-center gap-6">
        <a class="text-on-secondary-container hover:text-primary transition-all duration-300 font-body-md text-[14px]" href="#">Chính sách bảo mật</a>
        <a class="text-on-secondary-container hover:text-primary transition-all duration-300 font-body-md text-[14px]" href="#">Điều khoản sử dụng</a>
        <a class="text-on-secondary-container hover:text-primary transition-all duration-300 font-body-md text-[14px]" href="#">Liên hệ</a>
        <a class="text-on-secondary-container hover:text-primary transition-all duration-300 font-body-md text-[14px]" href="#">Tuyển dụng</a>
      </div>
      <div class="font-body-md text-[14px] text-on-surface-variant">© 2026 EduManager Pro. All rights reserved.</div>
    </footer>
  </div>
</template>

<script setup>
// Landing page setup
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700&display=swap');

/* Scope variables for Organic Soft-Tech theme */
.landing-page-container {
  --primary: #13334b;
  --on-primary: #ffffff;
  --secondary: #645e4b;
  --on-secondary: #ffffff;
  --background: #fbf9f4;
  --on-background: #1b1c19;
  --surface: #fbf9f4;
  --on-surface: #1b1c19;
  --on-surface-variant: #42474d;
  --surface-container: #f0eee9;
  --surface-container-high: #eae8e3;
  --secondary-container: #ece2c9;
  --on-secondary-container: #6b6450;
  --primary-fixed: #cde5ff;
  --primary-fixed-dim: #abcae8;
  --tertiary-fixed: #ccebc7;
  --tertiary-container: #334d33;
  --primary-container: #2c4a63;
  --on-primary-container: #9bb9d7;
  
  background-color: var(--background);
  color: var(--on-background);
  font-family: 'Inter', sans-serif;
}

/* Color classes overrides */
.landing-page-container .bg-background { background-color: var(--background) !important; }
.landing-page-container .text-on-background { color: var(--on-background) !important; }
.landing-page-container .text-primary { color: var(--primary) !important; }
.landing-page-container .text-on-surface-variant { color: var(--on-surface-variant) !important; }
.landing-page-container .bg-surface\/80 { background-color: rgba(251, 249, 244, 0.8) !important; }
.landing-page-container .bg-primary { background-color: var(--primary) !important; }
.landing-page-container .text-on-primary { color: var(--on-primary) !important; }
.landing-page-container .border-secondary-container { border-color: var(--secondary-container) !important; }
.landing-page-container .hover\:bg-surface-container:hover { background-color: var(--surface-container) !important; }
.landing-page-container .bg-primary-fixed { background-color: var(--primary-fixed) !important; }
.landing-page-container .bg-tertiary-fixed { background-color: var(--tertiary-fixed) !important; }
.landing-page-container .bg-secondary-container { background-color: var(--secondary-container) !important; }
.landing-page-container .text-on-secondary-container { color: var(--on-secondary-container) !important; }
.landing-page-container .bg-primary-fixed-dim { background-color: var(--primary-fixed-dim) !important; }
.landing-page-container .bg-surface-container { background-color: var(--surface-container) !important; }
.landing-page-container .text-secondary { color: var(--secondary) !important; }
.landing-page-container .bg-surface { background-color: var(--surface) !important; }
.landing-page-container .border-surface-container { border-color: var(--surface-container) !important; }
.landing-page-container .text-headline-md { color: var(--primary) !important; font-family: 'Plus Jakarta Sans', sans-serif !important; }
.landing-page-container .font-headline-xl { font-family: 'Plus Jakarta Sans', sans-serif !important; font-weight: 700 !important; }

/* Custom Background Blobs & Animations */
.noise-bg {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
}

.organic-blob {
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  animation: morph 8s ease-in-out infinite;
}

.animation-delay-2000 {
  animation-delay: -2s;
}

@keyframes morph {
  0%, 100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
  34% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
  67% { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; }
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.shadow-ambient {
  box-shadow: 0 10px 40px -10px rgba(19, 51, 75, 0.08);
}
</style>
