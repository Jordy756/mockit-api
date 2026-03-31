export const syntaxHighlight = (json: string): string => {
  const escaped = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match) && /:$/.test(match)) return `<span class="text-primary font-semibold">${match}</span>`;

      if (/^"/.test(match)) return `<span class="text-tertiary">${match}</span>`;

      if (/true|false|null/.test(match)) return `<span class="text-tertiary scale-[1.02] inline-block">${match}</span>`;

      return `<span class="text-tertiary">${match}</span>`;
    },
  );
};
