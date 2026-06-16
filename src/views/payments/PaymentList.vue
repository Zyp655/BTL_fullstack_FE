<template>
  <div class="space-y-stack-lg animate-fade-in pb-16">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-white/50 rounded-lg border border-white/60 shadow-sm flex items-center justify-center">
          <span class="material-symbols-outlined text-primary text-3xl font-bold" style="font-variation-settings: 'FILL' 1;">payments</span>
        </div>
        <div>
          <h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-slate-950 font-bold tracking-tight">Thanh toán & Báo cáo doanh thu</h2>
          <p class="font-body-sm text-body-sm text-slate-700">Tổng quan tài chính trung tâm</p>
        </div>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="flex border-b border-outline-variant/30 gap-6 mb-6">
      <button
        @click="activeTab = 'invoices'"
        :class="['pb-3 px-1 font-title-sm text-[15px] font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2', activeTab === 'invoices' ? 'border-primary-container text-primary-container' : 'border-transparent text-secondary hover:text-primary-container']"
      >
        <span class="material-symbols-outlined text-[20px]" :style="activeTab === 'invoices' ? 'font-variation-settings: \'FILL\' 1;' : ''">receipt_long</span>
        Lịch sử thanh toán
      </button>
      <button
        @click="activeTab = 'charts'"
        :class="['pb-3 px-1 font-title-sm text-[15px] font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2', activeTab === 'charts' ? 'border-primary-container text-primary-container' : 'border-transparent text-secondary hover:text-primary-container']"
      >
        <span class="material-symbols-outlined text-[20px]" :style="activeTab === 'charts' ? 'font-variation-settings: \'FILL\' 1;' : ''">monitoring</span>
        Báo cáo doanh thu
      </button>
      <button
        @click="activeTab = 'analytics'"
        :class="['pb-3 px-1 font-title-sm text-[15px] font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2', activeTab === 'analytics' ? 'border-primary-container text-primary-container' : 'border-transparent text-secondary hover:text-primary-container']"
      >
        <span class="material-symbols-outlined text-[20px]" :style="activeTab === 'analytics' ? 'font-variation-settings: \'FILL\' 1;' : ''">analytics</span>
        Thống kê vận hành & Học tập
      </button>
    </div>

    <!-- Tab 1: Invoices & KPIs -->
    <div v-if="activeTab === 'invoices'" class="space-y-stack-md">
      <!-- Stats Row -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <!-- Stat 1: Total Revenue -->
        <div class="glass-panel rounded-xl p-6 relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-primary-fixed-dim/20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div class="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p class="font-body-sm text-body-sm text-slate-700 mb-1">Tổng doanh thu</p>
              <h3 class="font-title-md text-title-md text-slate-950 text-2xl font-bold">{{ formatCurrency(totalRevenueTarget) }}</h3>
            </div>
            <div class="p-2 bg-white/60 rounded-lg shadow-sm border border-white/50 flex items-center justify-center">
              <span class="material-symbols-outlined text-slate-950" style="font-variation-settings: 'FILL' 1;">account_balance</span>
            </div>
          </div>
          <div class="flex items-center gap-1 text-xs text-emerald-600 relative z-10">
            <span class="material-symbols-outlined text-sm">trending_up</span>
            <span class="font-semibold">+{{ paymentCompletionRate }}%</span>
            <span class="text-slate-700 ml-1">tỉ lệ hoàn thành</span>
          </div>
        </div>

        <!-- Stat 2: Unpaid/Remaining Debt -->
        <div class="glass-panel rounded-xl p-6 relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-error-container/30 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div class="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p class="font-body-sm text-body-sm text-slate-700 mb-1">Chưa thanh toán</p>
              <h3 class="font-title-md text-title-md text-slate-950 text-2xl font-bold">{{ formatCurrency(dashboardStats.totalDebt) }}</h3>
            </div>
            <div class="p-2 bg-white/60 rounded-lg shadow-sm border border-white/50 flex items-center justify-center">
              <span class="material-symbols-outlined text-error" style="font-variation-settings: 'FILL' 1;">pending</span>
            </div>
          </div>
          <div class="flex items-center gap-1 text-xs text-rose-600 relative z-10">
            <span class="material-symbols-outlined text-sm">warning</span>
            <span class="font-semibold">Công nợ cần thu hồi</span>
          </div>
        </div>

        <!-- Stat 3: Received Payments -->
        <div class="glass-panel rounded-xl p-6 relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-100/40 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div class="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p class="font-body-sm text-body-sm text-slate-700 mb-1">Thực thu nhận</p>
              <h3 class="font-title-md text-title-md text-slate-950 text-2xl font-bold">{{ formatCurrency(dashboardStats.totalRevenue) }}</h3>
            </div>
            <div class="p-2 bg-white/60 rounded-lg shadow-sm border border-white/50 flex items-center justify-center">
              <span class="material-symbols-outlined text-emerald-600" style="font-variation-settings: 'FILL' 1;">check_circle</span>
            </div>
          </div>
          <div class="flex items-center gap-1 text-xs text-emerald-600 relative z-10">
            <span class="material-symbols-outlined text-sm">verified_user</span>
            <span class="font-semibold">Giao dịch đã khớp</span>
          </div>
        </div>

        <!-- Stat 4: Total Invoices count -->
        <div class="glass-panel rounded-xl p-6 relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-on-tertiary-container/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div class="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p class="font-body-sm text-body-sm text-slate-700 mb-1">Tổng số hóa đơn</p>
              <h3 class="font-title-md text-title-md text-slate-950 text-2xl font-bold">{{ totalPaymentsCount }}</h3>
            </div>
            <div class="p-2 bg-white/60 rounded-lg shadow-sm border border-white/50 flex items-center justify-center">
              <span class="material-symbols-outlined text-on-tertiary-container" style="font-variation-settings: 'FILL' 1;">receipt_long</span>
            </div>
          </div>
          <div class="flex items-center gap-1 text-xs text-slate-700 relative z-10">
            <span class="font-bold text-slate-950">{{ paymentsList.length }}</span>
            <span>hóa đơn đang hiển thị</span>
          </div>
        </div>
      </section>

      <!-- Invoices Table card -->
      <div class="glass-panel rounded-xl flex flex-col overflow-hidden">
        <!-- Table Filter Header -->
        <div class="p-6 border-b border-white/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 class="font-title-md text-title-md text-slate-950 font-bold">Lịch sử thanh toán</h3>
          <div class="flex flex-wrap gap-3 w-full sm:w-auto">
            <div class="glass-input rounded-lg px-3 py-2 flex items-center gap-2 w-full sm:w-auto min-w-[240px] relative pr-9">
              <span class="material-symbols-outlined text-slate-600 text-sm">search</span>
              <input
                :value="filters.search"
                @input="handleSearchInput"
                class="bg-transparent border-none focus:ring-0 text-sm p-0 w-full text-slate-950 placeholder:text-slate-600 focus:outline-none"
                placeholder="Tìm học viên, mã hóa đơn..."
                type="text"
              />
              <button
                v-if="filters.search"
                @click="filters.search = ''; fetchPayments();"
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center w-6 h-6 rounded-full hover:bg-primary-container/10"
              >
                <span class="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <div class="relative">
              <select
                :value="filters.status"
                @change="handleStatusChange"
                class="glass-input rounded-lg pl-3 pr-10 py-2 text-sm bg-transparent cursor-pointer appearance-none text-slate-950 focus:outline-none"
              >
                <option value="null">Tất cả trạng thái</option>
                <option value="HoanTat">Đã thanh toán</option>
                <option value="DangTT">Đóng một phần</option>
                <option value="ChuaTT">Chưa thanh toán</option>
              </select>
              <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none text-[18px]">expand_more</span>
            </div>
          </div>
        </div>

        <!-- Table Content -->
        <div class="overflow-x-auto">
          <div v-if="loadingPayments" class="p-12 space-y-4 animate-pulse">
            <div class="h-8 bg-surface-container-high rounded w-full"></div>
            <div class="h-12 bg-surface-container-high rounded w-full" v-for="i in 5" :key="i"></div>
          </div>
          <table v-else-if="paymentsList.length > 0" class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white/30 border-b border-white/50 text-slate-950 font-body-sm text-sm uppercase tracking-wider">
                <th class="p-4 font-bold text-slate-950 w-12 text-center">STT</th>
                <th class="p-4 font-bold text-slate-950">Mã phiếu</th>
                <th class="p-4 font-bold text-slate-950">Học viên</th>
                <th class="p-4 font-bold text-slate-950">Lớp học</th>
                <th class="p-4 font-bold text-slate-950 text-right">Tổng học phí</th>
                <th class="p-4 font-bold text-slate-950 text-right">Đã đóng</th>
                <th class="p-4 font-bold text-slate-950 text-right">Còn nợ</th>
                <th class="p-4 font-bold text-slate-950 text-center">Trạng thái</th>
                <th class="p-4 font-bold text-slate-950 text-center w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/30 font-body-sm text-on-surface">
              <tr v-for="(payment, index) in paymentsList" :key="payment.paymentId" class="table-row-hover transition-colors">
                <td class="p-4 text-center text-slate-950 font-medium">{{ (pagination.page - 1) * pagination.pageSize + index + 1 }}</td>
                <td class="p-4 font-mono text-[13px] font-bold text-slate-950">PAY-{{ String(payment.paymentId).padStart(4, '0') }}</td>
                <td class="p-4">
                  <div>
                    <p class="font-bold text-slate-950 leading-tight">{{ payment.studentName }}</p>
                    <p class="text-xs text-slate-600">ID: {{ payment.studentId }}</p>
                  </div>
                </td>
                <td class="p-4 text-slate-950 font-medium">{{ payment.className }}</td>
                <td class="p-4 text-right text-slate-950 font-bold">{{ formatCurrency(payment.totalAmount) }}</td>
                <td class="p-4 text-right text-slate-950 font-bold">{{ formatCurrency(payment.paidAmount) }}</td>
                <td class="p-4 text-right text-slate-950 font-bold">
                  {{ formatCurrency(payment.remainingAmount) }}
                </td>
                <td class="p-4 text-center">
                  <span :class="getStatusBadgeClass(payment.status)" class="inline-block px-2.5 py-1 rounded font-label-caps text-label-caps whitespace-nowrap border">
                    {{ getStatusLabel(payment.status) }}
                  </span>
                </td>
                <td class="p-4 text-center">
                  <div class="flex items-center justify-center gap-1.5">
                    <button
                      @click="openTransactionHistoryModal(payment)"
                      class="w-8.5 h-8.5 rounded-lg bg-primary-container/[0.05] hover:bg-primary-container/10 text-primary flex items-center justify-center transition-colors cursor-pointer"
                      title="Lịch sử đóng tiền"
                    >
                      <span class="material-symbols-outlined text-[18px]">history</span>
                    </button>
                    <button
                      v-if="payment.remainingAmount > 0"
                      @click="openManualPaymentModal(payment)"
                      class="w-8.5 h-8.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 flex items-center justify-center transition-colors cursor-pointer"
                      title="Đóng học phí"
                    >
                      <span class="material-symbols-outlined text-[18px]">price_check</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="p-12 text-center flex flex-col items-center justify-center bg-white/30">
            <span class="material-symbols-outlined text-primary-container/20 text-[64px] mb-4">receipt_long</span>
            <p class="text-body-lg text-on-surface-variant font-medium">Không tìm thấy hóa đơn nào phù hợp</p>
          </div>
        </div>

        <!-- Table Pagination Footer -->
        <div v-if="paymentsList.length > 0" class="p-4 border-t border-white/40 flex justify-between items-center text-sm text-slate-700 bg-white/10">
          <span>Hiển thị {{ (pagination.page - 1) * pagination.pageSize + 1 }} - {{ Math.min(pagination.page * pagination.pageSize, totalPaymentsCount) }} trong số {{ totalPaymentsCount }} hóa đơn</span>
          <div class="flex items-center gap-2">
            <button
              @click="prevPage"
              :disabled="pagination.page === 1"
              class="p-1.5 rounded hover:bg-white/60 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer border border-outline-variant/30 text-slate-950"
            >
              <span class="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <span class="px-3 font-bold text-slate-950">Trang {{ pagination.page }} / {{ totalInvoicesPages }}</span>
            <button
              @click="nextPage"
              :disabled="pagination.page >= totalInvoicesPages"
              class="p-1.5 rounded hover:bg-white/60 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer border border-outline-variant/30"
            >
              <span class="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: Financial Charts (Revenue Report) -->
    <div v-else-if="activeTab === 'charts'" class="space-y-stack-md">
      <!-- Filter controls -->
      <div class="flex justify-between items-center bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl p-4 shadow-sm">
        <h3 class="font-title-md text-title-md font-bold text-primary flex items-center gap-2">
          <span class="material-symbols-outlined text-on-tertiary-container">analytics</span>
          Bộ lọc báo cáo tài chính
        </h3>
        <div class="flex items-center gap-3">
          <label class="text-body-sm font-semibold text-secondary">Năm tài chính:</label>
          <div class="relative">
            <select
              :value="selectedYear"
              @change="handleYearChanged"
              class="glass-input rounded-lg pl-3 pr-10 py-1.5 text-sm bg-transparent cursor-pointer appearance-none text-primary font-bold focus:outline-none"
            >
              <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
            </select>
            <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-[16px]">expand_more</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <!-- Bar Chart (7 columns) -->
        <div class="lg:col-span-7 glass-panel rounded-xl p-6 flex flex-col h-[420px] relative">
          <div class="flex justify-between items-center mb-6 z-10">
            <div>
              <h3 class="font-title-md text-title-md text-primary font-bold">Doanh thu theo tháng</h3>
              <p class="text-body-xs text-secondary">Thống kê doanh thu thực nhận qua các tháng</p>
            </div>
            <span class="px-3 py-1 bg-primary/5 rounded-full font-mono text-[11px] font-bold text-primary border border-primary/10">Năm {{ selectedYear }}</span>
          </div>

          <div v-if="loadingCharts" class="flex-1 flex flex-col items-center justify-center">
            <span class="animate-spin inline-block w-8 h-8 border-4 border-on-tertiary-container border-t-transparent rounded-full"></span>
            <p class="mt-2 text-body-sm text-secondary">Đang tải báo cáo doanh thu...</p>
          </div>
          
          <div v-else class="flex-1 relative w-full flex items-end justify-between gap-1.5 sm:gap-3 px-2 pb-8 pt-4 border-b border-surface-variant/40">
            <!-- Grid Lines -->
            <div class="absolute inset-0 flex flex-col justify-between pb-8 z-0">
              <div class="border-t border-surface-variant/30 w-full" v-for="n in 5" :key="n"></div>
            </div>
            
            <!-- Y-Axis labels (Scale helper) -->
            <div class="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] text-secondary font-bold font-mono -ml-7 z-10 pr-2">
              <span>{{ formatKValue(maxChartValue) }}</span>
              <span>{{ formatKValue(maxChartValue * 0.75) }}</span>
              <span>{{ formatKValue(maxChartValue * 0.5) }}</span>
              <span>{{ formatKValue(maxChartValue * 0.25) }}</span>
              <span>0</span>
            </div>

            <!-- Chart Columns -->
            <div
              v-for="(val, idx) in monthlyValues"
              :key="idx"
              class="relative z-10 flex flex-col items-center w-full group h-full justify-end"
            >
              <!-- Bar -->
              <div
                class="w-8 sm:w-10 rounded-t transition-all duration-500 ease-out relative group-hover:scale-x-105"
                :class="[val > 0 ? (idx === currentMonthIndex ? 'bg-on-tertiary-container shadow-[0_0_12px_rgba(43,131,255,0.4)]' : 'bg-primary-container/70 group-hover:bg-primary-container') : 'bg-slate-200/40']"
                :style="{ height: (val > 0 ? Math.max((val / (maxChartValue || 1)) * 90, 5) : 2) + '%' }"
              >
                <!-- Tooltip on hover -->
                <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-bold shadow z-20">
                  {{ formatCurrency(val) }}
                </div>
              </div>
              <span class="absolute -bottom-6 text-[10px] sm:text-xs text-secondary font-medium font-body-sm">Th.{{ idx + 1 }}</span>
            </div>
          </div>
        </div>

        <!-- Conic doughnut representation (5 columns) -->
        <div class="lg:col-span-5 glass-panel rounded-xl p-6 flex flex-col h-[420px]">
          <div class="mb-4">
            <h3 class="font-title-md text-title-md text-primary font-bold">Đóng góp theo môn học</h3>
            <p class="text-body-xs text-secondary font-medium">Tỷ lệ cơ cấu doanh thu theo môn học</p>
          </div>

          <div v-if="loadingCharts" class="flex-1 flex flex-col items-center justify-center">
            <span class="animate-spin inline-block w-8 h-8 border-4 border-on-tertiary-container border-t-transparent rounded-full"></span>
          </div>

          <div v-else class="flex-1 flex flex-col items-center justify-center relative">
            <div v-if="coursesList.length > 0" class="w-full flex flex-col items-center">
              <!-- CSS Conic-Gradient Doughnut representation -->
              <div class="relative w-40 h-40 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-102" :style="doughnutStyle">
                <div class="w-28 h-28 bg-white/95 backdrop-blur-md rounded-full flex flex-col items-center justify-center shadow-inner">
                  <span class="text-[10px] text-secondary font-bold uppercase tracking-wider">Tổng cộng</span>
                  <span class="font-title-md text-title-md text-primary font-bold text-lg leading-tight">{{ formatShortRevenue(dashboardStats.totalRevenue) }}</span>
                </div>
              </div>

              <!-- Legends grid -->
              <div class="w-full mt-5 grid grid-cols-2 gap-2 text-xs overflow-y-auto max-h-[140px] pr-1">
                <div v-for="(c, i) in coursesList" :key="c.name" class="flex items-center justify-between border-b border-outline-variant/10 pb-1">
                  <div class="flex items-center gap-1.5 min-w-0">
                    <div class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: getDoughnutColor(i) }"></div>
                    <span class="text-secondary font-medium truncate" :title="c.name">{{ c.name }}</span>
                  </div>
                  <span class="font-bold text-primary shrink-0 ml-1">{{ getRevenuePercentage(c.revenue) }}%</span>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12 flex flex-col items-center justify-center h-full">
              <span class="material-symbols-outlined text-slate-300 text-[48px] mb-2">pie_chart</span>
              <p class="text-body-sm text-on-surface-variant font-medium">Không có dữ liệu đóng góp</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 3: Operations & Academic Analytics -->
    <div v-else-if="activeTab === 'analytics'" class="space-y-stack-md">
      <div v-if="loadingOps" class="flex flex-col items-center justify-center p-12 bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-sm rounded-xl">
        <span class="animate-spin inline-block w-8 h-8 border-4 border-on-tertiary-container border-t-transparent rounded-full"></span>
        <p class="mt-4 text-body-lg text-on-surface-variant font-medium">Đang tải dữ liệu thống kê vận hành & học tập...</p>
      </div>

      <div v-else class="space-y-6">
        <!-- KPI Cards row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          <!-- Avg Class Fill Rate -->
          <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div class="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined">groups</span>
            </div>
            <div>
              <div class="text-2xl font-bold text-primary">{{ Math.round(courseAnalytics.averageClassFillRate * 100) }}%</div>
              <div class="text-[12px] text-on-surface-variant font-medium">Tỷ lệ lấp đầy lớp học TB</div>
            </div>
          </div>

          <!-- Credits Available -->
          <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div class="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <div>
              <div class="text-2xl font-bold text-primary truncate max-w-[170px]" :title="formatCurrency(studentAnalytics.totalCreditsAvailable)">
                {{ formatShortRevenue(studentAnalytics.totalCreditsAvailable) }}
              </div>
              <div class="text-[12px] text-on-surface-variant font-medium">Số dư bảo lưu khả dụng</div>
            </div>
          </div>

          <!-- Credits Used -->
          <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div class="w-12 h-12 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined">shopping_bag</span>
            </div>
            <div>
              <div class="text-2xl font-bold text-primary truncate max-w-[170px]" :title="formatCurrency(studentAnalytics.totalCreditsUsed)">
                {{ formatShortRevenue(studentAnalytics.totalCreditsUsed) }}
              </div>
              <div class="text-[12px] text-on-surface-variant font-medium">Bảo lưu đã tiêu dùng</div>
            </div>
          </div>

          <!-- Total Waitlists Queue -->
          <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div class="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined">pending_actions</span>
            </div>
            <div>
              <div class="text-2xl font-bold text-primary">{{ totalWaitlistQueueCount }}</div>
              <div class="text-[12px] text-on-surface-variant font-medium">Học viên chờ xếp lớp</div>
            </div>
          </div>
        </div>

        <!-- Class Fill Rates & Waitlist Queue table details -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          <!-- Class Fill Rates List -->
          <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-6 lg:col-span-2 flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
            <div>
              <h3 class="font-title-md text-title-md font-bold text-primary flex items-center gap-2 mb-2">
                <span class="material-symbols-outlined text-on-tertiary-container">done_all</span>
                Tỷ lệ lấp đầy của các lớp học
              </h3>
              <p class="text-body-sm text-on-surface-variant mb-4">Sĩ số thực tế so với sĩ số tối đa của các lớp học</p>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse" v-if="courseAnalytics.classFillRates && courseAnalytics.classFillRates.length > 0">
                <thead>
                  <tr class="bg-surface-container-high text-body-xs font-semibold text-on-surface-variant uppercase">
                    <th class="py-3 px-4 rounded-l-lg">Tên lớp</th>
                    <th class="py-3 px-4">Môn học</th>
                    <th class="py-3 px-4 text-center">Sĩ số (Học viên)</th>
                    <th class="py-3 px-4 text-right rounded-r-lg" style="width: 180px;">Tỷ lệ lấp đầy</th>
                  </tr>
                </thead>
                <tbody class="text-body-sm text-on-surface">
                  <tr v-for="c in courseAnalytics.classFillRates" :key="c.classId" class="border-t border-outline-variant/20 hover:bg-white/40 transition-colors">
                    <td class="py-3 px-4 font-semibold text-primary">Lớp {{ c.classId }} - {{ c.className }}</td>
                    <td class="py-3 px-4 text-on-surface-variant">{{ c.courseName }}</td>
                    <td class="py-3 px-4 text-center font-bold">{{ c.currentStudents }} / {{ c.maxStudents }}</td>
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-2 justify-end">
                        <div class="w-24 bg-slate-200 rounded-full h-2 overflow-hidden border">
                          <div :class="['h-full rounded-full', getFillRateProgressColor(c.fillRate)]" :style="{ width: (c.fillRate * 100) + '%' }"></div>
                        </div>
                        <span class="font-bold text-xs" :class="getFillRateTextColor(c.fillRate)">{{ Math.round(c.fillRate * 100) }}%</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="text-center py-8">
                <p class="text-body-sm text-on-surface-variant">Không có dữ liệu lớp học nào.</p>
              </div>
            </div>
          </div>

          <!-- Waitlist Queue -->
          <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-6 flex flex-col transition-all duration-300 hover:shadow-lg">
            <div>
              <h3 class="font-title-md text-title-md font-bold text-primary flex items-center gap-2 mb-2">
                <span class="material-symbols-outlined text-amber-500">hourglass_top</span>
                Hàng chờ môn học
              </h3>
              <p class="text-body-sm text-on-surface-variant mb-4">Học viên đăng ký đang chờ mở lớp</p>
            </div>
            <div class="overflow-y-auto max-h-[300px] flex-1 pr-1">
              <div v-if="studentAnalytics.waitlists && studentAnalytics.waitlists.length > 0" class="divide-y divide-outline-variant/20">
                <div v-for="w in studentAnalytics.waitlists" :key="w.courseId" class="py-3 flex justify-between items-center">
                  <div class="min-w-0 flex-1 pr-2">
                    <div class="font-semibold text-body-sm text-on-surface truncate">{{ w.courseName }}</div>
                    <div class="text-[11px] text-on-surface-variant">Mã môn học #{{ w.courseId }}</div>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="px-2.5 py-1 rounded bg-amber-500/10 text-amber-700 text-xs font-bold border border-amber-500/20">
                      {{ w.queueCount }} học viên
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-12 flex flex-col items-center justify-center h-full">
                <span class="material-symbols-outlined text-slate-300 text-[48px] mb-2">check_circle</span>
                <p class="text-body-sm text-on-surface-variant">Không có học viên nào trong hàng chờ.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Teacher Workload & Academic Warnings -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          <!-- Teacher Workload -->
          <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-6 flex flex-col transition-all duration-300 hover:shadow-lg">
            <div>
              <h3 class="font-title-md text-title-md font-bold text-primary flex items-center gap-2 mb-2">
                <span class="material-symbols-outlined text-purple-600 font-bold">work</span>
                Tải công việc giáo viên
              </h3>
              <p class="text-body-sm text-on-surface-variant mb-4">Số lượng lớp phụ trách và tổng số buổi dạy</p>
            </div>
            <div class="overflow-y-auto max-h-[350px] flex-1 pr-1">
              <table class="w-full text-left border-collapse" v-if="courseAnalytics.teacherWorkloads && courseAnalytics.teacherWorkloads.length > 0">
                <thead>
                  <tr class="bg-surface-container-high text-body-xs font-semibold text-on-surface-variant uppercase">
                    <th class="py-2 px-3 rounded-l-lg">Giáo viên</th>
                    <th class="py-2 px-3 text-center">Số lớp</th>
                    <th class="py-2 px-3 text-right rounded-r-lg">Số buổi</th>
                  </tr>
                </thead>
                <tbody class="text-body-sm text-on-surface">
                  <tr v-for="t in courseAnalytics.teacherWorkloads" :key="t.teacherId" class="border-t border-outline-variant/15 hover:bg-white/30 transition-colors">
                    <td class="py-3 px-3 font-semibold text-on-surface">{{ t.teacherName }}</td>
                    <td class="py-3 px-3 text-center font-bold text-purple-600">{{ t.classCount }} lớp</td>
                    <td class="py-3 px-3 text-right font-bold text-primary">{{ t.totalSessions }} buổi</td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="text-center py-8">
                <p class="text-body-sm text-on-surface-variant">Không có dữ liệu giáo viên.</p>
              </div>
            </div>
          </div>

          <!-- Academic Warnings -->
          <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-6 lg:col-span-2 flex flex-col transition-all duration-300 hover:shadow-lg">
            <div>
              <h3 class="font-title-md text-title-md font-bold text-rose-600 flex items-center gap-2 mb-2">
                <span class="material-symbols-outlined text-rose-600">warning</span>
                Cảnh báo chuyên cần (Thấp)
              </h3>
              <p class="text-body-sm text-on-surface-variant mb-4">Học viên nghỉ học >= 2 buổi hoặc tỉ lệ đi học dưới 80%</p>
            </div>
            <div class="overflow-x-auto flex-1">
              <table class="w-full text-left border-collapse" v-if="studentAnalytics.academicWarnings && studentAnalytics.academicWarnings.length > 0">
                <thead>
                  <tr class="bg-surface-container-high text-body-xs font-semibold text-on-surface-variant uppercase">
                    <th class="py-2 px-3 rounded-l-lg">Học viên</th>
                    <th class="py-2 px-3">Lớp học</th>
                    <th class="py-2 px-3 text-center">Nghỉ học</th>
                    <th class="py-2 px-3 text-center">Đi muộn</th>
                    <th class="py-2 px-3 text-right rounded-r-lg">Tỉ lệ đi học</th>
                  </tr>
                </thead>
                <tbody class="text-body-sm text-on-surface">
                  <tr v-for="w in studentAnalytics.academicWarnings" :key="w.studentId + '-' + w.classId" class="border-t border-outline-variant/15 hover:bg-rose-500/[0.02] transition-colors">
                    <td class="py-3 px-3 font-semibold text-on-surface">{{ w.studentName }}</td>
                    <td class="py-3 px-3 text-on-surface-variant">{{ w.className }}</td>
                    <td class="py-3 px-3 text-center"><span class="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 font-bold border border-rose-500/20">{{ w.absentCount }} buổi</span></td>
                    <td class="py-3 px-3 text-center font-semibold text-amber-600">{{ w.lateCount }} buổi</td>
                    <td class="py-3 px-3 text-right font-bold text-rose-600">{{ Math.round(w.attendanceRate * 100) }}%</td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="text-center py-12 flex flex-col items-center justify-center h-full">
                <span class="material-symbols-outlined text-emerald-500 text-[48px] mb-2">check_circle</span>
                <p class="text-body-sm text-emerald-600 font-medium">Không có học viên nào bị cảnh báo chuyên cần.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal 1: Ghi nhận thanh toán thủ công -->
    <teleport to="body">
      <div v-if="manualPaymentModal" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-md w-full overflow-hidden animate-scale-in flex flex-col">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
            <h3 class="font-title-md text-title-md font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-on-tertiary-container">price_check</span>
              Ghi nhận thanh toán thủ công
            </h3>
            <button @click="manualPaymentModal = false" class="text-on-surface-variant hover:text-primary cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-4">
            <div class="bg-primary-container/[0.03] p-4 rounded-xl border border-outline-variant/20 text-body-sm space-y-2">
              <div>Hóa đơn: <strong class="text-primary">PAY-{{ String(selectedPaymentForAction?.paymentId).padStart(4,'0') }}</strong></div>
              <div>Học viên: <span class="font-semibold text-on-surface">{{ selectedPaymentForAction?.studentName }}</span></div>
              <div>Học phí môn học: <span class="font-semibold text-on-surface">{{ formatCurrency(selectedPaymentForAction?.totalAmount) }}</span></div>
              <div class="flex justify-between border-t border-outline-variant/20 pt-2 text-[13px]">
                <span>Đã đóng: <strong class="text-emerald-600 font-bold">{{ formatCurrency(selectedPaymentForAction?.paidAmount) }}</strong></span>
                <span>Còn thiếu: <strong class="text-error font-bold">{{ formatCurrency(selectedPaymentForAction?.remainingAmount) }}</strong></span>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <!-- Amount to Pay -->
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary">Số tiền thanh toán (VND)</label>
                <div class="w-full bg-primary-container/[0.05] border border-primary-container/10 px-4 py-2.5 rounded-lg text-body-sm text-primary font-bold flex items-center justify-between">
                  <span>{{ formatCurrency(selectedPaymentForAction?.remainingAmount) }}</span>
                  <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold">Thanh toán 100%</span>
                </div>
              </div>
              
              <!-- Method select -->
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary">Phương thức thanh toán *</label>
                <div class="relative">
                  <select
                    v-model="transactionForm.paymentMethod"
                    class="w-full bg-primary-container/[0.05] border border-primary-container/10 appearance-none px-4 py-2.5 rounded-lg text-body-sm text-primary bg-transparent cursor-pointer focus:outline-none focus:border-on-tertiary-container/30"
                  >
                    <option value="TienMat">Tiền mặt</option>
                    <option value="ChuyenKhoan">Chuyển khoản ngân hàng</option>
                    <option value="TheTD">Thẻ tín dụng</option>
                  </select>
                  <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
              </div>

              <!-- Notes -->
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary">Ghi chú giao dịch</label>
                <input
                  v-model="transactionForm.note"
                  type="text"
                  class="w-full bg-primary-container/[0.05] border border-primary-container/10 px-4 py-2.5 rounded-lg text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container/30"
                  placeholder="Ghi chú đóng tiền"
                />
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 border-t border-outline-variant/20 flex justify-end gap-3 bg-surface/30">
            <button
              @click="manualPaymentModal = false"
              class="px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-semibold text-[13px] hover:bg-white/40 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              @click="submitManualPayment"
              :disabled="submitting || !transactionForm.amount || transactionForm.amount <= 0"
              class="px-5 py-2.5 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <span v-if="submitting" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Ghi nhận đóng tiền
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Modal 2: Lịch sử giao dịch của phiếu thu -->
    <teleport to="body">
      <div v-if="transactionHistoryModal" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-xl w-full overflow-hidden animate-scale-in flex flex-col">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
            <h3 class="font-title-md text-title-md font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-on-tertiary-container">history</span>
              Lịch sử giao dịch: PAY-{{ String(selectedPaymentForAction?.paymentId).padStart(4,'0') }}
            </h3>
            <button @click="transactionHistoryModal = false" class="text-on-surface-variant hover:text-primary cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-4 overflow-y-auto max-h-[50vh]">
            <div v-if="loadingHistory" class="text-center py-8">
              <span class="animate-spin inline-block w-8 h-8 border-4 border-on-tertiary-container border-t-transparent rounded-full"></span>
              <p class="mt-2 text-body-sm text-secondary">Đang tải lịch sử giao dịch...</p>
            </div>
            
            <div v-else-if="transactionHistory.length > 0" class="space-y-3">
              <div
                v-for="t in transactionHistory"
                :key="t.transactionId"
                class="bg-white/60 border border-white/40 shadow-sm p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-lg text-emerald-600">+{{ formatCurrency(t.amount) }}</span>
                    <span class="px-2 py-0.5 rounded bg-surface border border-outline-variant/20 text-[10px] font-semibold uppercase text-on-surface">
                      {{ getMethodLabel(t.paymentMethod) }}
                    </span>
                  </div>
                  <div class="text-[11px] text-on-surface-variant mt-1">Giao dịch: {{ formatDate(t.paidAt) }} | Người duyệt: {{ t.receivedByName || 'Hệ thống' }}</div>
                  <div class="text-body-sm text-on-surface mt-1.5 italic" v-if="t.note">
                    "{{ t.note }}"
                  </div>
                </div>
                <span class="text-[10px] font-mono text-on-surface-variant bg-surface/60 px-2 py-1 rounded">
                  TX-{{ String(t.transactionId).padStart(4, '0') }}
                </span>
              </div>
            </div>

            <div v-else class="text-center py-12 bg-white/30 rounded-xl border border-outline-variant/20">
              <span class="material-symbols-outlined text-outline/30 text-[48px] mb-2">payments</span>
              <p class="text-body-sm text-on-surface-variant font-medium">Chưa có giao dịch nào cho hóa đơn này.</p>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 border-t border-outline-variant/20 flex justify-end bg-surface/30">
            <button
              @click="transactionHistoryModal = false"
              class="px-5 py-2.5 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:bg-primary transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch } from 'vue'
