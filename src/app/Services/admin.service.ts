// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { AdminCreatorDto, AdminSurveyDto } from '../models/admin.models';

// @Injectable({
//   providedIn: 'root'
// })
// export class AdminService {

//   private baseUrl = 'http://localhost:5215/api/Admin';

//   constructor(private http: HttpClient) {}

//   // -----------------------------------------------
//   // GET /api/Admin/creators
//   // Get all registered creators
//   // -----------------------------------------------
//   getAllCreators() {
//     return this.http.get<AdminCreatorDto[]>(
//       `${this.baseUrl}/creators`
//     );
//   }

//   // -----------------------------------------------
//   // GET /api/Admin/surveys
//   // Get all surveys across all creators
//   // -----------------------------------------------
//   getAllSurveys() {
//     return this.http.get<AdminSurveyDto[]>(
//       `${this.baseUrl}/surveys`
//     );
//   }

//   // -----------------------------------------------
//   // DELETE /api/Admin/survey/{id}
//   // Admin deletes any survey
//   // -----------------------------------------------
//   deleteSurvey(id: number) {
//     return this.http.delete<string>(
//       `${this.baseUrl}/survey/${id}`
//     );
//   }

//   // -----------------------------------------------
//   // DELETE /api/Admin/creator/{id}
//   // Admin deletes a creator account
//   // -----------------------------------------------
//   deleteCreator(id: number) {
//     return this.http.delete<string>(
//       `${this.baseUrl}/creator/${id}`
//     );
//   }

// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminCreatorDto, AdminSurveyDto, AuditLogDto } from '../models/admin.models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'http://localhost:5215/api/Admin';

  constructor(private http: HttpClient) {}

  getAllCreators() {
    return this.http.get<AdminCreatorDto[]>(`${this.baseUrl}/creators`);
  }

  getAllSurveys() {
    return this.http.get<AdminSurveyDto[]>(`${this.baseUrl}/surveys`);
  }

  deleteSurvey(id: number) {
    return this.http.delete<string>(`${this.baseUrl}/survey/${id}`);
  }

  deleteCreator(id: number) {
    return this.http.delete<string>(`${this.baseUrl}/creator/${id}`);
  }

  // api/Admin/audit-logs
  getAuditLogs() {
    return this.http.get<AuditLogDto[]>(`${this.baseUrl}/audit-logs`);
  }

}
