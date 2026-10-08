(function (SE) {
  var h = SE.h;
  var region = null;
  var timer = null;

  function ensureRegion() {
    if (region) return region;
    region = h('div', { class: 'toast-region', role: 'status', 'aria-live': 'polite' });
    document.body.appendChild(region);
    return region;
  }

  SE.toast = {
    /** show('Added to cart', { label: 'View cart', href: '#/cart' }) */
    show: function (message, action) {
      var r = ensureRegion();
      r.replaceChildren(
        h('div', { class: 'toast' },
          h('span', null, message),
          action ? h('a', { class: 'toast__link', href: action.href }, action.label) : null
        )
      );
      window.clearTimeout(timer);
      timer = window.setTimeout(function () { r.replaceChildren(); }, 4500);
    }
  };
})(window.SE);
