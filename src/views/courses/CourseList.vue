<template>
  <div class="space-y-stack-lg animate-fade-in">
    <!-- Header Section -->
    <section class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center">
          <span class="material-symbols-outlined text-primary-container">school</span>
        </div>
        <div>
          <h2 class="font-headline-lg text-headline-lg text-primary-container tracking-tight">Quản lý môn học</h2>
          <p class="font-body-lg text-body-lg text-on-surface-variant mt-1">Quản lý tất cả môn học tại trung tâm.</p>
        </div>
      </div>
      <div v-if="authStore.isAdmin">
        <button
          @click="openCreateDialog"
          class="bg-primary-container text-white px-6 py-3 rounded-lg font-semibold text-[14px] shadow-sm hover:bg-primary hover:shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <span class="material-symbols-outlined text-[20px]">add</span>
          Thêm môn học
        </button>
      </div>
    </section>

    <!-- Stats Cards -->
    <section class="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-gutter pb-4 lg:pb-0 scrollbar-none snap-x snap-mandatory">
      <div v-for="stat in stats" :key="stat.label" class="flex-shrink-0 w-[260px] sm:w-[280px] lg:w-auto bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 snap-start">
        <div :class="[stat.bgColor, stat.textColor, 'w-12 h-12 rounded-lg flex items-center justify-center shrink-0']">
          <span class="material-symbols-outlined">{{ stat.icon }}</span>
        </div>
        <div>
          <div class="text-2xl font-bold text-primary">{{ stat.value }}</div>
          <div class="text-label-caps font-label-caps text-on-surface-variant">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <section class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center">
      <!-- Search -->
      <div class="relative flex-1 w-full">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
        <input
          v-model="filters.search"
          @input="debouncedFetch"
          class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg pl-10 pr-10 py-2.5 text-body-sm text-primary placeholder:text-outline-variant focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
          placeholder="Tìm kiếm môn học..."
          type="text"
        />
        <button
          v-if="filters.search"
          @click="filters.search = ''; fetchData();"
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center w-6 h-6 rounded-full hover:bg-primary-container/10"
        >
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <!-- Category -->
      <div class="relative w-full sm:w-48">
        <select
          v-model="filters.category"
          @change="fetchData"
          class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none pl-4 pr-10 py-2.5 text-body-sm text-primary cursor-pointer focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
        >
          <option :value="null">Tất cả danh mục</option>
          <option v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">{{ opt.title }}</option>
        </select>
        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
      </div>

      <!-- Level -->
      <div class="relative w-full sm:w-48">
        <select
          v-model="filters.level"
          @change="fetchData"
          class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none pl-4 pr-10 py-2.5 text-body-sm text-primary cursor-pointer focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
        >
          <option :value="null">Tất cả trình độ</option>
          <option v-for="opt in levelOptions" :key="opt.value" :value="opt.value">{{ opt.title }}</option>
        </select>
        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
      </div>

      <!-- Active Status -->
      <div class="relative w-full sm:w-48">
        <select
          v-model="filters.isActive"
          @change="fetchData"
          class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none pl-4 pr-10 py-2.5 text-body-sm text-primary cursor-pointer focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
        >
          <option :value="null">Tất cả trạng thái</option>
          <option :value="true">Hoạt động</option>
          <option :value="false">Đã đóng</option>
        </select>
        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
      </div>
    </section>

    <!-- Courses Grid (Card-based Layout) -->
    <section>
      <!-- Loading State -->
      <div v-if="store.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        <div v-for="i in 3" :key="i" class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-5 space-y-4 animate-pulse">
          <div class="flex justify-between items-center">
            <div class="w-10 h-10 bg-surface-container rounded-lg"></div>
            <div class="h-6 bg-surface-container rounded w-1/4"></div>
          </div>
          <div class="h-8 bg-surface-container rounded w-3/4"></div>
          <div class="space-y-2">
            <div class="h-4 bg-surface-container rounded w-1/2"></div>
            <div class="h-4 bg-surface-container rounded w-2/3"></div>
          </div>
        </div>
      </div>

      <!-- Course Cards -->
      <div v-else-if="filteredCourses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        <div
          v-for="course in filteredCourses"
          :key="course.courseId"
          class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative cursor-pointer"
          @click="authStore.isAdmin && openEditDialog(course)"
        >
          <!-- Card Banner Image -->
          <div class="h-40 w-full overflow-hidden relative">
            <img
              :src="getCourseImage(course.imageUrl, course.category)"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              alt="Course cover image"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            
            <!-- Floating Category Badge -->
            <div class="absolute left-4 bottom-3 flex items-center gap-1.5">
              <div :class="[getCategoryBgClass(course.category), 'w-8 h-8 rounded-lg flex items-center justify-center border shadow-md backdrop-blur-sm bg-white/70']">
                <span class="material-symbols-outlined text-[18px]">{{ getCategoryIcon(course.category) }}</span>
              </div>
              <span class="text-white text-[13px] font-bold drop-shadow-md">
                {{ getCategoryLabel(course.category) }}
              </span>
            </div>

            <!-- Floating Admin Controls -->
            <div v-if="authStore.isAdmin" class="absolute right-3 top-3 flex items-center gap-1 bg-white/80 backdrop-blur-md p-1 rounded-lg shadow-md" @click.stop>
              <button
                @click="openEditDialog(course)"
                class="w-8 h-8 rounded-lg hover:bg-on-tertiary-container/10 flex items-center justify-center text-on-tertiary-container transition-colors cursor-pointer"
                title="Sửa môn học"
              >
                <span class="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button
                @click="confirmDelete(course)"
                class="w-8 h-8 rounded-lg hover:bg-error/10 flex items-center justify-center text-error transition-colors cursor-pointer"
                title="Xóa môn học"
              >
                <span class="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>

          <!-- Card Content Body -->
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <!-- Course Title & Description -->
              <h3 class="font-bold text-lg text-primary-container mb-2 line-clamp-1" :title="course.courseName">{{ course.courseName }}</h3>
              <p class="text-body-sm text-on-surface-variant line-clamp-2 mb-4 h-10" :title="course.description">
                {{ course.description || 'Chưa có mô tả' }}
              </p>

              <!-- Course Details -->
              <div class="space-y-2 mb-4">
                <div class="flex justify-between items-center text-body-sm">
                  <span class="text-on-surface-variant font-medium">Trình độ:</span>
                  <span :class="[getLevelBorderClass(course.level), 'px-2.5 py-0.5 rounded-full text-[12px] font-semibold border']">
                    {{ getLevelLabel(course.level) }}
                  </span>
                </div>
                <div class="flex justify-between items-center text-body-sm">
                  <span class="text-on-surface-variant font-medium">Số buổi học:</span>
                  <span class="font-bold text-primary-container">{{ course.totalSessions }} buổi</span>
                </div>
                <div class="flex justify-between items-center text-body-sm">
                  <span class="text-on-surface-variant font-medium">Học phí:</span>
                  <span class="font-bold text-on-tertiary-container">{{ formatCurrency(course.fee) }}</span>
                </div>
                <div v-if="authStore.isTeacher || getCourseStudentCount(course.courseId) === 0" class="flex justify-between items-center text-body-sm">
                  <template v-if="authStore.isTeacher">
                    <span class="text-on-surface-variant font-medium">Số học viên:</span>
                    <span class="text-primary-container font-bold">{{ getCourseStudentCount(course.courseId) }} học viên</span>
                  </template>
                  <template v-else>
                    <span class="text-on-surface-variant font-medium">Chờ ghép lớp:</span>
                    <span class="text-on-tertiary-container font-bold">{{ getQueueCount(course.courseId) }}/5 học viên</span>
                  </template>
                </div>
                <div v-if="authStore.isAdmin" class="flex justify-between items-center text-body-sm">
                  <span class="text-on-surface-variant font-medium">Số học viên đang học:</span>
                  <span class="text-primary-container font-bold">{{ getCourseStudentCount(course.courseId) }} học viên</span>
                </div>
                <div class="mt-3 flex justify-between items-center">
                  <span :class="[course.isActive ? 'status-opened' : 'status-cancelled', 'status-badge']">
                    <span :class="[course.isActive ? 'bg-emerald-600' : 'bg-error', 'w-1.5 h-1.5 rounded-full mr-1.5']"></span>
                    {{ course.isActive ? 'Đang hoạt động' : 'Đã đóng' }}
                  </span>
                </div>

                <!-- Waitlist / VIP buttons -->
                <div v-if="course.isActive && (authStore.isStudent || authStore.isAdmin)" class="mt-3 pt-2 w-full space-y-2" @click.stop>
                  <button
                    @click="handleEnrollQueue(course)"
                    class="w-full bg-on-tertiary-container/10 hover:bg-on-tertiary-container/20 text-on-tertiary-container border border-on-tertiary-container/20 hover:border-on-tertiary-container/30 py-2 rounded-lg font-semibold text-body-sm transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                  >
                    <span class="material-symbols-outlined text-[18px]">group_add</span>
                    {{ authStore.isStudent ? 'Đăng ký ghép lớp' : 'Ghép lớp học viên' }}
                  </button>

                  <button
                    v-if="authStore.isAdmin && getQueueCount(course.courseId) >= 1 && getQueueCount(course.courseId) < 5"
                    @click="openVipLaunchModal(course)"
                    class="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg font-semibold text-body-sm transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                  >
                    <span class="material-symbols-outlined text-[18px]">workspace_premium</span>
                    Khai giảng nhóm nhỏ (VIP)
                  </button>

                  <button
                    v-if="authStore.isAdmin && getQueueCount(course.courseId) >= 5"
                    @click="openStandardLaunchModal(course)"
                    class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold text-body-sm transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                  >
                    <span class="material-symbols-outlined text-[18px]">rocket_launch</span>
                    Khai giảng lớp học (Đủ 5+ học viên)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-12 text-center flex flex-col items-center justify-center">
        <span class="material-symbols-outlined text-primary/30 text-[64px] mb-4">school</span>
        <h3 class="font-title-md text-title-md font-bold text-primary mt-2">Chưa có môn học nào</h3>
        <p class="text-body-sm text-on-surface-variant mt-2">
          Thử tìm kiếm với từ khóa khác hoặc tạo một môn học mới.
        </p>
        <button v-if="authStore.isAdmin" @click="openCreateDialog" class="mt-4 bg-primary-container text-white px-5 py-2.5 rounded-lg font-semibold text-[13px] hover:bg-primary shadow transition-all active:scale-95 cursor-pointer">
          Thêm môn học đầu tiên
        </button>
      </div>
    </section>

    <!-- Create/Edit Dialog Modal -->
    <teleport to="body">
      <div v-if="dialog" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 glass-backdrop">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 shadow-[0_20px_40px_rgba(0,31,63,0.12)] w-full max-w-lg rounded-2xl overflow-hidden animate-scale-in">
          <!-- Dialog Header -->
          <div class="px-6 py-4 border-b border-white/40 flex justify-between items-center">
            <h3 class="font-title-md text-[18px] font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-on-tertiary-container">{{ isEdit ? 'edit' : 'add_circle' }}</span>
              {{ isEdit ? 'Cập nhật môn học' : 'Thêm môn học mới' }}
            </h3>
            <button @click="dialog = false" class="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Dialog Body -->
          <div class="p-6 space-y-4">
            <!-- Course Name -->
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary">Tên môn học *</label>
              <input
                v-model="formData.courseName"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/10 transition-all"
                placeholder="Nhập tên môn học..."
                type="text"
              />
            </div>

            <!-- Description -->
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary">Mô tả chi tiết</label>
              <textarea
                v-model="formData.description"
                rows="3"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/10 transition-all resize-none"
                placeholder="Nhập mô tả chi tiết môn học..."
              ></textarea>
            </div>

            <!-- Course Image Selection -->
            <div class="space-y-2">
              <label class="text-body-sm font-semibold text-primary">Ảnh bìa môn học</label>
              
              <!-- Presets Grid -->
              <div class="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  @click="selectPresetImage('preset_foreign_language')"
                  :class="[formData.imageUrl === 'preset_foreign_language' ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant/30']"
                  class="border rounded-lg overflow-hidden h-14 relative focus:outline-none cursor-pointer hover:border-primary transition-all"
                  title="Ngoại ngữ"
                >
                  <img :src="foreignLanguageImg" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors"></div>
                  <div v-if="formData.imageUrl === 'preset_foreign_language'" class="absolute right-1 top-1 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow">
                    <span class="material-symbols-outlined text-[10px] font-bold">check</span>
                  </div>
                </button>

                <button
                  type="button"
                  @click="selectPresetImage('preset_it')"
                  :class="[formData.imageUrl === 'preset_it' ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant/30']"
                  class="border rounded-lg overflow-hidden h-14 relative focus:outline-none cursor-pointer hover:border-primary transition-all"
                  title="Tin học"
                >
                  <img :src="itImg" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors"></div>
                  <div v-if="formData.imageUrl === 'preset_it'" class="absolute right-1 top-1 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow">
                    <span class="material-symbols-outlined text-[10px] font-bold">check</span>
                  </div>
                </button>

                <button
                  type="button"
                  @click="selectPresetImage('preset_skills')"
                  :class="[formData.imageUrl === 'preset_skills' ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant/30']"
                  class="border rounded-lg overflow-hidden h-14 relative focus:outline-none cursor-pointer hover:border-primary transition-all"
                  title="Kỹ năng"
                >
                  <img :src="skillsImg" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors"></div>
                  <div v-if="formData.imageUrl === 'preset_skills'" class="absolute right-1 top-1 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow">
                    <span class="material-symbols-outlined text-[10px] font-bold">check</span>
                  </div>
                </button>

                <button
                  type="button"
                  @click="selectPresetImage('preset_default')"
                  :class="[formData.imageUrl === 'preset_default' ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant/30']"
                  class="border rounded-lg overflow-hidden h-14 relative focus:outline-none cursor-pointer hover:border-primary transition-all"
                  title="Mặc định"
                >
                  <img :src="defaultImg" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors"></div>
                  <div v-if="formData.imageUrl === 'preset_default'" class="absolute right-1 top-1 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow">
                    <span class="material-symbols-outlined text-[10px] font-bold">check</span>
                  </div>
                </button>
              </div>

              <!-- Custom Upload / URL Selection -->
              <div class="flex flex-col gap-2 mt-2">
                <div class="flex gap-3 items-center">
                  <!-- Upload Button -->
                  <button
                    type="button"
                    @click="triggerCourseImageSelect"
                    class="px-4 py-2.5 rounded-lg border border-primary-container/20 bg-primary-container/5 hover:bg-primary-container/10 text-primary font-semibold text-body-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                  >
                    <span class="material-symbols-outlined text-[20px]">upload_file</span>
                    Tải ảnh từ máy...
                  </button>
                  
                  <!-- Custom URL Input -->
                  <div class="relative flex-1">
                    <input
                      v-model="customImageUrl"
                      @input="onCustomImageUrlInput"
                      class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/10 transition-all"
                      placeholder="Hoặc nhập Link ảnh tùy chỉnh bên ngoài..."
                      type="text"
                    />
                  </div>
                </div>

                <!-- Preview of uploaded/custom image -->
                <div v-if="isCustomImageActive" class="flex items-center gap-3 p-3 bg-primary-container/[0.03] border border-primary-container/10 rounded-xl">
                  <div class="w-16 h-12 rounded-lg overflow-hidden border border-outline-variant/30 shrink-0">
                    <img :src="formData.imageUrl" class="w-full h-full object-cover" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="text-body-xs font-bold text-primary-container">Ảnh tự chọn đang kích hoạt</div>
                    <div class="text-[10px] text-on-surface-variant truncate">
                      {{ formData.imageUrl.startsWith('data:') ? 'Ảnh tải lên từ thiết bị' : formData.imageUrl }}
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="clearCustomImage"
                    class="text-error hover:text-error/80 cursor-pointer flex items-center justify-center"
                  >
                    <span class="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
              <input ref="courseImageInput" type="file" class="hidden" accept="image/*" @change="onCourseImageUpload" />
            </div>

            <!-- Category and Level -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary">Danh mục *</label>
                <div class="relative">
                  <select
                    v-model="formData.category"
                    class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none pl-4 pr-10 py-2.5 text-body-sm text-primary cursor-pointer focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/10 transition-all"
                  >
                    <option v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">{{ opt.title }}</option>
                  </select>
                  <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
              </div>
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary">Trình độ *</label>
                <div class="relative">
                  <select
                    v-model="formData.level"
                    class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none pl-4 pr-10 py-2.5 text-body-sm text-primary cursor-pointer focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/10 transition-all"
                  >
                    <option v-for="opt in levelOptions" :key="opt.value" :value="opt.value">{{ opt.title }}</option>
                  </select>
                  <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>

            <!-- Fee and Sessions -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary">Học phí (VNĐ) *</label>
                <input
                  v-model.number="formData.fee"
                  type="number"
                  class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/10 transition-all"
                  placeholder="Ví dụ: 3000000"
                />
              </div>
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary">Tổng số buổi *</label>
                <input
                  v-model.number="formData.totalSessions"
                  type="number"
                  class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/10 transition-all"
                  placeholder="Ví dụ: 24"
                />
              </div>
            </div>

            <!-- Active Toggle -->
            <div v-if="isEdit" class="flex items-center gap-2 pt-2">
              <input
                v-model="formData.isActive"
                type="checkbox"
                id="isActiveCheck"
                class="w-4 h-4 text-on-tertiary-container bg-white/40 border-white/60 rounded focus:ring-0 cursor-pointer"
              />
              <label for="isActiveCheck" class="text-body-sm font-semibold text-primary select-none cursor-pointer">Môn học đang hoạt động</label>
            </div>
          </div>

          <!-- Dialog Footer -->
          <div class="px-6 py-4 border-t border-white/40 flex justify-between gap-3 bg-white/20">
            <div>
              <button
                v-if="isEdit"
                @click="confirmDelete(formData)"
                class="px-5 py-2.5 rounded-lg bg-error text-white font-semibold text-[13px] hover:bg-red-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span class="material-symbols-outlined text-[16px]">delete</span>
                Xóa môn học
              </button>
            </div>
            <div class="flex gap-3">
              <button
                @click="dialog = false"
                class="px-5 py-2.5 rounded-lg bg-transparent text-on-surface-variant border border-outline-variant font-semibold text-[13px] hover:bg-surface-container transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                @click="saveForm"
                :disabled="saving || !isCourseFormValid"
                class="px-5 py-2.5 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
              >
                <span v-if="saving" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Delete Confirmation Dialog -->
    <teleport to="body">
      <div v-if="deleteDialog" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 glass-backdrop">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-md w-full p-6 space-y-4 animate-scale-in">
          <div class="flex items-center gap-3 text-error">
            <span class="material-symbols-outlined text-[32px]">warning</span>
            <h3 class="font-title-md text-title-md font-bold">Xác nhận xóa môn học</h3>
          </div>
          <p class="text-body-sm text-on-surface-variant leading-relaxed">
            Bạn có chắc chắn muốn xóa môn học <strong class="text-primary-container">{{ deleteTarget?.courseName }}</strong> không? Hành động này không thể hoàn tác.
          </p>
          <div class="flex justify-end gap-3 pt-2">
            <button
              @click="deleteDialog = false"
              class="px-4 py-2 rounded-lg bg-transparent text-on-surface-variant border border-outline-variant font-semibold text-[13px] hover:bg-surface-container transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              @click="doDelete"
              :disabled="deleting"
              class="px-4 py-2 rounded-lg bg-error text-white font-semibold text-[13px] hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span v-if="deleting" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Xóa bỏ
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Admin Enroll Waitlist Modal -->
    <teleport to="body">
      <div v-if="enrollQueueDialog" class="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-md w-full overflow-hidden animate-scale-in flex flex-col">
          <!-- Title -->
          <div class="px-6 py-4 border-b border-white/40 flex items-center justify-between">
            <h3 class="font-title-md text-title-md text-primary-container flex items-center gap-2">
              <span class="material-symbols-outlined text-on-tertiary-container">group_add</span>
              Đăng ký học viên vào hàng chờ
            </h3>
            <button @click="enrollQueueDialog = false" class="text-on-surface-variant hover:text-primary-container cursor-pointer transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-4">
            <div>
              <label class="text-body-sm font-semibold text-on-surface-variant">Môn học</label>
              <div class="text-primary-container font-bold text-lg mt-1">
                {{ queueTargetCourse?.courseName }}
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary">Chọn học viên *</label>
              <div v-if="loadingStudents" class="text-body-sm text-on-surface-variant py-2 animate-pulse">
                Đang tải danh sách học viên...
              </div>
              <div v-else-if="allStudents.length === 0" class="text-body-sm text-error font-semibold">
                Chưa có học viên nào trong hệ thống
              </div>
              <div v-else class="relative">
                <select
                  v-model="selectedStudentId"
                  class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none px-4 py-2.5 text-body-sm text-primary bg-transparent cursor-pointer focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
                >
                  <option :value="null">-- Chọn học viên --</option>
                  <option v-for="std in allStudents" :key="std.studentId" :value="std.studentId">
                    {{ std.fullName }} (SĐT: {{ std.phone || 'N/A' }})
                  </option>
                </select>
                <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="px-6 py-4 border-t border-white/40 flex justify-end gap-3 bg-white/20">
            <button
              @click="enrollQueueDialog = false"
              class="px-5 py-2.5 rounded-lg bg-transparent text-on-surface-variant border border-outline-variant font-semibold text-[13px] hover:bg-surface-container transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              @click="submitEnrollQueue"
              :disabled="submittingQueue || !selectedStudentId"
              class="px-5 py-2.5 rounded-lg bg-primary-container text-on-primary font-semibold text-[13px] hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <span v-if="submittingQueue" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <teleport to="body">
      <div v-if="vipLaunchDialog" class="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-lg w-full overflow-hidden animate-scale-in flex flex-col">
          <!-- Title -->
          <div class="px-6 py-4 border-b border-white/40 flex items-center justify-between">
            <h3 class="font-title-md text-title-md text-primary-container flex items-center gap-2">
              <span class="material-symbols-outlined" :class="launchMode === 'vip' ? 'text-amber-600' : 'text-emerald-600'">
                {{ launchMode === 'vip' ? 'workspace_premium' : 'rocket_launch' }}
              </span>
              {{ launchMode === 'vip' ? 'Khai giảng sớm lớp VIP cho khóa:' : 'Khai giảng lớp học mới cho khóa:' }} {{ vipLaunchTargetCourse?.courseName }}
            </h3>
            <button @click="vipLaunchDialog = false" class="text-on-surface-variant hover:text-primary-container cursor-pointer transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
            <div v-if="loadingVipLaunchStudents" class="flex flex-col items-center justify-center py-12 space-y-2">
              <span class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></span>
              <span class="text-body-sm text-on-surface-variant">Đang tải danh sách học viên hàng chờ...</span>
            </div>

            <div v-else class="space-y-4">
              <!-- Class Name -->
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary">Tên lớp học *</label>
                <input
                  v-model="vipLaunchForm.className"
                  type="text"
                  class="w-full bg-white border border-outline-variant/60 rounded-lg px-4 py-2.5 text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/15 transition-all"
                />
              </div>

              <!-- Teacher & Room -->
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-body-sm font-semibold text-primary">Giáo viên phụ trách</label>
                  <div class="relative">
                    <select
                      v-model="vipLaunchForm.teacherId"
                      @change="onVipTeacherSelect"
                      class="w-full bg-white border border-outline-variant/60 rounded-lg appearance-none pl-4 pr-10 py-2.5 text-body-sm text-primary cursor-pointer focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/15 transition-all"
                    >
                      <option :value="null">Chưa phân công</option>
                      <option v-for="t in teachersList" :key="t.userId" :value="t.userId">
                        {{ t.fullName }} (@{{ t.username }})
                      </option>
                    </select>
                    <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div class="space-y-1">
                  <label class="text-body-sm font-semibold text-primary">Phòng học</label>
                  <input
                    v-model="vipLaunchForm.room"
                    type="text"
                    class="w-full bg-white border border-outline-variant/60 rounded-lg px-4 py-2.5 text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/15 transition-all"
                    placeholder="Ví dụ: Phòng 101, Phòng VIP 1"
                  />
                </div>
              </div>

              <!-- Sessions & Start Date -->
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-body-sm font-semibold text-primary">Thời lượng (buổi)</label>
                  <input
                    v-model.number="vipLaunchForm.totalSessions"
                    type="number"
                    class="w-full bg-white border border-outline-variant/60 rounded-lg px-4 py-2.5 text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/15 transition-all"
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-body-sm font-semibold text-primary">Ngày khai giảng</label>
                  <input
                    v-model="vipLaunchForm.startDate"
                    type="date"
                    class="w-full bg-white border border-outline-variant/60 rounded-lg px-4 py-2.5 text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/15 transition-all"
                  />
                </div>
              </div>

              <!-- Waitlist Students list display -->
              <div>
                <label class="text-body-sm font-semibold text-on-surface-variant">Học viên tham gia ({{ vipLaunchStudents.length }})</label>
                <div class="mt-2 divide-y divide-white/40 max-h-36 overflow-y-auto border border-primary-container/10 rounded-lg p-2.5 bg-primary-container/[0.02]">
                  <div v-for="std in vipLaunchStudents" :key="std.studentId" class="py-1.5 flex justify-between text-body-xs font-semibold text-primary-container">
                    <span>{{ std.fullName }}</span>
                    <span class="text-on-surface-variant">Mã HV: {{ std.studentId }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="px-6 py-4 border-t border-white/40 flex justify-end gap-3 bg-white/20">
            <button
              @click="vipLaunchDialog = false"
              class="px-5 py-2.5 rounded-lg bg-transparent text-on-surface-variant border border-outline-variant font-semibold text-[13px] hover:bg-surface-container transition-colors cursor-pointer"
            >
              Hủy bộ
            </button>
            <button
              @click="submitVipLaunch"
              :disabled="submittingVipLaunch || loadingVipLaunchStudents || !isVipLaunchFormValid"
              class="px-5 py-2.5 rounded-lg text-white font-semibold text-[13px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer active:scale-95"
              :class="launchMode === 'vip' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'"
            >
              <span v-if="submittingVipLaunch" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Xác nhận &amp; Khai giảng
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore, useAuthStore, useStudentStore, useCategoryStore, useClassStore } from '../../stores'
import api from '../../services/api'
import foreignLanguageImg from '../../assets/course_foreign_language.png'
import itImg from '../../assets/course_it.png'
import skillsImg from '../../assets/course_skills.png'
import defaultImg from '../../assets/course_default.png'