import api from '../../services/api'

const showSnackbar = inject('showSnackbar')

const activeTab = ref('invoices')

// ----------------------------------------------------
// DASHBOARD & STATS & CHARTS STATE
// ----------------------------------------------------
const loadingStats = ref(false)
const loadingCharts = ref(false)
const loadingOps = ref(false)

const dashboardStats = ref({
  totalRevenue: 0,
  totalDebt: 0,
  totalPayments: 0
})

const paymentCompletionRate = computed(() => {
  const total = Number(dashboardStats.value.totalRevenue) + Number(dashboardStats.value.totalDebt)
  if (total === 0) return 0
  return Math.round((Number(dashboardStats.value.totalRevenue) / total) * 100)
})

const totalRevenueTarget = computed(() => {
  return Number(dashboardStats.value.totalRevenue) + Number(dashboardStats.value.totalDebt)
})

const currentYearVal = new Date().getFullYear()
const selectedYear = ref(currentYearVal)
const availableYears = ref([currentYearVal - 2, currentYearVal - 1, currentYearVal, currentYearVal + 1])
const monthlyValues = ref(Array(12).fill(0))
const coursesList = ref([])

const maxChartValue = computed(() => {
  const max = Math.max(...monthlyValues.value)
  return max > 0 ? max : 10000000 // default to 10M if all zero
})

