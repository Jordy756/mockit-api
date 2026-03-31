export const syntaxHighlight = (json: string): string => {
  const escaped = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match) && /:$/.test(match))
        return `<span class="text-[#24292f] dark:text-[#7ee787] font-semibold">${match}</span>`;

      if (/^"/.test(match)) return `<span class="text-[#0a3069] dark:text-[#a5d6ff]">${match}</span>`;

      if (/true|false|null/.test(match))
        return `<span class="text-[#cf222e] dark:text-[#ff7b72] scale-[1.02] inline-block">${match}</span>`;

      return `<span class="text-[#0550ae] dark:text-[#79c0ff]">${match}</span>`;
    },
  );
};