const store = useCourseStore()

function getCourseImage(imageUrl, cat) {
  if (imageUrl === 'preset_foreign_language') return foreignLanguageImg
  if (imageUrl === 'preset_it') return itImg
  if (imageUrl === 'preset_skills') return skillsImg
  if (imageUrl === 'preset_default') return defaultImg
  
  if (imageUrl && imageUrl.trim().length > 0 && !imageUrl.startsWith('preset_')) {
    return imageUrl
  }

  const map = {
    NgoaiNgu: foreignLanguageImg,
    TinHoc: itImg,
    KyNang: skillsImg
  }
  return map[cat] || defaultImg
}
const authStore = useAuthStore()
const studentStore = useStudentStore()
const categoryStore = useCategoryStore()
const classStore = useClassStore()
const router = useRouter()
const showSnackbar = inject('showSnackbar')

const teacherCourseIds = ref([])
const classesList = ref([])

async function fetchClassesData() {
  try {
    const params = { page: 1, pageSize: 1000 }
    if (authStore.isTeacher && authStore.currentUser?.userId) {
      params.teacherId = authStore.currentUser.userId
    }
    const { data } = await api.get('/api/v1/classes', { params })
    classesList.value = data.items || []
    if (authStore.isTeacher) {
      teacherCourseIds.value = [...new Set(classesList.value.map(c => c.courseId))]
    }
  } catch (e) {
    console.error('Lỗi khi tải danh sách lớp học để tính sĩ số:', e)
  }
}

