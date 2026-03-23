// import { Component, inject, signal } from '@angular/core';
// import { DatePipe, CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterLink } from '@angular/router';
// import { SurveyService } from '../Services/survey.service';
// import {
//   CreatorSurveyListDto,
//   UpdateSurveyDto,
//   GetMySurveysRequestDto,
//   PagedSurveyResponseDto
// } from '../models/survey.models';

// @Component({
//   selector: 'app-dashboard',
//   imports: [DatePipe, CommonModule, FormsModule, RouterLink],
//   templateUrl: './dashboard.html',
//   styleUrl: './dashboard.css'
// })
// export class Dashboard {

//   private surveyService = inject(SurveyService);

//   // ── Data ─────────────────────────────────────────
//   surveys = signal<CreatorSurveyListDto[]>([]);
//   isLoading = signal(true);
//   errorMessage = signal('');

//   // ── Stats ─────────────────────────────────────────
//   totalSurveys = signal(0);
//   totalResponses = signal(0);
//   activeSurveys = signal(0);

//   // ── Pagination ────────────────────────────────────
//   pageNumber = 1;
//   pageSize = 10;
//   totalCount = signal(0);

//   // ── Filters ───────────────────────────────────────
//   fromDate = '';
//   toDate = '';
//   isActiveFilter: boolean | null = null;   // null = all, true = active, false = inactive

//   // ── Delete ────────────────────────────────────────
//   deletingSurveyId = signal<number | null>(null);
//   showDeleteModal = signal(false);
//   surveyToDelete = signal<CreatorSurveyListDto | null>(null);

//   // ── Edit ──────────────────────────────────────────
//   showEditModal = signal(false);
//   editingSurvey = signal<CreatorSurveyListDto | null>(null);
//   editForm: UpdateSurveyDto = { title: '', description: '' };
//   isEditLoading = signal(false);
//   editError = signal('');

//   // ── Toggle ────────────────────────────────────────
//   togglingId = signal<number | null>(null);

//   // ── Copy link ─────────────────────────────────────
//   copiedId = signal<number | null>(null);

//   constructor() {
//     this.loadSurveys();
//   }

//   // ── Pagination helpers ────────────────────────────

//   get totalPages(): number {
//     return Math.ceil(this.totalCount() / this.pageSize);
//   }

//   get startIndex(): number {
//     return this.totalCount() === 0 ? 0 : (this.pageNumber - 1) * this.pageSize + 1;
//   }

//   get endIndex(): number {
//     return Math.min(this.pageNumber * this.pageSize, this.totalCount());
//   }

//   get hasActiveFilters(): boolean {
//     return !!(this.fromDate || this.toDate || this.isActiveFilter !== null);
//   }

//   // ── Load ──────────────────────────────────────────

//   loadSurveys() {
//     this.isLoading.set(true);
//     this.errorMessage.set('');

//     // Build POST body — filters + pagination
//     const request: GetMySurveysRequestDto = {
//       pageNumber: this.pageNumber,
//       pageSize: this.pageSize,
//       fromDate: this.fromDate || null,
//       toDate: this.toDate || null,
//       isActive: this.isActiveFilter
//     };

//     this.surveyService.getMySurveys(request).subscribe({
//       next: (data: PagedSurveyResponseDto) => {
//         this.surveys.set(data.surveys);
//         this.totalCount.set(data.totalCount);

//         // Stats are always from all surveys — only recalculate on page 1 no-filter
//         // so the top cards always reflect the full picture
//         if (this.pageNumber === 1 && !this.hasActiveFilters) {
//           this.totalSurveys.set(data.totalCount);
//           this.totalResponses.set(
// data.totalResponsesCount);
// this.activeSurveys.set(data.totalActiveSurveys);
//         }

//         this.isLoading.set(false);
//       },
//       error: () => {
//         this.errorMessage.set('Failed to load surveys. Please try again.');
//         this.isLoading.set(false);
//       }
//     });
//   }

//   // ── Filter actions ────────────────────────────────

//   applyFilters() {
//     this.pageNumber = 1;   // always go back to page 1 when filter changes
//     this.loadSurveys();
//   }

//   clearFilters() {
//     this.fromDate = '';
//     this.toDate = '';
//     this.isActiveFilter = null;
//     this.pageNumber = 1;
//     this.loadSurveys();
//   }

//   // ── Pagination actions ────────────────────────────

//   nextPage() {
//     if (this.pageNumber < this.totalPages) {
//       this.pageNumber++;
//       this.loadSurveys();
//     }
//   }