const currentMonthIndex = computed(() => new Date().getMonth())

// Conic-gradient generator for course contribution doughnut chart
const doughnutStyle = computed(() => {
  let accumulated = 0
  const total = coursesList.value.reduce((acc, curr) => acc + Number(curr.revenue), 0)
  if (total === 0) return { background: '#d9dadb' }

  const segments = coursesList.value.map((c, i) => {
    const percentage = (Number(c.revenue) / total) * 100
    const start = accumulated
    const end = accumulated + percentage
    accumulated = end
    const color = getDoughnutColor(i)
    return `${color} ${start}% ${end}%`
  })
  return {
    background: `conic-gradient(${segments.join(', ')})`
  }
})

function getDoughnutColor(index) {
  const colors = [
    '#001f3f', // Deep navy
    '#2b83ff', // Royal blue
    '#afc8f0', // Soft blue
    '#c4c6cf', // Gray outline
    '#5d5f5f', // Secondary gray
    '#ba1a1a'  // Error red
  ]
  return colors[index % colors.length]
}

function getRevenuePercentage(val) {
  const total = coursesList.value.reduce((acc, curr) => acc + Number(curr.revenue), 0)
  if (total === 0) return 0
  return Math.round((Number(val) / total) * 100)
}

// ----------------------------------------------------
// INVOICES LIST & SEARCH & FILTERS
// ----------------------------------------------------
const loadingPayments = ref(false)
const paymentsList = ref([])
const totalPaymentsCount = ref(0)

