/**
 * Tiny DOM helpers. Text is always inserted as text nodes (never as HTML),
 * so product names and other data cannot inject markup.
 */
(function (SE) {
  function append(parent, child) {
    if (child == null || child === false) return;
    if (Array.isArray(child)) {
      child.forEach(function (c) { append(parent, c); });
      return;
    }
    parent.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
  }

  /** h('div', { class: 'x', onclick: fn }, child, child...) */
  SE.h = function (tag, attrs) {
    var el = document.createElement(tag);
    var a = attrs || {};
    Object.keys(a).forEach(function (key) {
      var value = a[key];
      if (value == null || value === false) return;
      if (key === 'class') el.className = value;
      else if (key.slice(0, 2) === 'on' && typeof value === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (value === true) el.setAttribute(key, '');
      else el.setAttribute(key, value);
    });
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  };

  var ICONS = {
    cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3.5h2.7l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.1L20.5 8H6.1"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1.5 1.5 0 0 0 1.5 1.4h7a1.5 1.5 0 0 0 1.5-1.4L18 7M9 7V4.5h6V7"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>'
  };

  /** Inline SVG icon (static strings only). */
  SE.icon = function (name, size) {
    var s = size || 20;
    var t = document.createElement('template');
    t.innerHTML =
      '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      (ICONS[name] || '') + '</svg>';
    return t.content.firstElementChild;
  };
})(window.SE);