//   prevPage() {
//     if (this.pageNumber > 1) {
//       this.pageNumber--;
//       this.loadSurveys();      
//     }
//   }

//   goToPage(page: number) {
//     if (page >= 1 && page <= this.totalPages) {
//       this.pageNumber = page;
//       this.loadSurveys();
//     }
//   }

//   // Page numbers to show in pagination bar (max 5 visible)
//   get pageNumbers(): number[] {
//     const total = this.totalPages;
//     if (total <= 5) {
//       return Array.from({ length: total }, (_, i) => i + 1);
//     }
//     const half = 2;
//     let start = Math.max(1, this.pageNumber - half);
//     let end = Math.min(total, start + 4);
//     if (end - start < 4) start = Math.max(1, end - 4);
//     return Array.from({ length: end - start + 1 }, (_, i) => start + i);
//   }

//   // ── Toggle Status ─────────────────────────────────

//   toggleStatus(survey: CreatorSurveyListDto) {
//     this.togglingId.set(survey.surveyId);
//     this.surveyService.toggleSurveyStatus(survey.surveyId).subscribe({
//       next: () => {
//         this.surveys.update(list =>
//           list.map(s =>
//             s.surveyId === survey.surveyId ? { ...s, isActive: !s.isActive } : s
//           )
//         );
//         this.loadSurveys();
//         this.togglingId.set(null);
//       },
//       error: () => this.togglingId.set(null)
//     });
//   }

//   // ── Delete ────────────────────────────────────────

//   openDeleteModal(survey: CreatorSurveyListDto) {
//     this.surveyToDelete.set(survey);
//     this.showDeleteModal.set(true);
//   }

//   closeDeleteModal() {
//     this.showDeleteModal.set(false);
//     this.surveyToDelete.set(null);
//   }

//   confirmDelete() {
//     const survey = this.surveyToDelete();
//     if (!survey) return;
//     this.deletingSurveyId.set(survey.surveyId);
//     this.surveyService.deleteSurvey(survey.surveyId).subscribe({
//       next: () => {
//         this.surveys.update(list => list.filter(s => s.surveyId !== survey.surveyId));
//         this.totalCount.update(n => n - 1);
//         this.totalSurveys.update(n => n - 1);
//         if (survey.isActive) this.activeSurveys.update(n => n - 1);
//         this.totalResponses.update(n => n - survey.totalResponses);
//         this.deletingSurveyId.set(null);
//         this.closeDeleteModal();
//       },
//       error: () => {
//         this.deletingSurveyId.set(null);
//         this.closeDeleteModal();
//       }
//     });
//   }

//   // ── Edit ──────────────────────────────────────────

//   openEditModal(survey: CreatorSurveyListDto) {
//     this.editingSurvey.set(survey);
//     this.editForm = { title: survey.title, description: survey.description };
//     this.editError.set('');
//     this.showEditModal.set(true);
//   }

//   closeEditModal() {
//     this.showEditModal.set(false);
//     this.editingSurvey.set(null);
//     this.editError.set('');
//   }

//   saveEdit() {
//     const survey = this.editingSurvey();
//     if (!survey || !this.editForm.title.trim()) return;
//     this.isEditLoading.set(true);
//     this.editError.set('');
//     this.surveyService.updateSurvey(survey.surveyId, this.editForm).subscribe({
//       next: () => {
//         this.surveys.update(list =>
//           list.map(s =>
//             s.surveyId === survey.surveyId
//               ? { ...s, title: this.editForm.title, description: this.editForm.description }
//               : s
//           )
//         );
//         this.isEditLoading.set(false);
//         this.closeEditModal();
//       },
//       error: () => {
//         this.editError.set('Failed to update survey. Please try again.');
//         this.isEditLoading.set(false);
//       }
//     });
//   }

//   // ── Copy Public Link ──────────────────────────────

//   copyPublicLink(survey: CreatorSurveyListDto) {
//     const link = `http://localhost:4200/survey/${survey.publicIdentifier}`;
//     navigator.clipboard.writeText(link).then(() => {
//       this.copiedId.set(survey.surveyId);
//       setTimeout(() => this.copiedId.set(null), 2000);
//     });
//   }

// }


// import { Component, inject, signal } from '@angular/core';
// import { DatePipe, CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterLink } from '@angular/router';
// import { SurveyService } from '../Services/survey.service';
// import {
//   CreatorSurveyListDto,
//   UpdateSurveyDto,
//   GetMySurveysRequestDto,
//   PagedSurveyResponseDto
// } from '../models/survey.models';

