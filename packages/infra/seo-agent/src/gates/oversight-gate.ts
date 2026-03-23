export type OversightMode = 'AUTO_PUBLISH' | 'VETO_WINDOW' | 'APPROVAL_REQUIRED'
export type OversightAction = 'publish' | 'queue_veto' | 'queue_approval'
export type ApprovalStatus = 'APPROVED' | 'PENDING'

export interface OversightDecision {
  action: OversightAction
  approvalStatus: ApprovalStatus
  vetoDeadline: Date | null
}

export class OversightGate {
  constructor(
    private readonly mode: OversightMode,
    private readonly vetoWindowHours: number = 24,
  ) {}

  evaluate(_opportunityId: string): OversightDecision {
    switch (this.mode) {
      case 'AUTO_PUBLISH':
        return {
          action: 'publish',
          approvalStatus: 'APPROVED',
          vetoDeadline: null,
        }
      case 'VETO_WINDOW': {
        const deadline = new Date(Date.now() + this.vetoWindowHours * 60 * 60 * 1000)
        return {
          action: 'queue_veto',
          approvalStatus: 'PENDING',
          vetoDeadline: deadline,
        }
      }
      case 'APPROVAL_REQUIRED':
        return {
          action: 'queue_approval',
          approvalStatus: 'PENDING',
          vetoDeadline: null,
        }
    }
  }
}
