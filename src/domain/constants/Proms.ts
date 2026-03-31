export const PromGenerator = (schema: Record<string, unknown>, count: number): string => {
  const prom: string = ` 
        Eres un generador de datos de prueba (mock data). 
        Se te da un JSON de ejemplo con campos y sus descripciones.
        Debes generar ${count} objetos JSON con datos REALISTAS y VARIADOS.

        JSON de ejemplo:
        ${JSON.stringify(schema, null, 2)}

        REGLAS CRÍTICAS:
        1. Analiza el NOMBRE de cada campo y su VALOR de ejemplo para inferir qué tipo de dato generar
        2. Si el valor dice "entre X y Y", genera números en ese rango
        3. Si el valor es un nombre de producto real, genera nombres reales similares
        4. Si el campo se llama "email", genera emails reales
        5. Si el campo se llama "fecha" o "date", genera fechas ISO válidas
        6. Los IDs deben ser únicos y autoincrementales empezando en 1
        7. Los datos deben ser COHERENTES entre sí (ej: si es consola, que los nombres sean consolas reales)
        8. Varía los datos, no repitas valores
        9. No generes CAMPOS o VALORES si estos no estan basados estrictamente en el esquema json recibido

        Responde ÚNICAMENTE con un array JSON válido, sin explicaciones, sin markdown, sin bloques de código.
        Solo el array puro.
    `;

  return prom;
};
