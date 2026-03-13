import type { ScrollConfig } from "@velocity/scroll-engine";

export const brandStoryScrollConfig: ScrollConfig = {
  trigger: ".brand-story-section",
  pin: true,
  scrub: 1,
  start: "top top",
  end: "+=200%",
  timeline: (tl, el) => {
    const chapters = el(".story-chapters");
    if (!chapters) return;

    const chapterEls = chapters.querySelectorAll(".story-chapter");
    const totalChapters = chapterEls.length;

    if (totalChapters <= 1) return;

    // Horizontal scroll through chapters (desktop only — mobile uses vertical)
    tl.to(chapters, {
      xPercent: -100 * (totalChapters - 1) / totalChapters,
      ease: "none",
      duration: totalChapters,
    });

    // Stagger text reveals per chapter
    chapterEls.forEach((chapter, i) => {
      const text = chapter.querySelector(".chapter-text");
      const media = chapter.querySelector(".chapter-media");

      if (text) {
        tl.fromTo(
          text,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.5 },
          i * 0.8 + 0.2
        );
      }
      if (media) {
        tl.fromTo(
          media,
          { scale: 1.2, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5 },
          i * 0.8
        );
      }
    });
  },
};
