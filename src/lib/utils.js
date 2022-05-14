
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

export function resize(node) {
  let CR
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
