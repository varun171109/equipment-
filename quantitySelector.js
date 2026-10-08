/**
 * Quantity selector:  [ - ]  1  [ + ]
 *
 * options:
 *   value     starting quantity
 *   id        id for the number input (buttons get id-dec / id-inc)
 *   label     accessible label
 *   live      true (default): onChange fires while typing.
 *             false: onChange fires only when the value is committed
 *             (Enter, leaving the field, or +/- buttons).
 *   onChange  function (quantity)
 *
 * returns { el, getValue(), setValue(quantity, silent) }
 */
(function (SE) {
  var h = SE.h;

  SE.components.quantitySelector = function (options) {
    var opts = options || {};
    var max = SE.config.maxQuantity;
    var clamp = SE.pricing.clampQuantity;
    var live = opts.live !== false;
    var label = opts.label || 'Quantity';
    var q = clamp(opts.value || 1);

    var input = h('input', {
      class: 'qty__input', type: 'number', inputmode: 'numeric',
      min: '1', max: String(max), step: '1', value: String(q),
      id: opts.id, 'aria-label': label
    });
    var dec = h('button', {
      class: 'qty__btn', type: 'button', id: opts.id ? opts.id + '-dec' : null,
      'aria-label': 'Decrease quantity'
    }, SE.icon('minus'));
    var inc = h('button', {
      class: 'qty__btn', type: 'button', id: opts.id ? opts.id + '-inc' : null,
      'aria-label': 'Increase quantity'
    }, SE.icon('plus'));

    // aria-disabled (not disabled) so keyboard focus is never lost at the limits
    function refresh() {
      dec.setAttribute('aria-disabled', String(q <= 1));
      inc.setAttribute('aria-disabled', String(q >= max));
    }

    function setValue(next, silent) {
      q = clamp(next);
      input.value = String(q);
      refresh();
      if (!silent && opts.onChange) opts.onChange(q);
    }

    dec.addEventListener('click', function () { if (q > 1) setValue(q - 1); });
    inc.addEventListener('click', function () { if (q < max) setValue(q + 1); });

    input.addEventListener('input', function () {
      if (!live) return;
      var n = parseInt(input.value, 10);
      if (!isFinite(n) || n < 1) return; // wait until the field is committed
      var c = clamp(n);
      q = c;
      if (c !== n) input.value = String(c);
      refresh();
      if (opts.onChange) opts.onChange(q);
    });

    function commit() {
      var n = parseInt(input.value, 10);
      setValue(isFinite(n) ? n : q);
    }
    input.addEventListener('change', commit);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); commit(); }
    });

    refresh();

    return {
      el: h('div', { class: 'qty', role: 'group', 'aria-label': label }, dec, input, inc),
      getValue: function () { return q; },
      setValue: setValue
    };
  };
})(window.SE);