const filteredCourses = computed(() => {
  if (authStore.isTeacher) {
    return store.courses.filter(c => teacherCourseIds.value.includes(c.courseId))
  }
  return store.courses
})

const dialog = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const saving = ref(false)
const deleting = ref(false)
const deleteTarget = ref(null)

// Queue-related state
const enrollQueueDialog = ref(false)
const queueTargetCourse = ref(null)
const selectedStudentId = ref(null)
const submittingQueue = ref(false)
const loadingStudents = ref(false)
const allStudents = ref([])
const currentStudentId = ref(null)

// VIP launch state
const launchMode = ref('standard')
const vipLaunchDialog = ref(false)
const vipLaunchTargetCourse = ref(null)
const vipLaunchStudents = ref([])
const loadingVipLaunchStudents = ref(false)
const submittingVipLaunch = ref(false)
const teachersList = ref([])

const vipLaunchForm = ref({
  className: '',
  teacherId: null,
  teacherName: '',
  room: 'Phòng VIP 1',
  totalSessions: 15,
  maxStudents: 5,
  startDate: new Date().toISOString().split('T')[0],
})

const customImageUrl = ref('')
const courseImageInput = ref(null)

const isCustomImageActive = computed(() => {
  const val = formData.value.imageUrl
  return val && !['preset_foreign_language', 'preset_it', 'preset_skills', 'preset_default'].includes(val)
})

