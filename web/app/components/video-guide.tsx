import type { VideoGuide as VideoGuideDefinition } from '../lib/video-library';

type VideoGuideProps = Readonly<{
  guide: VideoGuideDefinition;
  featured?: boolean;
  preload?: 'none' | 'metadata';
}>;

export function VideoGuide({ guide, featured = false, preload = 'none' }: VideoGuideProps) {
  return (
    <article className={featured ? 'video-guide video-guide--featured' : 'video-guide'}>
      <div className="video-guide__media">
        <video
          aria-label={`${guide.title}. ${guide.duration}.`}
          controls
          playsInline
          preload={preload}
          poster={`/videos/posters/${guide.slug}.jpg`}
        >
          <source src={`/videos/${guide.slug}.mp4`} type="video/mp4" />
          <track
            default
            kind="captions"
            src={`/videos/${guide.slug}.vtt`}
            srcLang="en-GB"
            label="English subtitles"
          />
          Your browser does not support embedded video. Use the written guide below instead.
        </video>
      </div>
      <div className="video-guide__body">
        <p className="video-guide__format">Silent video · English subtitles on</p>
        <p className="micro-label">
          {guide.role} · {guide.duration}
        </p>
        <h3>{guide.title}</h3>
        <p>{guide.summary}</p>
        {guide.transcript ? (
          <details>
            <summary>Read the on-screen guide</summary>
            <p>{guide.transcript}</p>
          </details>
        ) : null}
      </div>
    </article>
  );
}
