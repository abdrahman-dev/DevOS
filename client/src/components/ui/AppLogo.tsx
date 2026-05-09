interface Props {
  size?: number;
}

export default function AppLogo({ size = 32 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="var(--surface-2)" />
      <text
        x="6"
        y="23"
        fontFamily="var(--font-sans)"
        fontSize="18"
        fontWeight="800"
        fill="var(--accent)"
      >
        D
      </text>
      <text
        x="18"
        y="21"
        fontFamily="var(--font-sans)"
        fontSize="12"
        fontWeight="800"
        fill="var(--purple)"
      >
        O
      </text>
    </svg>
  );
}
