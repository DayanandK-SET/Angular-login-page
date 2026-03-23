// import { Component, inject, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AdminService } from '../Services/admin.service';
// import { AdminCreatorDto, AdminSurveyDto } from '../models/admin.models';
// import { TokenService } from '../Services/token.service';

// type ActiveTab = 'creators' | 'surveys';

// @Component({
//   selector: 'app-admin-dashboard',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './admin-dashboard.html',
//   styleUrl: './admin-dashboard.css'
// })
// export class AdminDashboard {

//   private adminService = inject(AdminService);
//   private tokenService = inject(TokenService);

//   activeTab = signal<ActiveTab>('creators');

//   // ── Creators ─────────────────────────────────────
//   creators = signal<AdminCreatorDto[]>([]);
//   creatorsLoading = signal(true);
//   creatorsError = signal('');

//   // ── Surveys ───────────────────────────────────────
//   surveys = signal<AdminSurveyDto[]>([]);
//   surveysLoading = signal(true);
//   surveysError = signal('');

//   // ── Delete ────────────────────────────────────────
//   showDeleteModal = signal(false);
//   deleteTarget = signal<{ type: 'creator' | 'survey'; id: number; name: string } | null>(null);
//   isDeleting = signal(false);
//   deleteError = signal('');

//   // ── Admin info ────────────────────────────────────
//   adminUsername = signal<string | null>(null);

//   constructor() {
//     this.adminUsername.set(this.tokenService.getUsername());
//     this.loadCreators();
//     this.loadSurveys();
//   }

//   // ── Load ──────────────────────────────────────────

//   loadCreators() {
//     this.creatorsLoading.set(true);
//     this.creatorsError.set('');
//     this.adminService.getAllCreators().subscribe({
//       next: (data) => {
//         this.creators.set(data);
//         this.creatorsLoading.set(false);
//       },
//       error: () => {
//         this.creatorsError.set('Failed to load creators.');
//         this.creatorsLoading.set(false);
//       }
//     });
//   }

//   loadSurveys() {
//     this.surveysLoading.set(true);
//     this.surveysError.set('');
//     this.adminService.getAllSurveys().subscribe({
//       next: (data) => {
//         this.surveys.set(data);
//         this.surveysLoading.set(false);
//       },
//       error: () => {
//         this.surveysError.set('Failed to load surveys.');
//         this.surveysLoading.set(false);
//       }
//     });
//   }

//   // ── Tabs ──────────────────────────────────────────

//   setTab(tab: ActiveTab) {
//     this.activeTab.set(tab);
//   }

//   // ── Stats ─────────────────────────────────────────

//   get totalCreators(): number { return this.creators().length; }
//   get totalSurveys(): number  { return this.surveys().length; }
//   get activeSurveys(): number { return this.surveys().filter(s => s.isActive).length; }

//   // ── Delete Modal ──────────────────────────────────

//   openDeleteModal(type: 'creator' | 'survey', id: number, name: string) {
//     this.deleteTarget.set({ type, id, name });
//     this.deleteError.set('');
//     this.showDeleteModal.set(true);
//   }

//   closeDeleteModal() {
//     this.showDeleteModal.set(false);
//     this.deleteTarget.set(null);
//     this.deleteError.set('');
//   }

//   confirmDelete() {
//     const target = this.deleteTarget();
//     if (!target) return;

//     this.isDeleting.set(true);
//     this.deleteError.set('');

//     const request = target.type === 'creator'
//       ? this.adminService.deleteCreator(target.id)
//       : this.adminService.deleteSurvey(target.id);

//     request.subscribe({
//       next: () => {
//         if (target.type === 'creator') {
//           this.creators.update(list => list.filter(c => c.id !== target.id));
//         } else {
//           this.surveys.update(list => list.filter(s => s.id !== target.id));
//         }
//         this.isDeleting.set(false);
//         this.closeDeleteModal();
//       },
//       error: () => {
//         this.deleteError.set('Delete failed. Please try again.');
//         this.isDeleting.set(false);
//       }
//     });
//   }

