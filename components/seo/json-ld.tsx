type JsonLdProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Browser extensions (Bing/BIS, etc.) sometimes mutate script tags
      // before React hydrates. Suppress the warning — the SSR'd content is
      // still correct and search crawlers see what we intended.
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
