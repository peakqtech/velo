import type { ContentModel } from "../ai/model";
import type { ContentPiece } from "../types/campaign";

/**
 * Filter content pieces that are PLANNED and scheduled at or before `now`.
 */
export function getNextDuePieces(pieces: ContentPiece[], now: Date): ContentPiece[] {
  return pieces.filter((piece) => piece.scheduledFor <= now);
}

/**
 * CampaignExecutor — walks the schedule and triggers content generation.
 * Currently a placeholder; generation logic will be wired in a future task.
 */
export class CampaignExecutor {
  constructor(private readonly model: ContentModel) {}

  /**
   * Returns pieces due for generation as of `now`.
   * Full execution (calling ContentGenerator per piece) is not yet implemented.
   */
  getDuePieces(pieces: ContentPiece[], now: Date = new Date()): ContentPiece[] {
    return getNextDuePieces(pieces, now);
  }
}
