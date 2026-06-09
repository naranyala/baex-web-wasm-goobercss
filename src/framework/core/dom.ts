/**
 * Lightweight DOM patching utility to avoid full innerHTML overwrites.
 */

export function patch(container: HTMLElement, newHTML: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(newHTML, 'text/html');
  const newNodes = Array.from(doc.body.childNodes);
  const oldNodes = Array.from(container.childNodes);

  const max = Math.max(newNodes.length, oldNodes.length);

  for (let i = 0; i < max; i++) {
    const oldNode = oldNodes[i];
    const newNode = newNodes[i];

    if (!oldNode) {
      // Add new node
      if (newNode) container.appendChild(newNode.cloneNode(true));
    } else if (!newNode) {
      // Remove old node
      container.removeChild(oldNode);
    } else if (oldNode.nodeType !== newNode.nodeType) {
      // Replace node if type changed
      container.replaceChild(newNode.cloneNode(true), oldNode);
    } else if (oldNode.nodeType === Node.TEXT_NODE) {
      // Update text content
      if (oldNode.textContent !== newNode.textContent) {
        oldNode.textContent = newNode.textContent || '';
      }
    } else if (
      oldNode instanceof HTMLElement &&
      newNode instanceof HTMLElement
    ) {
      // Update attributes and recurse
      updateAttributes(oldNode, newNode);
      patch(oldNode, newNode.innerHTML);
    }
  }
}

function updateAttributes(oldEl: HTMLElement, newEl: HTMLElement) {
  const oldAttrs = oldEl.getAttributeNames();
  const newAttrs = newEl.getAttributeNames();

  // Remove old attributes not in new set
  for (const attr of oldAttrs) {
    if (!newAttrs.includes(attr)) {
      oldEl.removeAttribute(attr);
    }
  }

  // Update or add new attributes
  for (const attr of newAttrs) {
    const newVal = newEl.getAttribute(attr);
    if (oldEl.getAttribute(attr) !== newVal) {
      oldEl.setAttribute(attr, newVal || '');
    }
  }
}