const filters = ref({
  search: '',
  status: null
})

const pagination = ref({
  page: 1,
  pageSize: 10
})

const totalInvoicesPages = computed(() => Math.ceil(totalPaymentsCount.value / pagination.value.pageSize) || 1)

let debounceTimer = null

function handleSearchInput(e) {
  filters.value.search = e.target.value
  pagination.value.page = 1
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fetchPayments, 300)
}

function handleStatusChange(e) {
  const val = e.target.value
  filters.value.status = (val === 'null' || !val) ? null : val
  pagination.value.page = 1
  fetchPayments()
}

async function fetchPayments() {
  loadingPayments.value = true
  try {
    const { data } = await api.get('/api/v1/payments', {
      params: {
        search: filters.value.search || undefined,
        status: filters.value.status || undefined,
        page: pagination.value.page,
        pageSize: pagination.value.pageSize
      }
    })
    paymentsList.value = data.items || []
    totalPaymentsCount.value = data.totalCount || 0
  } catch (e) {
    showSnackbar('Không thể tải danh sách hóa đơn học phí', 'error')
  } finally {
    loadingPayments.value = false
  }
}

function prevPage() {
  if (pagination.value.page > 1) {
    pagination.value.page--
    fetchPayments()
  }
}

function nextPage() {
  if (pagination.value.page < totalInvoicesPages.value) {
    pagination.value.page++
    fetchPayments()
  }
}

