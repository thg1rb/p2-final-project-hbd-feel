export enum ApprovalStatus {
	APPROVED = 'APPROVED',
	PENDING = 'PENDING',
	NOT_STARTED = 'NOT_STARTED',
	REJECTED = 'REJECTED'
}

export enum ApprovalRole {
	DEPT_HEAD = 'หัวหน้าภาควิชา',
	ASSO_DEAN = 'รองคณบดี',
	DEAN = 'คณบดี',
	NISIT_DEV = 'กองพัฒนานิสิต',
	BOARD = 'คณะกรรมการ',
	BOARD_HEAD = 'ประธานคณะกรรมการ',
	CHANCELLOR = 'อธิการบดี'
}

export enum RoleLevel {
	NISIT = 0,
	DEPT_HEAD = 1,
	ASSO_DEAN = 2,
	DEAN = 3,
	NISIT_DEV = 4,
	BOARD = 5,
	BOARD_HEAD = 6
}

export const roleMapApprovalRole: Record<string, ApprovalRole> = {
	DEPT_HEAD: ApprovalRole.DEPT_HEAD,
	ASSO_DEAN: ApprovalRole.ASSO_DEAN,
	DEAN: ApprovalRole.DEAN,
	NISIT_DEV: ApprovalRole.NISIT_DEV,
	BOARD: ApprovalRole.BOARD,
	BOARD_HEAD: ApprovalRole.BOARD_HEAD,
	CHANCELLOR: ApprovalRole.CHANCELLOR
};

export enum UserRole {
	NISIT = 'นิสิต',
	DEPT_HEAD = 'หัวหน้าภาควิชา',
	ASSO_DEAN = 'รองคณบดี',
	DEAN = 'คณบดี',
	NISIT_DEV = 'กองพัฒนานิสิต',
	BOARD = 'คณะกรรมการ',
	BOARD_HEAD = 'ประธานคณะกรรมการ',
	CHANCELLOR = 'อธิการบดี'
}
export const roleMapUserRole: Record<string, UserRole> = {
	NISIT: UserRole.NISIT,
	DEPT_HEAD: UserRole.DEPT_HEAD,
	ASSO_DEAN: UserRole.ASSO_DEAN,
	DEAN: UserRole.DEAN,
	NISIT_DEV: UserRole.NISIT_DEV,
	BOARD: UserRole.BOARD,
	BOARD_HEAD: UserRole.BOARD_HEAD,
	CHANCELLOR: UserRole.CHANCELLOR
};
