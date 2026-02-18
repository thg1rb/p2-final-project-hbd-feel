import type { ApplicationStatus, ApprovalRole } from "./enums"

export interface Application {
  award: Award,
  award_id: string,
  created_at: string,
  documents: Object,
  event: Event,
  event_id: string,
  id: string,
  path: string,
  status: ApplicationStatus,
  student_id: string,
  updated_at: string,
  user: User,
  year: number,
  grade: number,
}

export interface Faculty {
  id: string,
  name: string,
  created_at: string,
  updated_at: string
}

export interface Department {
  id: string,
  faculty_id: string,
  name: string,
  created_at: string,
  updated_at: string
}

export interface ApplicationResponse {

}

export interface User {
  department: Department,
  faculty: Faculty,
  created_at: string,
  deleted_at: string,
  email: string,
  email_verified_at: string,
  firstName: string,
  id: number,
  lastName: string,
  role: string,
  student_id: string,
  updated_at: string,
  username: string
}

export interface Event {
  academic_year: string,
  created_at: string,
  deleted_at: string,
  end_date: string,
  id: number,
  semester: number,
  start_date: string,
  status: string,
  updated_at: string
}


export interface Award {
  id: string,
  created_at: string,
  deleted_at: string,
  updated_at: string,
  form_path: string,
  name: string,
  requirements: Requirement[]
}

export interface Requirement {
  key: string,
  label: string,
  required: boolean
}

export interface Approval {
  id: string,
  user_id: number,
  application_id: string,
  reason: string,
  status: string,
  created_at: string,
  updated_at: string,
  user: ApprovalUser
}

export interface ApprovalUser {
  id: number,
  firstName: string,
  lastName: string,
  role: ApprovalRole,
}