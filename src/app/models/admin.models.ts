// =============================================
// ADMIN MODELS
// =============================================

// ---------- Creators ----------

// export interface AdminCreatorDto {
//   id: number;
//   username: string;
//   email: string;
// }

// // ---------- Surveys ----------

// export interface AdminSurveyDto {
//   id: number;
//   title: string;
//   isActive: boolean;
//   creator: string;
// }


export interface AdminCreatorDto {
  id: number;
  username: string;
  email: string;
}

export interface AdminSurveyDto {
  id: number;
  title: string;
  isActive: boolean;
  creator: string;
}


export interface AuditLogDto {
  id: number;
  action: string;
  surveyId: number;
  surveyTitle: string;
  performedBy: string;
  performedAt: string;
}