// @Component({
//   selector: 'app-dashboard',
//   imports: [DatePipe, CommonModule, FormsModule, RouterLink],
//   templateUrl: './dashboard.html',
//   styleUrl: './dashboard.css'
// })
// export class Dashboard {

//   private surveyService = inject(SurveyService);

//   // ── Data ─────────────────────────────────────────
//   surveys = signal<CreatorSurveyListDto[]>([]);
//   isLoading = signal(true);
//   errorMessage = signal('');

//   // ── Stats ─────────────────────────────────────────
//   totalSurveys = signal(0);
//   totalResponses = signal(0);
//   activeSurveys = signal(0);

//   // ── Pagination ────────────────────────────────────
//   pageNumber = 1;
//   pageSize = 10;
//   totalCount = signal(0);

//   // ── Filters ───────────────────────────────────────
//   fromDate = '';
//   toDate = '';
//   isActiveFilter: boolean | null = null;

//   // ── Delete ────────────────────────────────────────
//   deletingSurveyId = signal<number | null>(null);
//   showDeleteModal = signal(false);
//   surveyToDelete = signal<CreatorSurveyListDto | null>(null);

//   // ── Edit ──────────────────────────────────────────
//   showEditModal = signal(false);
//   editingSurvey = signal<CreatorSurveyListDto | null>(null);
//   editForm: UpdateSurveyDto = { title: '', description: '' };
//   isEditLoading = signal(false);
//   editError = signal('');

//   // ── Toggle ────────────────────────────────────────
//   togglingId = signal<number | null>(null);

//   // ── Copy link ─────────────────────────────────────
//   copiedId = signal<number | null>(null);

//   // ── Import from Excel ─────────────────────────────
//   showImportModal = signal(false);
//   importTitle = '';
//   importDescription = '';
//   importFile: File | null = null;
//   importFileName = '';
//   isImporting = signal(false);
//   importError = signal('');
//   importSuccess = signal('');

//   constructor() {
//     this.loadSurveys();
//   }

//   // ── Pagination helpers ────────────────────────────

//   get totalPages(): number {
//     return Math.ceil(this.totalCount() / this.pageSize);
//   }

//   get startIndex(): number {
//     return this.totalCount() === 0 ? 0 : (this.pageNumber - 1) * this.pageSize + 1;
//   }

//   get endIndex(): number {
//     return Math.min(this.pageNumber * this.pageSize, this.totalCount());
//   }

//   get hasActiveFilters(): boolean {
//     return !!(this.fromDate || this.toDate || this.isActiveFilter !== null);
//   }

//   // ── Load ──────────────────────────────────────────

//   loadSurveys() {
//     this.isLoading.set(true);
//     this.errorMessage.set('');

//     const request: GetMySurveysRequestDto = {
//       pageNumber: this.pageNumber,
//       pageSize: this.pageSize,
//       fromDate: this.fromDate || null,
//       toDate: this.toDate || null,
//       isActive: this.isActiveFilter
//     };

//     this.surveyService.getMySurveys(request).subscribe({
//       next: (data: PagedSurveyResponseDto) => {
//         this.surveys.set(data.surveys);
//         this.totalCount.set(data.totalCount);

//         if (this.pageNumber === 1 && !this.hasActiveFilters) {
//           this.totalSurveys.set(data.totalCount);
//           this.totalResponses.set(data.totalResponsesCount);
//           this.activeSurveys.set(data.totalActiveSurveys);
//         }

//         this.isLoading.set(false);
//       },
//       error: () => {
//         this.errorMessage.set('Failed to load surveys. Please try again.');
//         this.isLoading.set(false);
//       }
//     });
//   }

//   // ── Filter actions ────────────────────────────────

//   applyFilters() {
//     this.pageNumber = 1;
//     this.loadSurveys();
//   }

//   clearFilters() {
//     this.fromDate = '';
//     this.toDate = '';
//     this.isActiveFilter = null;
//     this.pageNumber = 1;
//     this.loadSurveys();
//   }

//   // ── Pagination actions ────────────────────────────

//   nextPage() {
//     if (this.pageNumber < this.totalPages) {
//       this.pageNumber++;
//       this.loadSurveys();
//     }
//   }

//   prevPage() {
//     if (this.pageNumber > 1) {
//       this.pageNumber--;
//       this.loadSurveys();
//     }
//   }