// ----------------------------------------------------
// DATA LOADING FUNCTIONS
// ----------------------------------------------------
async function fetchDashboardStats() {
  loadingStats.value = true
  try {
    const { data } = await api.get('/api/v1/reports/dashboard')
    dashboardStats.value = {
      totalRevenue: data.totalRevenue || 0,
      totalDebt: data.totalDebt || 0,
      totalPayments: data.totalPayments || 0
    }
  } catch (e) {
    showSnackbar('Lỗi tải dữ liệu báo cáo thống kê', 'error')
  } finally {
    loadingStats.value = false
  }
}

async function fetchChartsData() {
  loadingCharts.value = true
  try {
    const { data: reportData } = await api.get('/api/v1/reports/revenue', {
      params: { year: selectedYear.value }
    })
    const monthlyRevenues = reportData.monthlyRevenues || []
    const newMonthlyValues = Array(12).fill(0)
    
    monthlyRevenues.forEach(item => {
      const idx = item.month - 1
      if (idx >= 0 && idx < 12) {
        newMonthlyValues[idx] = item.revenue
      }
    })
    monthlyValues.value = newMonthlyValues

    // Fetch payments to group share per course
    const { data: paymentData } = await api.get('/api/v1/payments', {
      params: { page: 1, pageSize: 1000 }
    })
    const payments = paymentData.items || []
    const courseGroups = {}
    
    payments.forEach(p => {
      const courseName = p.courseName || 'Khác'
      if (!courseGroups[courseName]) {
        courseGroups[courseName] = { revenue: 0, debt: 0 }
      }
      courseGroups[courseName].revenue += Number(p.paidAmount || 0)
      courseGroups[courseName].debt += Number(p.remainingAmount || 0)
    })

    coursesList.value = Object.keys(courseGroups).map(name => ({
      name,
      revenue: courseGroups[name].revenue,
      debt: courseGroups[name].debt
    })).sort((a, b) => b.revenue - a.revenue) // Sort by descending revenue
  } catch (e) {
    console.error('Lỗi tải dữ liệu biểu đồ:', e)
  } finally {
    loadingCharts.value = false
  }
}

