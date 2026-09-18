import { Volume2, VolumeX } from "lucide-react";

export function MuteToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(!enabled)}
      aria-label={enabled ? "Turn sound off" : "Turn sound on"}
      title={enabled ? "Turn sound off" : "Turn sound on"}
      className="sound-toggle fixed right-4 top-4 z-50 grid h-11 w-11 place-items-center"
    >
      {enabled ? <Volume2 aria-hidden="true" className="h-4 w-4" /> : <VolumeX aria-hidden="true" className="h-4 w-4" />}
    </button>
  );
}