function onCustomImageUrlInput() {
  formData.value.imageUrl = customImageUrl.value
}

function selectPresetImage(preset) {
  formData.value.imageUrl = preset
  customImageUrl.value = ''
}

function triggerCourseImageSelect() {
  courseImageInput.value.click()
}

function onCourseImageUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    showSnackbar('Ảnh kích thước quá lớn, vui lòng chọn ảnh dưới 2MB', 'error')
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    formData.value.imageUrl = reader.result
    customImageUrl.value = ''
  }
  reader.readAsDataURL(file)
}

function clearCustomImage() {
  formData.value.imageUrl = 'preset_default'
  customImageUrl.value = ''
  if (courseImageInput.value) {
    courseImageInput.value.value = ''
  }
}

const formData = ref({
  courseName: '',
  description: '',
  imageUrl: '',
  category: 'NgoaiNgu',
  level: 'Beginner',
  fee: 0,
  totalSessions: 0,
  isActive: true,
})

const filters = ref({
  search: '',
  category: null,
  level: null,
  isActive: true,
})

const categoryOptions = computed(() => {
  return categoryStore.categories.map(c => ({
    title: c.categoryName,
    value: c.categoryCode
  }))
})

const levelOptions = [
  { title: 'Cơ bản', value: 'Beginner' },
  { title: 'Trung cấp', value: 'Intermediate' },
  { title: 'Nâng cao', value: 'Advanced' },
]