function handleYearChanged(e) {
  selectedYear.value = Number(e.target.value)
  fetchChartsData()
}

// Operational analytics data
const courseAnalytics = ref({
  averageClassFillRate: 0,
  classFillRates: [],
  teacherWorkloads: []
})
const studentAnalytics = ref({
  waitlists: [],
  totalCreditsAvailable: 0,
  totalCreditsUsed: 0,
  totalCreditsRefunded: 0,
  academicWarnings: []
})

const totalWaitlistQueueCount = computed(() => {
  if (!studentAnalytics.value.waitlists) return 0
  return studentAnalytics.value.waitlists.reduce((acc, curr) => acc + (curr.queueCount || 0), 0)
})

async function fetchOperationsAnalytics() {
  loadingOps.value = true
  try {
    const [courseRes, studentRes] = await Promise.all([
      api.get('/api/v1/classes/analytics'),
      api.get('/api/v1/enrollments/analytics')
    ])
    courseAnalytics.value = courseRes.data || { averageClassFillRate: 0, classFillRates: [], teacherWorkloads: [] }
    studentAnalytics.value = studentRes.data || { waitlists: [], totalCreditsAvailable: 0, totalCreditsUsed: 0, totalCreditsRefunded: 0, academicWarnings: [] }
  } catch (e) {
    console.error('Lỗi tải dữ liệu thống kê vận hành:', e)
  } finally {
    loadingOps.value = false
  }
}

