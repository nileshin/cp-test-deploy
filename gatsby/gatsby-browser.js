/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

export const onPreRouteUpdate = () => {
  // Close the menu on route navigation
  if (window && window.document) {
    const body = window.document.querySelector('body');
    const bodyClass = body.getAttribute('class') || '';
    if (bodyClass.indexOf('menu-open') >= 0) {
      const menu_icon = window.document.querySelector('.menu-icon.active');
      if (menu_icon) menu_icon.click();
    }
  }
}

export const onRouteUpdate = () => {
  if (window && window.document) {
    document.getElementById("___gatsby").focus();
  }
}