const isCourseFormValid = computed(() => {
  return formData.value.courseName.trim().length >= 2 &&
         formData.value.fee > 0 &&
         formData.value.totalSessions > 0
})

const isVipLaunchFormValid = computed(() => {
  return vipLaunchForm.value.className.trim().length > 0 &&
         vipLaunchForm.value.totalSessions > 0 &&
         vipLaunchStudents.value.length > 0
})

const stats = computed(() => [
  {
    label: 'Tổng môn học',
    value: authStore.isTeacher ? filteredCourses.value.length : store.totalCount,
    icon: 'school',
    bgColor: 'bg-primary-container/10',
    textColor: 'text-primary-container',
  },
  {
    label: 'Đang hoạt động',
    value: filteredCourses.value.filter(c => c.isActive).length,
    icon: 'check_circle',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-600',
  },
  {
    label: 'Ngoại ngữ',
    value: filteredCourses.value.filter(c => c.category === 'NgoaiNgu').length,
    icon: 'translate',
    bgColor: 'bg-sky-500/10',
    textColor: 'text-sky-600',
  },
  {
    label: 'Tin học',
    value: filteredCourses.value.filter(c => c.category === 'TinHoc').length,
    icon: 'laptop_mac',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-600',
  },
])

let debounceTimer = null
const debouncedFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fetchData, 300)
}