// ----------------------------------------------------
// MODAL 1: MANUAL TRANSACTION RECORDING
// ----------------------------------------------------
const manualPaymentModal = ref(false)
const selectedPaymentForAction = ref(null)
const submitting = ref(false)
const transactionForm = ref({
  amount: 0,
  paymentMethod: 'TienMat',
  note: ''
})

function openManualPaymentModal(payment) {
  selectedPaymentForAction.value = payment
  transactionForm.value = {
    amount: payment.remainingAmount,
    paymentMethod: 'TienMat',
    note: `Thu học phí môn học lớp ${payment.className}`
  }
  manualPaymentModal.value = true
}

async function submitManualPayment() {
  if (!selectedPaymentForAction.value) return
  submitting.value = true
  try {
    const id = selectedPaymentForAction.value.paymentId
    await api.post(`/api/v1/payments/${id}/transactions`, {
      amount: Number(transactionForm.value.amount),
      paymentMethod: transactionForm.value.paymentMethod,
      note: transactionForm.value.note || null
    })
    
    showSnackbar('Ghi nhận giao dịch đóng tiền thành công', 'success')
    manualPaymentModal.value = false
    
    // Refresh all data
    fetchPayments()
    fetchDashboardStats()
    fetchChartsData()
  } catch (e) {
    showSnackbar(e.response?.data?.message || 'Lỗi ghi nhận đóng tiền thủ công', 'error')
  } finally {
    submitting.value = false
  }
}

