/**
 * The wave capping the top of the Why Treqqo section, right where it meets
 * Hero's seam. Solid brand-primary, one shade lighter than the section's
 * own brand-primary-deep background, so it reads as a soft highlight
 * shape rather than a hard-edged divider.
 */
export default function WhyTreqqoWave() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 -scale-y-100  top-0 -z-10 h-5 w-full sm:h-5 lg:h-5"
    >
     <path
  fill="#F8FAF9"
  d="M0,30 C240,90 480,120 720,100 C960,80 1200,20 1440,60 L1440,200 L0,200 Z"
/>
    </svg>
  );
}