//   // ── Search ────────────────────────────────────────
//   creatorSearch = '';
//   surveySearch = '';

//   get filteredCreators(): AdminCreatorDto[] {
//     const q = this.creatorSearch.toLowerCase().trim();
//     if (!q) return this.creators();
//     return this.creators().filter(c =>
//       c.username.toLowerCase().includes(q) ||
//       c.email.toLowerCase().includes(q)
//     );
//   }

//   get filteredSurveys(): AdminSurveyDto[] {
//     const q = this.surveySearch.toLowerCase().trim();
//     if (!q) return this.surveys();
//     return this.surveys().filter(s =>
//       s.title.toLowerCase().includes(q) ||
//       s.creator.toLowerCase().includes(q)
//     );
//   }
// }


// import { Component, inject, signal } from '@angular/core';
// import { CommonModule, DatePipe } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AdminService } from '../Services/admin.service';
// import { AdminCreatorDto, AdminSurveyDto, AuditLogDto } from '../models/admin.models';
// import { TokenService } from '../Services/token.service';

// type ActiveTab = 'creators' | 'surveys' | 'auditLogs';

// @Component({
//   selector: 'app-admin-dashboard',
//   imports: [CommonModule, FormsModule, DatePipe],
//   templateUrl: './admin-dashboard.html',
//   styleUrl: './admin-dashboard.css'
// })
// export class AdminDashboard {

//   private adminService = inject(AdminService);
//   private tokenService = inject(TokenService);

//   activeTab = signal<ActiveTab>('creators');

//   // ── Creators ─────────────────────────────────────
//   creators = signal<AdminCreatorDto[]>([]);
//   creatorsLoading = signal(true);
//   creatorsError = signal('');

//   // ── Surveys ───────────────────────────────────────
//   surveys = signal<AdminSurveyDto[]>([]);
//   surveysLoading = signal(true);
//   surveysError = signal('');

//   // ── Audit Logs ────────────────────────────────────
//   auditLogs = signal<AuditLogDto[]>([]);
//   auditLogsLoading = signal(false);
//   auditLogsError = signal('');
//   auditLogSearch = '';

//   // ── Delete ────────────────────────────────────────
//   showDeleteModal = signal(false);
//   deleteTarget = signal<{ type: 'creator' | 'survey'; id: number; name: string } | null>(null);
//   isDeleting = signal(false);
//   deleteError = signal('');

//   // ── Admin info ────────────────────────────────────
//   adminUsername = signal<string | null>(null);

//   constructor() {
//     this.adminUsername.set(this.tokenService.getUsername());
//     this.loadCreators();
//     this.loadSurveys();
//   }

//   // ── Load ──────────────────────────────────────────

//   loadCreators() {
//     this.creatorsLoading.set(true);
//     this.creatorsError.set('');
//     this.adminService.getAllCreators().subscribe({
//       next: (data) => {
//         this.creators.set(data);
//         this.creatorsLoading.set(false);
//       },
//       error: () => {
//         this.creatorsError.set('Failed to load creators.');
//         this.creatorsLoading.set(false);
//       }
//     });
//   }

//   loadSurveys() {
//     this.surveysLoading.set(true);
//     this.surveysError.set('');
//     this.adminService.getAllSurveys().subscribe({
//       next: (data) => {
//         this.surveys.set(data);
//         this.surveysLoading.set(false);
//       },
//       error: () => {
//         this.surveysError.set('Failed to load surveys.');
//         this.surveysLoading.set(false);
//       }
//     });
//   }

//   // ✅ NEW: load audit logs — called only when the tab is opened
//   loadAuditLogs() {
//     this.auditLogsLoading.set(true);
//     this.auditLogsError.set('');
//     this.adminService.getAuditLogs().subscribe({
//       next: (data) => {
//         this.auditLogs.set(data);
//         this.auditLogsLoading.set(false);
//       },
//       error: () => {
//         this.auditLogsError.set('Failed to load audit logs.');
//         this.auditLogsLoading.set(false);
//       }
//     });
//   }

