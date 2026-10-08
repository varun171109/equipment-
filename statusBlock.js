/**
 * Friendly loading / error / empty messages for the product areas.
 * These are the only texts customers see when data is slow or missing.
 */
(function (SE) {
  var h = SE.h;

  var MESSAGES = {
    loading: 'Loading equipment...',
    error: 'Unable to load products right now. Please try again.',
    empty: 'No equipment available at the moment. Please check back soon.'
  };

  SE.components.statusBlock = {
    messages: MESSAGES,

    loading: function () {
      return h('div', { class: 'status-block', role: 'status', 'aria-busy': 'true' },
        h('p', null, MESSAGES.loading));
    },

    empty: function () {
      return h('div', { class: 'status-block', role: 'status' },
        h('p', null, MESSAGES.empty));
    },

    /** onRetry (optional) adds a TRY AGAIN button. */
    error: function (onRetry) {
      return h('div', { class: 'status-block', role: 'alert' },
        h('p', null, MESSAGES.error),
        onRetry ? h('button', { class: 'btn btn--outline', type: 'button', onclick: onRetry }, 'TRY AGAIN') : null
      );
    }
  };
})(window.SE);
