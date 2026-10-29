import { FileMusic, AudioLines, Check, ArrowRight } from "lucide-react";

export function ScoreIllustration() {
  return (
    <div className="project-score-illustration" role="img" aria-label="Workflow illustration: mark lyric regions on a score, align phrases with audio, and export a video.">
      <div className="project-score-toolbar"><span><FileMusic size={16} aria-hidden="true" /> 谱间 · Pujian</span><span>Score → video</span></div>
      <div className="project-score-paper" aria-hidden="true">
        <div className="project-score-staff"><span>♪</span><span>♩</span><span>♫</span><span>♩</span><span>♪</span></div>
        <div className="project-score-regions"><span><small>1</small>Mark the lyrics</span><span><small>2</small>Follow the song</span></div>
      </div>
      <div className="project-score-audio" aria-hidden="true"><AudioLines size={22} /><div className="project-score-wave">{[20,36,24,46,30,56,38,20,48,32,60,42,24,36,52,28,44,22,38,56,32,48,24,40,18,32,54,28].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div></div>
      <div className="project-score-steps" aria-hidden="true"><span><Check size={13} /> Mark</span><ArrowRight size={12} /><span>Sync</span><ArrowRight size={12} /><span>Export</span></div>
      <span className="project-preview-note">Workflow illustration</span>
    </div>
  );
}

export default function ProjectPreview({ project }) {
  if (project.illustration === "score") return <ScoreIllustration />;
  if (project.image) return <div className={`project-preview-image project-preview-image--${project.slug}`}><img src={project.image.src} alt={project.image.alt} loading="lazy" /></div>;
  return null;
}