//   // ── Tabs ──────────────────────────────────────────

//   setTab(tab: ActiveTab) {
//     this.activeTab.set(tab);
//     // Only fetch audit logs when the tab is first opened
//     if (tab === 'auditLogs' && this.auditLogs().length === 0 && !this.auditLogsLoading()) {
//       this.loadAuditLogs();
//     }
//   }

//   // ── Stats ─────────────────────────────────────────

//   get totalCreators(): number { return this.creators().length; }
//   get totalSurveys(): number  { return this.surveys().length; }
//   get activeSurveys(): number { return this.surveys().filter(s => s.isActive).length; }

//   // ── Delete Modal ──────────────────────────────────

//   openDeleteModal(type: 'creator' | 'survey', id: number, name: string) {
//     this.deleteTarget.set({ type, id, name });
//     this.deleteError.set('');
//     this.showDeleteModal.set(true);
//   }

//   closeDeleteModal() {
//     this.showDeleteModal.set(false);
//     this.deleteTarget.set(null);
//     this.deleteError.set('');
//   }

//   confirmDelete() {
//     const target = this.deleteTarget();
//     if (!target) return;

//     this.isDeleting.set(true);
//     this.deleteError.set('');

//     const request = target.type === 'creator'
//       ? this.adminService.deleteCreator(target.id)
//       : this.adminService.deleteSurvey(target.id);

//     request.subscribe({
//       next: () => {
//         if (target.type === 'creator') {
//           this.creators.update(list => list.filter(c => c.id !== target.id));
//         } else {
//           this.surveys.update(list => list.filter(s => s.id !== target.id));
//         }
//         this.isDeleting.set(false);
//         this.closeDeleteModal();
//       },
//       error: () => {
//         this.deleteError.set('Delete failed. Please try again.');
//         this.isDeleting.set(false);
//       }
//     });
//   }

//   // ── Search ────────────────────────────────────────
//   creatorSearch = '';
//   surveySearch = '';

//   get filteredCreators(): AdminCreatorDto[] {
//     const q = this.creatorSearch.toLowerCase().trim();
//     if (!q) return this.creators();
//     return this.creators().filter(c =>
//       c.username.toLowerCase().includes(q) ||
//       c.email.toLowerCase().includes(q)
//     );
//   }

//   get filteredSurveys(): AdminSurveyDto[] {
//     const q = this.surveySearch.toLowerCase().trim();
//     if (!q) return this.surveys();
//     return this.surveys().filter(s =>
//       s.title.toLowerCase().includes(q) ||
//       s.creator.toLowerCase().includes(q)
//     );
//   }

//   // ✅ NEW: filter audit logs by creator name or survey title
//   get filteredAuditLogs(): AuditLogDto[] {
//     const q = this.auditLogSearch.toLowerCase().trim();
//     if (!q) return this.auditLogs();
//     return this.auditLogs().filter(l =>
//       l.performedBy.toLowerCase().includes(q) ||
//       l.surveyTitle.toLowerCase().includes(q) ||
//       l.action.toLowerCase().includes(q)
//     );
//   }

//   // ✅ NEW: badge color per action type
//   getActionClass(action: string): string {
//     if (action === 'Survey Activated') return 'badge-activated';
//     if (action === 'Survey Deactivated') return 'badge-deactivated';
//     if (action === 'Survey Updated') return 'badge-updated';
//     return 'badge-default';
//   }

//   getActionIcon(action: string): string {
//     if (action === 'Survey Activated') return '✅';
//     if (action === 'Survey Deactivated') return '⏸️';
//     if (action === 'Survey Updated') return '✏️';
//     return '📝';
//   }
// }

// 

// import { Component, inject, signal } from '@angular/core';
// import { CommonModule, DatePipe } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AdminService } from '../Services/admin.service';
// import { AdminCreatorDto, AdminSurveyDto, AuditLogDto } from '../models/admin.models';
// import { TokenService } from '../Services/token.service';

