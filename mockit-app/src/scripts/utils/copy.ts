export const copy = (text: string) => {
  navigator.clipboard.writeText(text).catch((err) => {
    console.error("Error al copiar al portapapeles: ", err);
  });
};
