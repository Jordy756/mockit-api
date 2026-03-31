import { syntaxHighlight } from "../utils/syntaxHighlight";
import { insertMockRecord } from "../services/api";

const jsonTextarea = document.querySelector("#json-textarea") as HTMLTextAreaElement;
const jsonDisplay = document.querySelector("#json-display") as HTMLElement;
const formatBtn = document.querySelector("#format-btn") as HTMLButtonElement;
const generateMocksBtn = document.querySelector("#generate-mocks-btn") as HTMLButtonElement;

const livePreviewContent = document.querySelector("#live-preview-content") as HTMLElement;
const livePreviewSpinner = document.querySelector("#live-preview-spinner") as SVGElement;
const livePreviewError = document.querySelector("#live-preview-error") as HTMLElement;

const update = () => {
  if (!jsonTextarea || !jsonDisplay) return;

  let val = jsonTextarea.value;

  if (val.length > 0 && val[val.length - 1] === "\n") val += " ";

  jsonDisplay.innerHTML = syntaxHighlight(val);
};

const validateJsonFormat = () => {
  try {
    const parsed = JSON.parse(jsonTextarea.value);
    jsonTextarea.value = JSON.stringify(parsed, null, 2);
    update();
    return true;
  } catch (e) {
    livePreviewError.textContent = "El JSON ingresado es inválido, por favor corrige los errores antes de formatear.";
    return false;
  }
};

const handleGenerateClick = async () => {
  console.log("Generando mocks...");
  if (!validateJsonFormat()) return;
  console.log("JSON válido, procediendo a generar mocks...");

  generateMocksBtn.setAttribute("disabled", "true");
  livePreviewSpinner.classList.remove("hidden");
  livePreviewError.classList.add("hidden");

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { response, data } = await insertMockRecord(jsonTextarea.value);
    if (!response.ok) throw new Error("Error al generar los mocks");

    livePreviewContent.innerHTML = syntaxHighlight(JSON.stringify(data, null, 2));
  } catch (error) {
    livePreviewError.textContent = "Error al generar los mocks. Por favor, intenta nuevamente.";
    livePreviewError.classList.remove("hidden");
  } finally {
    generateMocksBtn.removeAttribute("disabled");
    livePreviewSpinner.classList.add("hidden");
  }
};

jsonTextarea.addEventListener("input", update);
jsonTextarea.addEventListener("scroll", () => {
  if (!jsonDisplay) return;

  jsonDisplay.scrollTop = jsonTextarea.scrollTop;
  jsonDisplay.scrollLeft = jsonTextarea.scrollLeft;
});

formatBtn.addEventListener("click", () => validateJsonFormat);
generateMocksBtn.addEventListener("click", handleGenerateClick);

update();