async function fetchData() {
  try {
    await store.fetchCourses({
      search: filters.value.search || undefined,
      category: filters.value.category || undefined,
      level: filters.value.level || undefined,
      isActive: filters.value.isActive ?? undefined,
      page: 1,
      pageSize: 1000,
    })
  } catch (e) {
    showSnackbar('Lỗi tải dữ liệu', 'error')
  }
}

function openCreateDialog() {
  isEdit.value = false
  formData.value = {
    courseName: '',
    description: '',
    imageUrl: '',
    category: 'NgoaiNgu',
    level: 'Beginner',
    fee: 0,
    totalSessions: 0,
    isActive: true,
  }
  customImageUrl.value = ''
  dialog.value = true
}

function openEditDialog(item) {
  isEdit.value = true
  formData.value = { ...item }
  const presets = ['preset_foreign_language', 'preset_it', 'preset_skills', 'preset_default']
  if (presets.includes(item.imageUrl) || (item.imageUrl && item.imageUrl.startsWith('data:'))) {
    customImageUrl.value = ''
  } else {
    customImageUrl.value = item.imageUrl || ''
  }
  dialog.value = true
}

async function saveForm() {
  if (!isCourseFormValid.value) return
  saving.value = true
  try {
    if (isEdit.value) {
      await store.updateCourse(formData.value.courseId, formData.value)
      showSnackbar('Cập nhật môn học thành công', 'success')
    } else {
      await store.createCourse(formData.value)
      showSnackbar('Thêm môn học thành công', 'success')
    }
    dialog.value = false
    fetchData()
  } catch (e) {
    showSnackbar(e.response?.data?.message || 'Có lỗi xảy ra', 'error')
  } finally {
    saving.value = false
  }
}

