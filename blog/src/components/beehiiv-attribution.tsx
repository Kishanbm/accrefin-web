/** Forwards UTM / attribution params to Beehiiv. Place once in the document body. */
export function BeehiivAttribution() {
  return (
    <script
      type="text/javascript"
      async
      src="https://subscribe-forms.beehiiv.com/attribution.js"
    />
  );
}