// type ActiveTab = 'creators' | 'surveys' | 'auditLogs';

// @Component({
//   selector: 'app-admin-dashboard',
//   imports: [CommonModule, FormsModule, DatePipe],
//   templateUrl: './admin-dashboard.html',
//   styleUrl: './admin-dashboard.css'
// })
// export class AdminDashboard {

//   private adminService = inject(AdminService);
//   private tokenService = inject(TokenService);

//   activeTab = signal<ActiveTab>('creators');

//   //  Creators 
//   creators = signal<AdminCreatorDto[]>([]);
//   creatorsLoading = signal(true);
//   creatorsError = signal('');

//   //  Surveys 
//   surveys = signal<AdminSurveyDto[]>([]);
//   surveysLoading = signal(true);
//   surveysError = signal('');

//   //  Audit Logs 
//   auditLogs = signal<AuditLogDto[]>([]);
//   auditLogsLoading = signal(false);
//   auditLogsError = signal('');
//   auditLogSearch = '';

//   //  Delete 
//   showDeleteModal = signal(false);
//   deleteTarget = signal<{ type: 'creator' | 'survey'; id: number; name: string } | null>(null);
//   isDeleting = signal(false);
//   deleteError = signal('');

//   //  Admin info 
//   adminUsername = signal<string | null>(null);

//   constructor() {
//     this.adminUsername.set(this.tokenService.getUsername());
//     this.loadCreators();
//     this.loadSurveys();
//   }

//   //  Load 

//   loadCreators() {
//     this.creatorsLoading.set(true);
//     this.creatorsError.set('');
//     this.adminService.getAllCreators().subscribe({
//       next: (data) => {
//         this.creators.set(data);
//         this.creatorsLoading.set(false);
//       },
//       error: () => {
//         this.creatorsError.set('Failed to load creators.');
//         this.creatorsLoading.set(false);
//       }
//     });
//   }

//   loadSurveys() {
//     this.surveysLoading.set(true);
//     this.surveysError.set('');
//     this.adminService.getAllSurveys().subscribe({
//       next: (data) => {
//         this.surveys.set(data);
//         this.surveysLoading.set(false);
//       },
//       error: () => {
//         this.surveysError.set('Failed to load surveys.');
//         this.surveysLoading.set(false);
//       }
//     });
//   }

//   // load audit logs — called only when the tab is opened
//   loadAuditLogs() {
//     this.auditLogsLoading.set(true);
//     this.auditLogsError.set('');
//     this.adminService.getAuditLogs().subscribe({
//       next: (data) => {
//         this.auditLogs.set(data);
//         this.auditLogsLoading.set(false);
//       },
//       error: () => {
//         this.auditLogsError.set('Failed to load audit logs.');
//         this.auditLogsLoading.set(false);
//       }
//     });
//   }

//   //  Tabs 

//   setTab(tab: ActiveTab) {
//     this.activeTab.set(tab);
//     // Only fetch audit logs when the tab is first opened
//     if (tab === 'auditLogs' && this.auditLogs().length === 0 && !this.auditLogsLoading()) {
//       this.loadAuditLogs();
//     }
//   }

//   //  Stats 

//   get totalCreators(): number { return this.creators().length; }
//   get totalSurveys(): number  { return this.surveys().length; }
//   get activeSurveys(): number { return this.surveys().filter(s => s.isActive).length; }

//   //  Delete Modal 

//   openDeleteModal(type: 'creator' | 'survey', id: number, name: string) {
//     this.deleteTarget.set({ type, id, name });
//     this.deleteError.set('');
//     this.showDeleteModal.set(true);
//   }

//   closeDeleteModal() {
//     this.showDeleteModal.set(false);
//     this.deleteTarget.set(null);
//     this.deleteError.set('');
//   }

//   confirmDelete() {
//     const target = this.deleteTarget();
//     if (!target) return;

