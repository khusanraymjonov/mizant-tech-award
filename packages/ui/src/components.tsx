import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export function StatusBadge({
  tone = 'neutral',
  children,
}: {
  tone?: 'neutral' | 'positive' | 'warning';
  children: ReactNode;
}) {
  return <span className={`ui-status ui-status--${tone}`}>{children}</span>;
}

export function Button({
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'quiet' }) {
  return (
    <button
      {...props}
      className={`ui-button ui-button--${variant} ${props.className ?? ''}`.trim()}
    />
  );
}

export function Panel({
  title,
  eyebrow,
  children,
  ...props
}: HTMLAttributes<HTMLElement> & { title: string; eyebrow?: string; children: ReactNode }) {
  return (
    <section {...props} className={`ui-panel ${props.className ?? ''}`.trim()}>
      {eyebrow ? <p className="ui-eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="ui-empty" role="status">
      <span aria-hidden="true">◇</span>
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  );
}
