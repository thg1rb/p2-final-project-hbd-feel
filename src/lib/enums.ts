export enum ApprovalStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  NOT_STARTED = 'NOT_STARTED',
  REJECTED = "REJECTED"
}

export enum ApprovalRole {
  DEPT_HEAD = 'หัวหน้าภาควิชา',
  ASSO_DEAN = 'รองคณบดี',
  DEAN = 'คณบดี',
  ADMIN = 'กองพัฒนานิสิต',
  BOARD = 'คณะกรรมการ',
  BOARD_HEAD = 'ประธานคณะกรรมการ',
  CHANCELLOR = 'อธิการบดี'
}

export enum ApplicationStatus {
  SUBMITTED = 'SUBMITTED',
  APPROVED_DEPT_HEAD = 'APPROVED_DEPT_HEAD',
  REJECTED_DEPT_HEAD = 'REJECTED_DEPT_HEAD',
  APPROVED_ASSO_DEAN = 'APPROVED_ASSO_DEAN',
  REJECTED_ASSO_DEAN = 'REJECTED_ASSO_DEAN',
  APPROVED_DEAN = 'APPROVED_DEAN',
  REJECTED_DEAN = 'REJECTED_DEAN',
  APPROVED_NISIT_DEV = 'APPROVED_NISIT_DEV',
  REJECTED_NISIT_DEV = 'REJECTED_NISIT_DEV',
  APPROVED_BOARD = 'APPROVED_BOARD',
  REJECTED_BOARD = 'REJECTED_BOARD',
}

export enum RoleLevel {
  NISIT = 0,
  DEPT_HEAD = 1,
  ASSO_DEAN = 2,
  DEAN = 3,
  NISIT_DEV = 4,
  BOARD = 5,
  BOARD_HEAD = 6,
}

export const roleMap: Record<string, ApprovalRole> = {
  'DEPT_HEAD': ApprovalRole.DEPT_HEAD,
  'ASSO_DEAN': ApprovalRole.ASSO_DEAN,
  'DEAN': ApprovalRole.DEAN,
  'ADMIN': ApprovalRole.ADMIN,
  'BOARD': ApprovalRole.BOARD,
  'BOARD_HEAD': ApprovalRole.BOARD_HEAD,
  'CHANCELLOR': ApprovalRole.CHANCELLOR
}

export enum UserRole {
  DEPT_HEAD = 'หัวหน้าภาควิชา',
  ASSO_DEAN = 'รองคณบดี',
  DEAN = 'คณบดี',
  ADMIN = 'กองพัฒนานิสิต',
  BOARD = 'คณะกรรมการ',
  BOARD_HEAD = 'ประธานคณะกรรมการ',
  CHANCELLOR = 'อธิการบดี',
  NISIT = "นิสิต"
}
export const roleMapUserRole: Record<string, UserRole> = {
  'DEPT_HEAD': UserRole.DEPT_HEAD,
  'ASSO_DEAN': UserRole.ASSO_DEAN,
  'DEAN': UserRole.DEAN,
  'ADMIN': UserRole.ADMIN,
  'BOARD': UserRole.BOARD,
  'BOARD_HEAD': UserRole.BOARD_HEAD,
  'CHANCELLOR': UserRole.CHANCELLOR,
  'NISIT': UserRole.NISIT,
}