//     this.isDeleting.set(true);
//     this.deleteError.set('');

//     const request = target.type === 'creator'
//       ? this.adminService.deleteCreator(target.id)
//       : this.adminService.deleteSurvey(target.id);

//     request.subscribe({
//       next: () => {
//         if (target.type === 'creator') {
//           this.creators.update(list => list.filter(c => c.id !== target.id));
//         } else {
//           this.surveys.update(list => list.filter(s => s.id !== target.id));
//         }
//         this.isDeleting.set(false);
//         this.closeDeleteModal();
//       },
//       error: () => {
//         this.deleteError.set('Delete failed. Please try again.');
//         this.isDeleting.set(false);
//       }
//     });
//   }

//   //  Search 
//   creatorSearch = '';
//   surveySearch = '';

//   get filteredCreators(): AdminCreatorDto[] {
//     const q = this.creatorSearch.toLowerCase().trim();
//     if (!q) return this.creators();
//     return this.creators().filter(c =>
//       c.username.toLowerCase().includes(q) ||
//       c.email.toLowerCase().includes(q)
//     );
//   }

//   get filteredSurveys(): AdminSurveyDto[] {
//     const q = this.surveySearch.toLowerCase().trim();
//     if (!q) return this.surveys();
//     return this.surveys().filter(s =>
//       s.title.toLowerCase().includes(q) ||
//       s.creator.toLowerCase().includes(q)
//     );
//   }

//   // filter audit logs by creator name or survey title
//   get filteredAuditLogs(): AuditLogDto[] {
//     const q = this.auditLogSearch.toLowerCase().trim();
//     if (!q) return this.auditLogs();
//     return this.auditLogs().filter(l =>
//       l.performedBy.toLowerCase().includes(q) ||
//       l.surveyTitle.toLowerCase().includes(q) ||
//       l.action.toLowerCase().includes(q)
//     );
//   }

//   // badge color per action type
//   getActionClass(action: string): string {
//     if (action === 'Survey Activated') return 'badge-activated';
//     if (action === 'Survey Deactivated') return 'badge-deactivated';
//     if (action === 'Survey Updated') return 'badge-updated';
//     if (action === 'Survey Deleted') return 'badge-deleted';
//     return 'badge-default';
//   }

//   getActionIcon(action: string): string {
//     if (action === 'Survey Activated') return '✅';
//     if (action === 'Survey Deactivated') return '⏸️';
//     if (action === 'Survey Updated') return '✏️';
//     if (action === 'Survey Deleted') return '🗑️';
//     return '📝';
//   }
// }

import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../Services/admin.service';
import { AdminCreatorDto, AdminSurveyDto, AuditLogDto } from '../models/admin.models';
import { TokenService } from '../Services/token.service';

