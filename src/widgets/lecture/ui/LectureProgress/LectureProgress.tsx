interface LectureProgressProps {
  progress: number;
}

export function LectureProgress({ progress }: LectureProgressProps) {
  return (
    <div className="h-0.5 sm:h-1 bg-muted">
      <div
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
