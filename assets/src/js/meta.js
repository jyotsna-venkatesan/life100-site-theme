/* -----------------------------------------------------------------------------
* getMetaInfo
----------------------------------------------------------------------------- */
export function getMetaInfo(element,id) {  
  const codeInjection = element.getAttribute('data-meta');
  element.removeAttribute('data-meta');
  if (!codeInjection) {
    return null;
  }

  // Create a temporary div to parse the HTML content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = codeInjection;

  // Find the script element by ID within the injected content
  const script = tempDiv.querySelector(`script#${id}`);
  if (!script) {
    return null;
  }

  let jsonString = script.innerHTML;
  if (jsonString.endsWith(";")) {
    jsonString = jsonString.slice(0, -1);
  }

  // Remove only unnecessary whitespace while preserving spaces in strings
  jsonString = jsonString.replace(/\s+(?=(?:(?:[^"]*"){2})*[^"]*$)/g, '');

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Invalid JSON:", error);
    return null;
  }
}