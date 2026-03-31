import { syntaxHighlight } from "../utils/syntaxHighlight";
import { insertMockRecord } from "../services/api";
import { API_URL } from "@scripts/constants/api";
import { copy } from "@scripts/utils/copy";

const jsonTextarea = document.querySelector("#json-textarea") as HTMLTextAreaElement;
const jsonDisplay = document.querySelector("#json-display") as HTMLElement;

const formatBtn = document.querySelector("#format-btn") as HTMLButtonElement;
const generateMocksBtn = document.querySelector("#generate-mocks-btn") as HTMLButtonElement;
const copyLinkBtn = document.querySelector("#copy-link-btn") as HTMLButtonElement;

const livePreviewContent = document.querySelector("#live-preview-content") as HTMLElement;
const livePreviewSpinner = document.querySelector("#live-preview-spinner") as SVGElement;
const livePreviewError = document.querySelector("#live-preview-error") as HTMLElement;

let mockId = "abc123";

const update = (element: HTMLTextAreaElement | HTMLElement) => {
  let val = element instanceof HTMLTextAreaElement ? element.value : element.textContent;

  if (val.length > 0 && val[val.length - 1] === "\n") val += " ";

  element instanceof HTMLTextAreaElement
    ? (jsonDisplay.innerHTML = syntaxHighlight(val))
    : (element.innerHTML = syntaxHighlight(val));
};

const updateTextarea = () => {
  if (!jsonDisplay) return;

  jsonDisplay.scrollTop = jsonTextarea.scrollTop;
  jsonDisplay.scrollLeft = jsonTextarea.scrollLeft;
};

const validateJsonFormat = () => {
  try {
    const parsed = JSON.parse(jsonTextarea.value);
    jsonTextarea.value = JSON.stringify(parsed, null, 2);
    update(jsonTextarea);
    return true;
  } catch (e) {
    livePreviewContent.innerHTML = "";
    livePreviewError.textContent = "El formato JSON es inválido. Por favor, corrige los errores y vuelve a intentarlo.";
    livePreviewError.classList.remove("hidden");
    return false;
  }
};

const handleGenerateMock = async () => {
  if (!validateJsonFormat()) return;

  livePreviewContent.innerHTML = "";
  copyLinkBtn.setAttribute("disabled", "true");
  generateMocksBtn.setAttribute("disabled", "true");
  livePreviewSpinner.classList.remove("hidden");
  livePreviewError.classList.add("hidden");

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { response, data } = await insertMockRecord(jsonTextarea.value);
    if (!response.ok) throw new Error("Error al generar los mocks");

    mockId = data.id;
    livePreviewContent.innerHTML = syntaxHighlight(JSON.stringify(data, null, 2));
    copyLinkBtn.removeAttribute("disabled");
  } catch (error) {
    livePreviewError.textContent = "Error al generar los mocks. Por favor, intenta nuevamente.";
    livePreviewError.classList.remove("hidden");
  } finally {
    generateMocksBtn.removeAttribute("disabled");
    livePreviewSpinner.classList.add("hidden");
  }
};

jsonTextarea.addEventListener("input", () => update(jsonTextarea));
jsonTextarea.addEventListener("scroll", updateTextarea);
formatBtn.addEventListener("click", validateJsonFormat);
generateMocksBtn.addEventListener("click", handleGenerateMock);
copyLinkBtn.addEventListener("click", () => copy(`${API_URL}/${mockId}/mocks/`));

update(jsonTextarea);
update(livePreviewContent);
