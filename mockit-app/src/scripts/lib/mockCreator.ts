import { syntaxHighlight } from "../utils/syntaxHighlight";
import { insertMockRecord } from "../services/api";
import { API_URL } from "@scripts/constants/api";
import { copy } from "@scripts/utils/copy";

const jsonTextarea = document.querySelector("#json-textarea") as HTMLTextAreaElement;
const jsonDisplay = document.querySelector("#json-display") as HTMLElement;

const formatAndEraseBtn = document.querySelector("#format-and-erase-btn") as HTMLButtonElement;
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

    livePreviewContent.classList.remove("hidden");
    livePreviewError.classList.add("hidden");

    return true;
  } catch (e) {
    livePreviewContent.classList.add("hidden");
    livePreviewError.textContent = "El formato JSON es inválido. Por favor, corrige los errores y vuelve a intentarlo.";
    livePreviewError.classList.remove("hidden");
    copyLinkBtn.classList.add("hidden");

    return false;
  }
};

const handleGenerateMock = async () => {
  if (!validateJsonFormat()) return;

  livePreviewContent.classList.add("hidden");
  copyLinkBtn.setAttribute("disabled", "true");
  generateMocksBtn.setAttribute("disabled", "true");
  livePreviewSpinner.classList.remove("hidden");
  copyLinkBtn.classList.add("hidden");

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { response, data } = await insertMockRecord(jsonTextarea.value);
    if (!response.ok) throw new Error("Error al generar los mocks");

    mockId = data.id;
    livePreviewContent.innerHTML = syntaxHighlight(JSON.stringify(data, null, 2));
    livePreviewContent.classList.remove("hidden");
    copyLinkBtn.classList.remove("hidden");
    copyLinkBtn.removeAttribute("disabled");
  } catch (error) {
    livePreviewError.textContent = "Error al generar los mocks. Por favor, intenta nuevamente.";
    livePreviewError.classList.remove("hidden");
  } finally {
    generateMocksBtn.removeAttribute("disabled");
    livePreviewSpinner.classList.add("hidden");
  }
};

const handleFormatAndErase = () => {
  const buttonText = formatAndEraseBtn.textContent?.trim();

  if (buttonText === "Organizar") {
    if (!validateJsonFormat()) return;
    formatAndEraseBtn.textContent = "Borrar";
    return;
  }

  jsonTextarea.value = `{
  "name": "Nombre de una persona",
  "email": "Correo electrónico de prueba",
  "linkedIn": "Perfil de LinkedIn de prueba"
}`;

  formatAndEraseBtn.textContent = "Organizar";

  livePreviewContent.innerHTML = `{
  "id": "abc123",
  "mocks": [
    {
      "id": "abc1234",
      "name": "Jordy",
      "email": "jordycastro1756@gmail.com",
      "linkedIn": "https://www.linkedin.com/in/yordicastro/"
    },
    {
      "id": "abc1235",
      "name": "Ernesto",
      "email": "ev402648@gmail.com",
      "linkedIn": "https://www.linkedin.com/in/ernesto224/"
    },
    {
      "id": "abc1236",
      "name": "Kenneth",
      "email": "kennethtorresbrizuela@gmail.com",
      "linkedIn": "https://www.linkedin.com/in/kennethtorres/"
    }
  ],
  "createdAt": "2026-03-31T08:58:48.372Z",
  "updatedAt": "2026-03-31T08:58:48.372Z"
}`;

  update(jsonTextarea);
  update(livePreviewContent);
};

jsonTextarea.addEventListener("input", () => update(jsonTextarea));
jsonTextarea.addEventListener("scroll", updateTextarea);
formatAndEraseBtn.addEventListener("click", handleFormatAndErase);
generateMocksBtn.addEventListener("click", handleGenerateMock);
copyLinkBtn.addEventListener("click", () => copy(`${API_URL}/${mockId}/mocks/`));

update(jsonTextarea);
update(livePreviewContent);