// ----------------------------------------------------
// MODAL 2: TRANSACTION HISTORY
// ----------------------------------------------------
const transactionHistoryModal = ref(false)
const loadingHistory = ref(false)
const transactionHistory = ref([])

async function openTransactionHistoryModal(payment) {
  selectedPaymentForAction.value = payment
  transactionHistoryModal.value = true
  loadingHistory.value = true
  transactionHistory.value = []
  try {
    const id = payment.paymentId
    const { data } = await api.get(`/api/v1/payments/${id}/transactions`)
    transactionHistory.value = data || []
  } catch (error) {
    showSnackbar('Lỗi tải lịch sử giao dịch', 'error')
  } finally {
    loadingHistory.value = false
  }
}

// ----------------------------------------------------
// FORMATTERS & CLASS MAPS
// ----------------------------------------------------
function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '0 đ'
  return amount.toLocaleString('vi-VN') + ' đ'
}

function formatShortRevenue(amount) {
  if (!amount) return '0 đ'
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'M'
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(0) + 'K'
  }
  return amount + ' đ'
}

function formatKValue(amount) {
  if (!amount) return '0'
  return (amount / 1000000).toFixed(0) + 'M'
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
}

function getStatusLabel(status) {
  const map = { HoanTat: 'Đã thanh toán', DangTT: 'Đóng một phần', ChuaTT: 'Chưa thanh toán' }
  return map[status] || status
}

function getStatusBadgeClass(status) {
  const map = {
    HoanTat: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    DangTT: 'bg-amber-100 text-amber-700 border-amber-300',
    ChuaTT: 'bg-red-100 text-red-700 border-red-300'
  }
  return map[status] || 'bg-slate-100 text-slate-700 border-slate-300'
}

function getMethodLabel(method) {
  const map = { TienMat: 'Tiền mặt', ChuyenKhoan: 'Chuyển khoản', TheTD: 'Thẻ tín dụng' }
  return map[method] || method
}

function getFillRateProgressColor(rate) {
  if (rate >= 0.8) return 'bg-emerald-500'
  if (rate >= 0.5) return 'bg-blue-500'
  return 'bg-amber-500'
}

function getFillRateTextColor(rate) {
  if (rate >= 0.8) return 'text-emerald-600'
  if (rate >= 0.5) return 'text-blue-600'
  return 'text-amber-600'
}

onMounted(() => {
  fetchDashboardStats()
  fetchPayments()
  fetchChartsData()
  fetchOperationsAnalytics()
})
</script>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 12px 24px rgba(0, 6, 19, 0.05);
}
.glass-input {
  background: rgba(0, 31, 63, 0.05);
  border: 1px solid rgba(0, 31, 63, 0.1);
  transition: all 0.3s ease;
}
.glass-input:focus {
  border-color: #2b83ff;
  box-shadow: 0 0 0 2px rgba(43, 131, 255, 0.2);
}
.table-row-hover:hover {
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(43, 131, 255, 0.05);
}
*:not(.material-symbols-outlined) {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
}
</style>