//   goToPage(page: number) {
//     if (page >= 1 && page <= this.totalPages) {
//       this.pageNumber = page;
//       this.loadSurveys();
//     }
//   }

//   get pageNumbers(): number[] {
//     const total = this.totalPages;
//     if (total <= 5) {
//       return Array.from({ length: total }, (_, i) => i + 1);
//     }
//     const half = 2;
//     let start = Math.max(1, this.pageNumber - half);
//     let end = Math.min(total, start + 4);
//     if (end - start < 4) start = Math.max(1, end - 4);
//     return Array.from({ length: end - start + 1 }, (_, i) => start + i);
//   }

//   // ── Toggle Status ─────────────────────────────────

//   toggleStatus(survey: CreatorSurveyListDto) {
//     this.togglingId.set(survey.surveyId);
//     this.surveyService.toggleSurveyStatus(survey.surveyId).subscribe({
//       next: () => {
//         this.surveys.update(list =>
//           list.map(s =>
//             s.surveyId === survey.surveyId ? { ...s, isActive: !s.isActive } : s
//           )
//         );
//         this.loadSurveys();
//         this.togglingId.set(null);
//       },
//       error: () => this.togglingId.set(null)
//     });
//   }

//   // ── Delete ────────────────────────────────────────

//   openDeleteModal(survey: CreatorSurveyListDto) {
//     this.surveyToDelete.set(survey);
//     this.showDeleteModal.set(true);
//   }

//   closeDeleteModal() {
//     this.showDeleteModal.set(false);
//     this.surveyToDelete.set(null);
//   }

//   confirmDelete() {
//     const survey = this.surveyToDelete();
//     if (!survey) return;
//     this.deletingSurveyId.set(survey.surveyId);
//     this.surveyService.deleteSurvey(survey.surveyId).subscribe({
//       next: () => {
//         this.surveys.update(list => list.filter(s => s.surveyId !== survey.surveyId));
//         this.totalCount.update(n => n - 1);
//         this.totalSurveys.update(n => n - 1);
//         if (survey.isActive) this.activeSurveys.update(n => n - 1);
//         this.totalResponses.update(n => n - survey.totalResponses);
//         this.deletingSurveyId.set(null);
//         this.closeDeleteModal();
//       },
//       error: () => {
//         this.deletingSurveyId.set(null);
//         this.closeDeleteModal();
//       }
//     });
//   }

//   // ── Edit ──────────────────────────────────────────

//   openEditModal(survey: CreatorSurveyListDto) {
//     this.editingSurvey.set(survey);
//     this.editForm = { title: survey.title, description: survey.description };
//     this.editError.set('');
//     this.showEditModal.set(true);
//   }

//   closeEditModal() {
//     this.showEditModal.set(false);
//     this.editingSurvey.set(null);
//     this.editError.set('');
//   }

//   saveEdit() {
//     const survey = this.editingSurvey();
//     if (!survey || !this.editForm.title.trim()) return;
//     this.isEditLoading.set(true);
//     this.editError.set('');
//     this.surveyService.updateSurvey(survey.surveyId, this.editForm).subscribe({
//       next: () => {
//         this.surveys.update(list =>
//           list.map(s =>
//             s.surveyId === survey.surveyId
//               ? { ...s, title: this.editForm.title, description: this.editForm.description }
//               : s
//           )
//         );
//         this.isEditLoading.set(false);
//         this.closeEditModal();
//       },
//       error: () => {
//         this.editError.set('Failed to update survey. Please try again.');
//         this.isEditLoading.set(false);
//       }
//     });
//   }

//   // ── Copy Public Link ──────────────────────────────

//   copyPublicLink(survey: CreatorSurveyListDto) {
//     const link = `http://localhost:4200/survey/${survey.publicIdentifier}`;
//     navigator.clipboard.writeText(link).then(() => {
//       this.copiedId.set(survey.surveyId);
//       setTimeout(() => this.copiedId.set(null), 2000);
//     });
//   }

//   // ── Import from Excel ─────────────────────────────

//   openImportModal() {
//     this.importTitle = '';
//     this.importDescription = '';
//     this.importFile = null;
//     this.importFileName = '';
//     this.importError.set('');
//     this.importSuccess.set('');
//     this.showImportModal.set(true);
//   }

//   closeImportModal() {
//     this.showImportModal.set(false);
//   }

