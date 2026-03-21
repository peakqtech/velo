interface SectionDividerProps {
  number: string;
  label: string;
}

export function SectionDivider({ number, label }: SectionDividerProps) {
  return (
    <div
      className="w-full px-4 md:px-8 py-3 flex items-center gap-4"
      style={{
        borderTopWidth: "1px",
        borderTopStyle: "solid",
        borderTopColor: "rgba(59,130,246,0.2)",
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        borderBottomColor: "rgba(59,130,246,0.08)",
        backgroundColor: "rgba(255,255,255,0.04)",
      }}
    >
      <span
        className="text-[10px] tracking-[0.15em]"
        style={{ fontFamily: "var(--font-mono)", color: "#3b82f6" }}
      >
        {number}
      </span>
      <span
        className="text-[10px] tracking-[0.15em] uppercase"
        style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.25)" }}
      >
        ·
      </span>
      <span
        className="text-[10px] tracking-[0.15em] uppercase"
        style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.3)" }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-px ml-2"
        style={{ background: "linear-gradient(to right, rgba(59,130,246,0.15), transparent)" }}
      />
    </div>
  );
}
