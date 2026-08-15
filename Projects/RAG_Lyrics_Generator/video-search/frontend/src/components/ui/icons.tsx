/**
 * Every icon on this surface is drawn here, at one stroke weight (1.6) on one
 * 20-unit grid. lucide-react is installed and fine for anything incidental,
 * but the controls that carry the product's meaning -- play, seek, the search
 * lens, the pin -- are authored so their weight matches the type.
 */

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 20, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const LensIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="8.75" cy="8.75" r="5.25" />
    <path d="M12.6 12.6 16.5 16.5" />
  </Icon>
);

export const ArrowRightIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3.5 10h13M11.5 5l5 5-5 5" />
  </Icon>
);

export const CloseIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 5l10 10M15 5L5 15" />
  </Icon>
);

export const PlayIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6.5 3.8v12.4L17 10 6.5 3.8Z" fill="currentColor" stroke="none" />
  </Icon>
);

export const PauseIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="5.5" y="4" width="3.4" height="12" rx="1.1" fill="currentColor" stroke="none" />
    <rect x="11.1" y="4" width="3.4" height="12" rx="1.1" fill="currentColor" stroke="none" />
  </Icon>
);

export const BackIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M9.5 5.5 4 10l5.5 4.5V5.5Z" fill="currentColor" stroke="none" />
    <path d="M16 5.5v9" />
  </Icon>
);

export const ForwardIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M10.5 5.5 16 10l-5.5 4.5V5.5Z" fill="currentColor" stroke="none" />
    <path d="M4 5.5v9" />
  </Icon>
);

/** The moment marker: a tick that drops onto the timeline. */
export const PinIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M10 3v9.5" />
    <circle cx="10" cy="15" r="2" fill="currentColor" stroke="none" />
  </Icon>
);

export const WaveIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 10h1.6M7 6.2v7.6M10 3.6v12.8M13 6.8v6.4M16.4 10H18" />
  </Icon>
);

export const MicIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="7.6" y="2.6" width="4.8" height="9" rx="2.4" />
    <path d="M4.4 9.4v.6a5.6 5.6 0 0 0 11.2 0v-.6M10 15.6v1.8" />
  </Icon>
);

export const LectureIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M2.6 7.4 10 4l7.4 3.4L10 10.8 2.6 7.4Z" />
    <path d="M5.6 9v4.2c0 1 2 1.8 4.4 1.8s4.4-.8 4.4-1.8V9" />
  </Icon>
);

export const NoteIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="6.4" cy="14.2" r="2.4" />
    <circle cx="14.6" cy="12.4" r="2.4" />
    <path d="M8.8 14.2V5.4l8.2-1.8v8.8" />
  </Icon>
);

export const AlertIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="10" cy="10" r="7" />
    <path d="M10 6.4v4.4" />
    <circle cx="10" cy="13.6" r="0.9" fill="currentColor" stroke="none" />
  </Icon>
);

export const RetryIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M16.2 10a6.2 6.2 0 1 1-1.9-4.5" />
    <path d="M16.6 3.2v3.4h-3.4" />
  </Icon>
);