//   onFileSelected(event: Event) {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       const file = input.files[0];
//       // Only allow .xlsx files
//       if (!file.name.endsWith('.xlsx')) {
//         this.importError.set('Only .xlsx files are supported.');
//         this.importFile = null;
//         this.importFileName = '';
//         return;
//       }
//       this.importFile = file;
//       this.importFileName = file.name;
//       this.importError.set('');
//     }
//   }

//   submitImport() {
//     this.importError.set('');
//     this.importSuccess.set('');

//     if (!this.importTitle.trim()) {
//       this.importError.set('Survey title is required.');
//       return;
//     }

//     if (!this.importFile) {
//       this.importError.set('Please select an Excel file.');
//       return;
//     }

//     this.isImporting.set(true);

//     this.surveyService.importSurveyFromExcel(
//       this.importTitle.trim(),
//       this.importDescription.trim(),
//       this.importFile
//     ).subscribe({
//       next: () => {
//         this.isImporting.set(false);
//         this.importSuccess.set('Survey imported successfully!');
//         // Reload dashboard after short delay so new survey appears
//         setTimeout(() => {
//           this.closeImportModal();
//           this.loadSurveys();
//         }, 1500);
//       },
//       error: (err) => {
//         this.isImporting.set(false);
//         this.importError.set(
//           err?.error?.message || 'Import failed. Please check the file format and try again.'
//         );
//       }
//     });
//   }
// }