type ActiveTab = 'creators' | 'surveys' | 'auditLogs';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {

  private adminService = inject(AdminService);
  private tokenService = inject(TokenService);

  // Expose Math so the template can use Math.min
  Math = Math;

  activeTab = signal<ActiveTab>('creators');

  // ── Creators ─────────────────────────────────────
  creators = signal<AdminCreatorDto[]>([]);
  creatorsLoading = signal(true);
  creatorsError = signal('');
  creatorSearch = '';
  creatorPage = 1;
  creatorPageSize = 8;

  // ── Surveys ───────────────────────────────────────
  surveys = signal<AdminSurveyDto[]>([]);
  surveysLoading = signal(true);
  surveysError = signal('');
  surveySearch = '';
  surveyPage = 1;
  surveyPageSize = 8;

  // ── Audit Logs ────────────────────────────────────
  auditLogs = signal<AuditLogDto[]>([]);
  auditLogsLoading = signal(false);
  auditLogsError = signal('');
  auditLogSearch = '';
  auditLogPage = 1;
  auditLogPageSize = 8;

  // ── Audit Log Date Filters ────────────────────────
  auditFromDate = '';
  auditToDate = '';

  // ── Delete ────────────────────────────────────────
  showDeleteModal = signal(false);
  deleteTarget = signal<{ type: 'creator' | 'survey'; id: number; name: string } | null>(null);
  isDeleting = signal(false);
  deleteError = signal('');

  // ── Admin info ────────────────────────────────────
  adminUsername = signal<string | null>(null);

  constructor() {
    this.adminUsername.set(this.tokenService.getUsername());
    this.loadCreators();
    this.loadSurveys();
  }

  // ── Load ──────────────────────────────────────────

  loadCreators() {
    this.creatorsLoading.set(true);
    this.creatorsError.set('');
    this.adminService.getAllCreators().subscribe({
      next: (data) => {
        this.creators.set(data);
        this.creatorsLoading.set(false);
      },
      error: () => {
        this.creatorsError.set('Failed to load creators.');
        this.creatorsLoading.set(false);
      }
    });
  }

  loadSurveys() {
    this.surveysLoading.set(true);
    this.surveysError.set('');
    this.adminService.getAllSurveys().subscribe({
      next: (data) => {
        this.surveys.set(data);
        this.surveysLoading.set(false);
      },
      error: () => {
        this.surveysError.set('Failed to load surveys.');
        this.surveysLoading.set(false);
      }
    });
  }

  loadAuditLogs() {
    this.auditLogsLoading.set(true);
    this.auditLogsError.set('');
    this.adminService.getAuditLogs().subscribe({
      next: (data) => {
        this.auditLogs.set(data);
        this.auditLogsLoading.set(false);
      },
      error: () => {
        this.auditLogsError.set('Failed to load audit logs.');
        this.auditLogsLoading.set(false);
      }
    });
  }

  // ── Tabs ──────────────────────────────────────────

  setTab(tab: ActiveTab) {
    this.activeTab.set(tab);
    if (tab === 'auditLogs' && this.auditLogs().length === 0 && !this.auditLogsLoading()) {
      this.loadAuditLogs();
    }
  }

  // ── Stats ─────────────────────────────────────────

  get totalCreators(): number { return this.creators().length; }
  get totalSurveys(): number  { return this.surveys().length; }
  get activeSurveys(): number { return this.surveys().filter(s => s.isActive).length; }

  // ── Delete Modal ──────────────────────────────────

  openDeleteModal(type: 'creator' | 'survey', id: number, name: string) {
    this.deleteTarget.set({ type, id, name });
    this.deleteError.set('');
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.deleteTarget.set(null);
    this.deleteError.set('');
  }

  confirmDelete() {
    const target = this.deleteTarget();
    if (!target) return;

    this.isDeleting.set(true);
    this.deleteError.set('');

    const request = target.type === 'creator'
      ? this.adminService.deleteCreator(target.id)
      : this.adminService.deleteSurvey(target.id);

    request.subscribe({
      next: () => {
        if (target.type === 'creator') {
          this.creators.update(list => list.filter(c => c.id !== target.id));
          // Reset to page 1 if current page becomes empty after delete
          if (this.creatorPagedItems.length === 0 && this.creatorPage > 1) {
            this.creatorPage--;
          }
        } else {
          this.surveys.update(list => list.filter(s => s.id !== target.id));
          if (this.surveyPagedItems.length === 0 && this.surveyPage > 1) {
            this.surveyPage--;
          }
        }
        this.isDeleting.set(false);
        this.closeDeleteModal();
      },
      error: () => {
        this.deleteError.set('Delete failed. Please try again.');
        this.isDeleting.set(false);
      }
    });
  }

  // ══════════════════════════════════════════════════
  // CREATORS — Search + Pagination
  // ══════════════════════════════════════════════════

  get filteredCreators(): AdminCreatorDto[] {
    const q = this.creatorSearch.toLowerCase().trim();
    if (!q) return this.creators();
    return this.creators().filter(c =>
      c.username.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  }

  get creatorTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredCreators.length / this.creatorPageSize));
  }

  get creatorPagedItems(): AdminCreatorDto[] {
    const start = (this.creatorPage - 1) * this.creatorPageSize;
    return this.filteredCreators.slice(start, start + this.creatorPageSize);
  }

  get creatorPageNumbers(): number[] {
    return this.getPageNumbers(this.creatorPage, this.creatorTotalPages);
  }

  onCreatorSearchChange() {
    this.creatorPage = 1;
  }

  // ══════════════════════════════════════════════════
  // SURVEYS — Search + Pagination
  // ══════════════════════════════════════════════════

  get filteredSurveys(): AdminSurveyDto[] {
    const q = this.surveySearch.toLowerCase().trim();
    if (!q) return this.surveys();
    return this.surveys().filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.creator.toLowerCase().includes(q)
    );
  }

  get surveyTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredSurveys.length / this.surveyPageSize));
  }

  get surveyPagedItems(): AdminSurveyDto[] {
    const start = (this.surveyPage - 1) * this.surveyPageSize;
    return this.filteredSurveys.slice(start, start + this.surveyPageSize);
  }

  get surveyPageNumbers(): number[] {
    return this.getPageNumbers(this.surveyPage, this.surveyTotalPages);
  }

  onSurveySearchChange() {
    this.surveyPage = 1;
  }

  // ══════════════════════════════════════════════════
  // AUDIT LOGS — Search + Date Filter + Pagination
  // ══════════════════════════════════════════════════

  get filteredAuditLogs(): AuditLogDto[] {
    let logs = this.auditLogs();

    // Date filter
    if (this.auditFromDate) {
      const from = new Date(this.auditFromDate);
      logs = logs.filter(l => new Date(l.performedAt) >= from);
    }

    if (this.auditToDate) {
      // Add 1 day so "To Date" is inclusive of the full selected day
      const to = new Date(this.auditToDate);
      to.setDate(to.getDate() + 1);
      logs = logs.filter(l => new Date(l.performedAt) < to);
    }

    // Search filter
    const q = this.auditLogSearch.toLowerCase().trim();
    if (q) {
      logs = logs.filter(l =>
        l.performedBy.toLowerCase().includes(q) ||
        l.surveyTitle.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q)
      );
    }

    return logs;
  }

  get auditLogTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredAuditLogs.length / this.auditLogPageSize));
  }

  get auditLogPagedItems(): AuditLogDto[] {
    const start = (this.auditLogPage - 1) * this.auditLogPageSize;
    return this.filteredAuditLogs.slice(start, start + this.auditLogPageSize);
  }

  get auditLogPageNumbers(): number[] {
    return this.getPageNumbers(this.auditLogPage, this.auditLogTotalPages);
  }

  get hasAuditFilters(): boolean {
    return !!(this.auditFromDate || this.auditToDate || this.auditLogSearch.trim());
  }

  applyAuditFilters() {
    this.auditLogPage = 1;
  }

  clearAuditFilters() {
    this.auditFromDate = '';
    this.auditToDate = '';
    this.auditLogSearch = '';
    this.auditLogPage = 1;
  }

  onAuditSearchChange() {
    this.auditLogPage = 1;
  }

  // ── Shared Page Number Helper ─────────────────────
  // Shows at most 5 page buttons, centred around current page

  private getPageNumbers(current: number, total: number): number[] {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    let start = Math.max(1, current - 2);
    let end   = Math.min(total, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  // ── Audit Log Badge Helpers ───────────────────────

  getActionClass(action: string): string {
    if (action === 'Survey Activated')   return 'badge-activated';
    if (action === 'Survey Deactivated') return 'badge-deactivated';
    if (action === 'Survey Updated')     return 'badge-updated';
    if (action === 'Survey Deleted')     return 'badge-deleted';
    return 'badge-default';
  }

  getActionIcon(action: string): string {
    if (action === 'Survey Activated')   return '✅';
    if (action === 'Survey Deactivated') return '⏸️';
    if (action === 'Survey Updated')     return '✏️';
    if (action === 'Survey Deleted')     return '🗑️';
    return '📝';
  }
}