function confirmDelete(item) {
  dialog.value = false
  deleteTarget.value = item
  deleteDialog.value = true
}

async function doDelete() {
  deleting.value = true
  try {
    await store.deleteCourse(deleteTarget.value.courseId)
    showSnackbar('Đã xóa môn học thành công', 'success')
    deleteDialog.value = false
    fetchData()
  } catch (e) {
    showSnackbar(e.response?.data?.message || 'Lỗi khi xóa', 'error')
  } finally {
    deleting.value = false
  }
}

function formatCurrency(val) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
}

function getCategoryIcon(cat) {
  const map = { NgoaiNgu: 'translate', TinHoc: 'laptop_mac', KyNang: 'psychology' }
  if (map[cat]) return map[cat]
  
  const index = categoryStore.categories.findIndex(c => c.categoryCode === cat)
  if (index !== -1) {
    const icons = ['translate', 'laptop_mac', 'psychology', 'sports_esports', 'menu_book', 'science']
    return icons[index % icons.length]
  }
  return 'school'
}

function getCategoryBgClass(cat) {
  const map = { 
    NgoaiNgu: 'bg-sky-500/10 text-sky-600 border-sky-500/20', 
    TinHoc: 'bg-amber-500/10 text-amber-600 border-amber-500/20', 
    KyNang: 'bg-purple-500/10 text-purple-600 border-purple-500/20' 
  }
  return map[cat] || 'bg-primary-container/10 text-primary-container border-primary-container/20'
}

function getCategoryLabel(cat) {
  const found = categoryStore.categories.find(c => c.categoryCode === cat)
  if (found) return found.categoryName
  const map = { NgoaiNgu: 'Ngoại ngữ', TinHoc: 'Tin học', KyNang: 'Kỹ năng' }
  return map[cat] || cat
}

function getLevelBorderClass(level) {
  const map = { 
    Beginner: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', 
    Intermediate: 'bg-amber-500/10 text-amber-600 border-amber-500/20', 
    Advanced: 'bg-rose-500/10 text-rose-600 border-rose-500/20' 
  }
  return map[level] || 'bg-primary-container/10 text-primary-container border-primary-container/20'
}

function getLevelLabel(level) {
  const map = { Beginner: 'Cơ bản', Intermediate: 'Trung cấp', Advanced: 'Nâng cao' }
  return map[level] || level
}

const getQueueCount = (courseId) => {
  return store.courseQueueStatuses?.find(q => q.courseId === courseId)?.count || 0
}

const getCourseStudentCount = (courseId) => {
  return classesList.value
    .filter(c => c.courseId === courseId)
    .reduce((sum, c) => sum + (c.currentStudents || 0), 0)
}

const fetchQueueStatuses = async () => {
  try {
    await store.fetchCourseQueueStatus()
  } catch (e) {
    console.error('Lỗi khi tải trạng thái hàng chờ:', e)
  }
}

const fetchCurrentStudentProfile = async () => {
  if (authStore.isStudent && authStore.currentUser?.userId) {
    try {
      const { data } = await api.get(`/api/v1/students/by-user/${authStore.currentUser.userId}`)
      currentStudentId.value = data.studentId
    } catch (e) {
      console.error('Không tìm thấy thông tin hồ sơ học viên:', e)
    }
  }
}

const fetchAllStudents = async () => {
  loadingStudents.value = true
  try {
    const { data } = await api.get('/api/v1/students', { params: { page: 1, pageSize: 200 } })
    allStudents.value = data.items || []
  } catch (e) {
    console.error('Lỗi tải danh sách học viên:', e)
  } finally {
    loadingStudents.value = false
  }
}

const handleEnrollQueue = async (course) => {
  if (authStore.isStudent) {
    if (!currentStudentId.value) {
      showSnackbar('Tài khoản của bạn chưa có thông tin hồ sơ học viên.', 'error')
      return
    }
    submittingQueue.value = true
    try {
      await store.enrollInCourseQueue(currentStudentId.value, course.courseId)
      showSnackbar('Bạn đã đăng ký vào hàng chờ ghép lớp thành công!', 'success')
      await fetchQueueStatuses()
    } catch (e) {
      showSnackbar(e.response?.data?.message || 'Có lỗi xảy ra khi đăng ký hàng chờ', 'error')
    } finally {
      submittingQueue.value = false
    }
  } else if (authStore.isAdmin) {
    queueTargetCourse.value = course
    selectedStudentId.value = null
    enrollQueueDialog.value = true
    await fetchAllStudents()
  }
}