import { Component, inject, signal } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SurveyService } from '../Services/survey.service';
import {
  CreatorSurveyListDto,
  UpdateSurveyDto,
  GetMySurveysRequestDto,
  PagedSurveyResponseDto
} from '../models/survey.models';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  private surveyService = inject(SurveyService);

  //  Data 
  surveys = signal<CreatorSurveyListDto[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  //  Stats 
  totalSurveys = signal(0);
  totalResponses = signal(0);
  activeSurveys = signal(0);

  //  Pagination 
  pageNumber = 1;
  pageSize = 10;
  totalCount = signal(0);

  //  Filters 
  fromDate = '';
  toDate = '';
  isActiveFilter: boolean | null = null;

  //  Delete 
  deletingSurveyId = signal<number | null>(null);
  showDeleteModal = signal(false);
  surveyToDelete = signal<CreatorSurveyListDto | null>(null);

  //  Edit 
  showEditModal = signal(false);
  editingSurvey = signal<CreatorSurveyListDto | null>(null);
  editForm: UpdateSurveyDto = { title: '', description: '' };
  isEditLoading = signal(false);
  editError = signal('');

  //  Toggle 
  togglingId = signal<number | null>(null);

  //  Copy link 
  copiedId = signal<number | null>(null);

  //  Import from Excel 
  showImportModal = signal(false);
  importTitle = '';
  importDescription = '';
  importFile: File | null = null;
  importFileName = '';
  importExpireAt = '';               
  importMaxResponses: number | null = null;  
  isImporting = signal(false);
  importError = signal('');
  importSuccess = signal('');

  constructor() {
    this.loadSurveys();
  }

  //  Pagination helpers 

  get totalPages(): number {
    return Math.ceil(this.totalCount() / this.pageSize);
  }

  get startIndex(): number {
    return this.totalCount() === 0 ? 0 : (this.pageNumber - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalCount());
  }

  get hasActiveFilters(): boolean {
    return !!(this.fromDate || this.toDate || this.isActiveFilter !== null);
  }

  //  Load 

  loadSurveys() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const request: GetMySurveysRequestDto = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      fromDate: this.fromDate || null,
      toDate: this.toDate || null,
      isActive: this.isActiveFilter
    };

    this.surveyService.getMySurveys(request).subscribe({
      next: (data: PagedSurveyResponseDto) => {
        this.surveys.set(data.surveys);
        this.totalCount.set(data.totalCount);

        if (this.pageNumber === 1 && !this.hasActiveFilters) {
          this.totalSurveys.set(data.totalCount);
          this.totalResponses.set(data.totalResponsesCount);
          this.activeSurveys.set(data.totalActiveSurveys);
        }

        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load surveys. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  //  Filter actions 

  applyFilters() {
    this.pageNumber = 1;
    this.loadSurveys();
  }

  clearFilters() {
    this.fromDate = '';
    this.toDate = '';
    this.isActiveFilter = null;
    this.pageNumber = 1;
    this.loadSurveys();
  }

  //  Pagination actions 

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadSurveys();
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadSurveys();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageNumber = page;
      this.loadSurveys();
    }
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const half = 2;
    let start = Math.max(1, this.pageNumber - half);
    let end = Math.min(total, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  //  Toggle Status 

  toggleStatus(survey: CreatorSurveyListDto) {
    this.togglingId.set(survey.surveyId);
    this.surveyService.toggleSurveyStatus(survey.surveyId).subscribe({
      next: () => {
        this.surveys.update(list =>
          list.map(s =>
            s.surveyId === survey.surveyId ? { ...s, isActive: !s.isActive } : s
          )
        );
        this.loadSurveys();
        this.togglingId.set(null);
      },
      error: () => this.togglingId.set(null)
    });
  }

  //  Delete 

  openDeleteModal(survey: CreatorSurveyListDto) {
    this.surveyToDelete.set(survey);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.surveyToDelete.set(null);
  }

  confirmDelete() {
    const survey = this.surveyToDelete();
    if (!survey) return;
    this.deletingSurveyId.set(survey.surveyId);
    this.surveyService.deleteSurvey(survey.surveyId).subscribe({
      next: () => {
        this.surveys.update(list => list.filter(s => s.surveyId !== survey.surveyId));
        this.totalCount.update(n => n - 1);
        this.totalSurveys.update(n => n - 1);
        if (survey.isActive) this.activeSurveys.update(n => n - 1);
        this.totalResponses.update(n => n - survey.totalResponses);
        this.deletingSurveyId.set(null);
        this.closeDeleteModal();
      },
      error: () => {
        this.deletingSurveyId.set(null);
        this.closeDeleteModal();
      }
    });
  }

  //  Edit 

  openEditModal(survey: CreatorSurveyListDto) {
    this.editingSurvey.set(survey);
    this.editForm = { title: survey.title, description: survey.description };
    this.editError.set('');
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editingSurvey.set(null);
    this.editError.set('');
  }

  saveEdit() {
    const survey = this.editingSurvey();
    if (!survey || !this.editForm.title.trim()) return;
    this.isEditLoading.set(true);
    this.editError.set('');
    this.surveyService.updateSurvey(survey.surveyId, this.editForm).subscribe({
      next: () => {
        this.surveys.update(list =>
          list.map(s =>
            s.surveyId === survey.surveyId
              ? { ...s, title: this.editForm.title, description: this.editForm.description }
              : s
          )
        );
        this.isEditLoading.set(false);
        this.closeEditModal();
      },
      error: () => {
        this.editError.set('Failed to update survey. Please try again.');
        this.isEditLoading.set(false);
      }
    });
  }

  //  Copy Public Link 

  copyPublicLink(survey: CreatorSurveyListDto) {
    const link = `http://localhost:4200/survey/${survey.publicIdentifier}`;
    navigator.clipboard.writeText(link).then(() => {
      this.copiedId.set(survey.surveyId);
      setTimeout(() => this.copiedId.set(null), 2000);
    });
  }

  //  Import from Excel 

  openImportModal() {
    this.importTitle = '';
    this.importDescription = '';
    this.importFile = null;
    this.importFileName = '';
    this.importExpireAt = '';         
    this.importMaxResponses = null;   
    this.importError.set('');
    this.importSuccess.set('');
    this.showImportModal.set(true);
  }

  closeImportModal() {
    this.showImportModal.set(false);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.name.endsWith('.xlsx')) {
        this.importError.set('Only .xlsx files are supported.');
        this.importFile = null;
        this.importFileName = '';
        return;
      }
      this.importFile = file;
      this.importFileName = file.name;
      this.importError.set('');
    }
  }

  submitImport() {
    this.importError.set('');
    this.importSuccess.set('');

    if (!this.importTitle.trim()) {
      this.importError.set('Survey title is required.');
      return;
    }

    if (!this.importFile) {
      this.importError.set('Please select an Excel file.');
      return;
    }

    this.isImporting.set(true);

    // Pass expireAt as ISO string if set, otherwise null
    const expireAt = this.importExpireAt
      ? new Date(this.importExpireAt).toISOString()
      : null;

    this.surveyService.importSurveyFromExcel(
      this.importTitle.trim(),
      this.importDescription.trim(),
      this.importFile,
      expireAt,                  
      this.importMaxResponses    
    ).subscribe({
      next: () => {
        this.isImporting.set(false);
        this.importSuccess.set('Survey imported successfully!');
        setTimeout(() => {
          this.closeImportModal();
          this.loadSurveys();
        }, 1500);
      },
      error: (err) => {
        this.isImporting.set(false);
        this.importError.set(
          err?.error?.message || 'Import failed. Please check the file format and try again.'
        );
      }
    });
  }
}

