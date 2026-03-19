import { describe, it, expect } from 'vitest'
import { OversightGate } from '../src/gates/oversight-gate.js'

describe('OversightGate', () => {
  it('AUTO_PUBLISH returns immediate publish action', () => {
    const gate = new OversightGate('AUTO_PUBLISH')
    const result = gate.evaluate('opp-1')
    expect(result.action).toBe('publish')
    expect(result.approvalStatus).toBe('APPROVED')
    expect(result.vetoDeadline).toBeNull()
  })

  it('VETO_WINDOW returns delayed publish with deadline', () => {
    const gate = new OversightGate('VETO_WINDOW', 24)
    const result = gate.evaluate('opp-1')
    expect(result.action).toBe('queue_veto')
    expect(result.approvalStatus).toBe('PENDING')
    expect(result.vetoDeadline).toBeInstanceOf(Date)
    const hoursFromNow = (result.vetoDeadline!.getTime() - Date.now()) / (1000 * 60 * 60)
    expect(hoursFromNow).toBeGreaterThan(23)
    expect(hoursFromNow).toBeLessThan(25)
  })

  it('APPROVAL_REQUIRED returns queue action', () => {
    const gate = new OversightGate('APPROVAL_REQUIRED')
    const result = gate.evaluate('opp-1')
    expect(result.action).toBe('queue_approval')
    expect(result.approvalStatus).toBe('PENDING')
    expect(result.vetoDeadline).toBeNull()
  })
})