const submitEnrollQueue = async () => {
  if (!selectedStudentId.value || !queueTargetCourse.value) return
  submittingQueue.value = true
  try {
    await store.enrollInCourseQueue(selectedStudentId.value, queueTargetCourse.value.courseId)
    showSnackbar('Đã thêm học viên vào hàng chờ ghép lớp thành công!', 'success')
    enrollQueueDialog.value = false
    await fetchQueueStatuses()
  } catch (e) {
    showSnackbar(e.response?.data?.message || 'Có lỗi xảy ra khi đăng ký', 'error')
  } finally {
    submittingQueue.value = false
  }
}

// VIP Launch logic
const fetchTeachersForVip = async () => {
  try {
    const { data } = await api.get('/api/v1/users/teachers')
    teachersList.value = data || []
  } catch (error) {
    console.error('Lỗi tải danh sách giáo viên:', error)
  }
}

const onVipTeacherSelect = () => {
  const selected = teachersList.value.find(t => t.userId === vipLaunchForm.value.teacherId)
  vipLaunchForm.value.teacherName = selected ? selected.fullName : ''
}

const openStandardLaunchModal = async (course) => {
  launchMode.value = 'standard'
  vipLaunchTargetCourse.value = course
  vipLaunchDialog.value = true
  loadingVipLaunchStudents.value = true
  vipLaunchStudents.value = []

  vipLaunchForm.value = {
    className: `Lớp ${course.courseName} - Khóa mới`,
    teacherId: null,
    teacherName: '',
    room: 'Phòng 101',
    totalSessions: course.totalSessions,
    maxStudents: 20,
    startDate: new Date().toISOString().split('T')[0],
  }

  try {
    const { data } = await api.get(`/api/v1/enrollments/course-queue/course/${course.courseId}/students`)
    vipLaunchStudents.value = data || []
    
    if (teachersList.value.length === 0) {
      await fetchTeachersForVip()
    }
  } catch (error) {
    showSnackbar('Lỗi tải danh sách học viên hàng chờ', 'error')
    vipLaunchDialog.value = false
  } finally {
    loadingVipLaunchStudents.value = false
  }
}

const openVipLaunchModal = async (course) => {
  launchMode.value = 'vip'
  vipLaunchTargetCourse.value = course
  vipLaunchDialog.value = true
  loadingVipLaunchStudents.value = true
  vipLaunchStudents.value = []

  vipLaunchForm.value = {
    className: `Lớp ${course.courseName} - VIP nhóm nhỏ`,
    teacherId: null,
    teacherName: '',
    room: 'Phòng VIP 1',
    totalSessions: 15,
    maxStudents: 5,
    startDate: new Date().toISOString().split('T')[0],
  }

  try {
    const { data } = await api.get(`/api/v1/enrollments/course-queue/course/${course.courseId}/students`)
    vipLaunchStudents.value = data || []
    
    const N = vipLaunchStudents.value.length
    vipLaunchForm.value.totalSessions = Math.round(course.totalSessions * (N / 5.0)) || 15
    
    if (teachersList.value.length === 0) {
      await fetchTeachersForVip()
    }
  } catch (error) {
    showSnackbar('Lỗi tải danh sách học viên hàng chờ', 'error')
    vipLaunchDialog.value = false
  } finally {
    loadingVipLaunchStudents.value = false
  }
}

const submitVipLaunch = async () => {
  if (!isVipLaunchFormValid.value) return
  submittingVipLaunch.value = true
  let newClassId = null
  try {
    const courseId = vipLaunchTargetCourse.value.courseId
    
    // 1. Create Class in CourseService
    const newClassPayload = {
      courseId: courseId,
      className: vipLaunchForm.value.className,
      teacherId: vipLaunchForm.value.teacherId,
      teacherName: vipLaunchForm.value.teacherName,
      room: vipLaunchForm.value.room,
      maxStudents: vipLaunchForm.value.maxStudents,
      totalSessions: vipLaunchForm.value.totalSessions,
      startDate: vipLaunchForm.value.startDate,
      endDate: null
    }
    
    const newCls = await classStore.createClass(newClassPayload)
    newClassId = newCls.classId

    // 2. Launch Class from waitlist in StudentService
    const studentIds = vipLaunchStudents.value.map(s => s.studentId)
    await api.post('/api/v1/enrollments/course-queue/launch', {
      courseId: courseId,
      classId: newClassId,
      studentIds: studentIds
    })

    const typeLabel = launchMode.value === 'vip' ? 'VIP' : 'thường'
    showSnackbar(`Khai giảng lớp ${typeLabel} thành công: ${vipLaunchForm.value.className} (${vipLaunchForm.value.totalSessions} buổi) với ${studentIds.length} học viên.`, 'success')
    vipLaunchDialog.value = false
    
    await fetchQueueStatuses()
    await fetchData()
    router.push('/classes')
  } catch (error) {
    if (newClassId) {
      try {
        await classStore.deleteClass(newClassId)
      } catch (rollbackError) {
        console.error('Failed to rollback class creation:', rollbackError)
      }
    }
    showSnackbar(error.response?.data?.message || 'Lỗi khi khai giảng lớp học', 'error')
  } finally {
    submittingVipLaunch.value = false
  }
}

onMounted(async () => {
  await categoryStore.fetchCategories()
  await fetchClassesData()
  await fetchData()
  await fetchQueueStatuses()
  await fetchCurrentStudentProfile()
})
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
.animate-scale-in {
  animation: scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>
