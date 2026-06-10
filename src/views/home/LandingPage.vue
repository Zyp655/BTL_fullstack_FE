<template>
  <div class="landing-page-wrapper min-h-screen relative flex flex-col bg-background text-on-surface antialiased overflow-x-hidden selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
    <!-- Ambient Background Orbs -->
    <div class="ambient-orb orb-1"></div>
    <div class="ambient-orb orb-2"></div>
    
    <!-- TopNavBar Component -->
    <nav class="bg-glass-surface dark:bg-primary-container font-title-md text-title-md fixed top-0 w-full backdrop-blur-md border-b border-glass-border shadow-sm z-50">
      <div class="flex justify-between items-center px-container-padding h-20 max-w-[1400px] mx-auto">
        <div class="font-headline-lg text-headline-lg font-bold text-primary dark:text-on-primary">
          EduManager Pro
        </div>
        <!-- Desktop Nav -->
        <ul class="hidden md:flex space-x-stack-md">
          <li><a class="text-on-tertiary-container dark:text-tertiary-fixed-dim border-b-2 border-on-tertiary-container pb-1 hover:text-tertiary transition-colors duration-200 block scale-95 transition-transform" href="#platform">Platform</a></li>
          <li><a class="text-secondary dark:text-secondary-fixed-dim hover:text-tertiary transition-colors duration-200 block" href="#solutions">Solutions</a></li>
          <li><a class="text-secondary dark:text-secondary-fixed-dim hover:text-tertiary transition-colors duration-200 block" href="#resources">Resources</a></li>
          <li><a class="text-secondary dark:text-secondary-fixed-dim hover:text-tertiary transition-colors duration-200 block" href="#pricing">Pricing</a></li>
        </ul>
        <div class="hidden md:flex items-center space-x-stack-sm">
          <router-link to="/login" class="text-tertiary dark:text-tertiary-fixed font-title-md px-4 py-2 hover:opacity-80 transition-opacity font-semibold">
            Login
          </router-link>
          <router-link to="/login" class="bg-tertiary text-on-tertiary px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold">
            Get Started
          </router-link>
        </div>
        <!-- Mobile Menu Toggle (Visual only for layout) -->
        <button class="md:hidden text-primary" @click="toggleMobileMenu">
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">menu</span>
        </button>
      </div>
    </nav>
    
    <!-- Main Content Canvas -->
    <main class="flex-grow pt-28 pb-stack-lg px-container-padding max-w-[1400px] mx-auto w-full flex flex-col gap-y-[120px]">
      <!-- Hero Section -->
      <section class="flex flex-col lg:flex-row items-center justify-between gap-stack-lg mt-stack-md">
        <div class="flex-1 space-y-stack-md z-10">
          <div class="inline-block glass-panel px-4 py-1 rounded-full text-on-tertiary-container font-label-caps mb-4">
            Next-Gen Education Management
          </div>
          <h1 class="font-display-lg text-display-lg text-primary text-balance">
            Empower Your Institution with <span class="text-on-tertiary-container">Data-Driven</span> Clarity.
          </h1>
          <p class="font-body-lg text-body-lg text-secondary max-w-xl text-balance">
            Transform administrative burden into actionable insights. A comprehensive suite designed for modern educational leaders who demand transparency and performance.
          </p>
          <div class="flex flex-wrap gap-stack-sm pt-4">
            <router-link to="/login" class="bg-tertiary text-on-tertiary px-8 py-3 rounded-lg font-title-md shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-semibold">
              Get Started
            </router-link>
            <router-link to="/login" class="glass-panel text-primary px-8 py-3 rounded-lg font-title-md hover:bg-surface-container transition-colors duration-300 flex items-center gap-2 font-semibold">
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">play_circle</span>
              Watch Demo
            </router-link>
          </div>
        </div>
        
        <div class="flex-1 w-full max-w-2xl relative z-10 perspective-1000">
          <div class="relative rounded-xl overflow-hidden shadow-2xl transform rotate-y-[-5deg] rotate-x-[5deg] transition-transform duration-500 hover:rotate-0 border-4 border-surface-container-lowest/50 bg-surface-container-lowest/20 backdrop-blur-sm p-2">
            <img 
              alt="A high-fidelity rendering of a modern, sleek laptop screen displaying a complex but cleanly organized data dashboard for educational management." 
              class="w-full h-auto rounded-lg shadow-inner" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFGTE67V0VwVRVcE6c32UytIhoBeeDkY2BaxB9QI3zXLAD-WoUufa4aiFrHMQojjw5BkowZWXva1ONDooFBqMRkNDGzySry3I6XbrgB7IHXDdUvMcweqlIF1eHArn3IVlN2HC81whyjqPCAEzNaCLlZWdPpQw4K5ogkGNBAGL0yQ63AMkK4wxgqmT3_5mm5nljBh2Qjiom5_VlObetu-RLoho21wqHngK3dMpl8zYDR_KzJ7HKgUd-pQ6EwlhkwvrPhwhYOxOWLIyg"
            />
          </div>
          <!-- Decorative element behind image -->
          <div class="absolute -inset-4 bg-gradient-to-tr from-tertiary-fixed-dim/30 to-transparent blur-2xl -z-10 rounded-full"></div>
        </div>
      </section>
      
      <!-- Stats Section -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-gutter relative z-10">
        <div class="glass-panel p-stack-md rounded-xl text-center hover:-translate-y-2 transition-transform duration-300">
          <div class="font-display-lg text-display-lg text-on-tertiary-container mb-2">1000+</div>
          <div class="font-title-md text-title-md text-secondary">Centers Active</div>
        </div>
        <div class="glass-panel p-stack-md rounded-xl text-center hover:-translate-y-2 transition-transform duration-300">
          <div class="font-display-lg text-display-lg text-on-tertiary-container mb-2">500k+</div>
          <div class="font-title-md text-title-md text-secondary">Students Managed</div>
        </div>
        <div class="glass-panel p-stack-md rounded-xl text-center hover:-translate-y-2 transition-transform duration-300">
          <div class="font-display-lg text-display-lg text-on-tertiary-container mb-2">98%</div>
          <div class="font-title-md text-title-md text-secondary">Satisfaction Rate</div>
        </div>
      </section>
      
      <!-- Features Section (Bento Grid) -->
      <section class="space-y-stack-lg z-10 relative">
        <div class="text-center max-w-2xl mx-auto space-y-stack-sm">
          <h2 class="font-headline-lg text-headline-lg text-primary">Comprehensive Ecosystem</h2>
          <p class="font-body-lg text-body-lg text-secondary">Everything you need to streamline operations and enhance the educational experience in one cohesive platform.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          <!-- Card 1 -->
          <div class="glass-panel p-stack-md rounded-xl flex flex-col gap-stack-sm group hover:border-on-tertiary-container transition-colors duration-300">
            <div class="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-on-tertiary-container group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 0;">school</span>
            </div>
            <h3 class="font-title-md text-title-md text-primary mt-2">Course Management</h3>
            <p class="font-body-sm text-body-sm text-secondary">Streamline curriculum planning, scheduling, and resource allocation with intuitive drag-and-drop tools.</p>
          </div>
          <!-- Card 2 -->
          <div class="glass-panel p-stack-md rounded-xl flex flex-col gap-stack-sm group hover:border-on-tertiary-container transition-colors duration-300">
            <div class="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-on-tertiary-container group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 0;">person</span>
            </div>
            <h3 class="font-title-md text-title-md text-primary mt-2">Student Portal</h3>
            <p class="font-body-sm text-body-sm text-secondary">Provide a unified, secure access point for grades, assignments, and communication tailored to individual needs.</p>
          </div>
          <!-- Card 3 -->
          <div class="glass-panel p-stack-md rounded-xl flex flex-col gap-stack-sm group hover:border-on-tertiary-container transition-colors duration-300">
            <div class="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-on-tertiary-container group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 0;">bar_chart</span>
            </div>
            <h3 class="font-title-md text-title-md text-primary mt-2">Financial Reporting</h3>
            <p class="font-body-sm text-body-sm text-secondary">Generate real-time, customizable fiscal reports to ensure compliance and optimize budget utilization.</p>
          </div>
          <!-- Card 4 -->
          <div class="glass-panel p-stack-md rounded-xl flex flex-col gap-stack-sm group hover:border-on-tertiary-container transition-colors duration-300">
            <div class="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-on-tertiary-container group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 0;">phone_iphone</span>
            </div>
            <h3 class="font-title-md text-title-md text-primary mt-2">Mobile App</h3>
            <p class="font-body-sm text-body-sm text-secondary">Stay connected on the go with full administrative capabilities optimized for mobile devices.</p>
          </div>
        </div>
      </section>
      
      <!-- Social Proof Section -->
      <section class="glass-panel p-stack-lg rounded-2xl z-10 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-surface-container-low/50 to-transparent -z-10"></div>
        <div class="text-center mb-stack-md">
          <h2 class="font-headline-lg text-headline-lg text-primary">Trusted by Leaders</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter max-w-4xl mx-auto">
          <div class="bg-surface-container-lowest/50 p-stack-md rounded-xl border border-glass-border">
            <p class="font-body-lg text-body-lg text-on-surface-variant italic mb-4">"EduManager Pro completely transformed our administrative workflows. The clarity it brings to our data is simply unmatched in the industry."</p>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-surface-tint overflow-hidden">
                <img 
                  alt="Sarah Jenkins Headshot" 
                  class="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSltzJpWVG2YyLOwSHzlC_M5wLuYDkVeeWzmwfElbEgQw23U1bKRz11-NDlcMdGD-f4FygzkU1szGm9R7nXzQ--8SZIvsD8jkRAZEugF0iRMrh8bEjK9TkvFBeMZ_FJtvgW2DQYLVSSBdK5F9-djsBw5tK8OiHSOlgfi7NR5uB_o50DqxYxyVklFwgvdA1Tu6yM4soKY0zu_PkL7cNjlolUslJQcAzoiz_rzyFKCnZne_PwFBAwIw9JA2S7XsXdlYBsy-KyG1VIOTQ"
                />
              </div>
              <div>
                <div class="font-title-md text-title-md text-primary">Sarah Jenkins</div>
                <div class="font-body-sm text-body-sm text-secondary">Dean of Operations, Horizon Academy</div>
              </div>
            </div>
          </div>
          <div class="bg-surface-container-lowest/50 p-stack-md rounded-xl border border-glass-border">
            <p class="font-body-lg text-body-lg text-on-surface-variant italic mb-4">"The glassmorphic interface isn't just visually stunning; it actually reduces cognitive load for my team when analyzing complex student metrics."</p>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-surface-tint overflow-hidden">
                <img 
                  alt="David Chen Headshot" 
                  class="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6npbLNgqQzB1eeaLbplDMwMqBhCLYqUWJ_OSryB5Qu9M2XmbrrCMEJn-IqiUOgojS_0FGbdX-jyYuGZxBmvCEBPhD0OGSGJwPGYAzaMCutwMhBN35pPLfTLVWEp8pKV4VqQhw8vKrNXWasCQYsCywjd8JrZzeWjVfxESPDhDJdjBbPIug7R23yRDoM5D7el5KC6TU1TpKmaBTaMthR6t4WXWVmYgqLutxxFSGkWj5_usqOXg8nYi9SMiwqxJwVy6KL784nABqgaqB"
                />
              </div>
              <div>
                <div class="font-title-md text-title-md text-primary">David Chen</div>
                <div class="font-body-sm text-body-sm text-secondary">IT Director, Nexus Public Schools</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    
    <!-- Footer Component -->
    <footer class="bg-primary dark:bg-surface-container-lowest font-body-sm text-body-sm w-full mt-auto">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-stack-lg px-container-padding py-stack-lg max-w-[1400px] mx-auto text-on-primary dark:text-on-surface">
        <div class="col-span-1 md:col-span-2 space-y-4">
          <div class="font-headline-lg text-headline-lg text-on-primary font-bold">EduManager Pro</div>
          <p class="text-secondary-fixed-dim opacity-80 max-w-xs">
            Elevating educational management through transparent, data-rich interfaces and seamless administrative tools.
          </p>
          <div class="pt-4 text-secondary-fixed-dim opacity-80">
            © 2026 EduManager Pro. All rights reserved.
          </div>
        </div>
        <div class="space-y-4">
          <h4 class="font-title-md text-title-md text-on-primary mb-2">Legal</h4>
          <ul class="space-y-2">
            <li><a class="text-secondary-fixed-dim opacity-80 hover:text-tertiary-fixed transition-opacity" href="#">Privacy Policy</a></li>
            <li><a class="text-secondary-fixed-dim opacity-80 hover:text-tertiary-fixed transition-opacity" href="#">Terms of Service</a></li>
            <li><a class="text-secondary-fixed-dim opacity-80 hover:text-tertiary-fixed transition-opacity" href="#">Cookie Settings</a></li>
          </ul>
        </div>
        <div class="space-y-4">
          <h4 class="font-title-md text-title-md text-on-primary mb-2">Support</h4>
          <ul class="space-y-2">
            <li><a class="text-secondary-fixed-dim opacity-80 hover:text-tertiary-fixed transition-opacity" href="#">Contact Us</a></li>
            <li><a class="text-secondary-fixed-dim opacity-80 hover:text-tertiary-fixed transition-opacity" href="#">Help Center</a></li>
          </ul>
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
