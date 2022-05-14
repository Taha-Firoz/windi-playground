
/** Dispatch event on click outside of node */
/**
 * 
 * @param {Node} node 
 */
export function clickOutside(node) {
  
  /**
   * 
   * @param {Event} event 
   */
  const handleClick = event => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(
        new CustomEvent('click_outside', node)
      )
    }
  }

	document.addEventListener('click', handleClick, true);
  
  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    }
	}
}


/** Dispatch event on resize of node */
/**
 * 
 * @param {Node} node 
 */
export function resize(node) {
  /**
   * @type DOMRectReadOnly
   */
  let CR
  /**
   * @type Element
   */
  let ET
  const ro = new ResizeObserver((entries, observer) => {
      for (let entry of entries) {
          CR = entry.contentRect
          ET = entry.target
      }
      node.dispatchEvent(new CustomEvent('resize', {
          detail: { CR, ET }
      }));
  });
  ro.observe(node);
  return {
      destroy() {
          ro.disconnect();
      }
  }
}

/**
 * @typedef {[string, string, treeNode[]]} treeNode
 */


export const htmlTags =  ["div", "input", "textarea", "button"]

export const tagIdx = 0
export const classIdx = 1
export const childrenIdx = 2
