import { Info, TriangleAlert, Lightbulb } from "lucide-react";

/* Building blocks for the Help center. Presentational only. */

/** Screenshot with numbered markers. Marker coordinates are in image pixels. */
export const Shot = ({ src, alt, w, h, caption, marks = [], eager = false }) => (
  <figure className="fm-help-shot">
    <div className="fm-help-shot-frame">
      <img
        src={src}
        alt={alt}
        width={w}
        height={h}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
      {marks.map((m, i) => (
        <span
          key={m.text}
          className="fm-help-mark"
          style={{ left: `${(m.x / w) * 100}%`, top: `${(m.y / h) * 100}%` }}
          aria-hidden="true"
        >
          {i + 1}
        </span>
      ))}
    </div>
    {marks.length > 0 && (
      <ol className="fm-help-legend">
        {marks.map((m, i) => (
          <li key={m.text}>
            <span className="fm-help-legend-n" aria-hidden="true">{i + 1}</span>
            <span>{m.text}</span>
          </li>
        ))}
      </ol>
    )}
    <figcaption>
      {caption} <span className="fm-help-demo">Sample data from a fictional workspace.</span>
    </figcaption>
  </figure>
);

const ICONS = { note: Info, warn: TriangleAlert, tip: Lightbulb };

export const Callout = ({ kind = "note", title, children }) => {
  const Icon = ICONS[kind];
  return (
    <aside className={`fm-help-callout is-${kind}`}>
      <Icon size={18} aria-hidden="true" />
      <div>
        {title && <strong>{title}</strong>}
        <div>{children}</div>
      </div>
    </aside>
  );
};

export const Steps = ({ items }) => (
  <ol className="fm-help-steps">
    {items.map(([title, body]) => (
      <li key={title}>
        <strong>{title}</strong>
        <span>{body}</span>
      </li>
    ))}
  </ol>
);

/** Left-to-right (top-to-bottom on small screens) flow diagram. */
export const Flow = ({ label, nodes }) => (
  <figure className="fm-help-flow">
    <ol aria-label={label}>
      {nodes.map((n, i) => (
        <li key={n.title} className={n.tone ? `is-${n.tone}` : ""}>
          <span className="fm-help-flow-n" aria-hidden="true">{i + 1}</span>
          <strong>{n.title}</strong>
          <span>{n.text}</span>
          {n.where && <em>{n.where}</em>}
        </li>
      ))}
    </ol>
  </figure>
);

/** Scoring weights as a stacked bar (weights are the engine's, v1). */
export const WeightBar = () => {
  const parts = [
    ["Customer demand", 40, "supporters"],
    ["Survey evidence", 20, "responses + rating"],
    ["Recent activity", 10, "30-day half-life"],
    ["Urgency", 15, "your team, 1–5"],
    ["Strategic fit", 15, "your team, 1–5"],
  ];
  return (
    <figure className="fm-help-weights">
      <div className="fm-help-weightbar" role="img" aria-label="Score weights: demand 40, survey 20, recency 10, urgency 15, strategic fit 15">
        {parts.map(([name, w], i) => (
          <span key={name} className={`w${i}`} style={{ flexGrow: w }}>{w}</span>
        ))}
      </div>
      <ul>
        {parts.map(([name, w, note], i) => (
          <li key={name}><i className={`w${i}`} aria-hidden="true" /><strong>{name}</strong> {w}% <span>{note}</span></li>
        ))}
      </ul>
      <figcaption>Effort is shown next to the score, never inside it.</figcaption>
    </figure>
  );
};
