(function (SE) {
  var h = SE.h;
  var cfg = SE.config;

  function field(label, id, control) {
    return h('div', { class: 'form-field' },
      h('label', { class: 'form-label', for: id }, label),
      control
    );
  }

  SE.pages.contact = {
    title: 'Contact',
    render: function () {
      var rows = [
        ['WhatsApp', cfg.contact.whatsapp],
        ['Phone', cfg.contact.phone],
        ['Email', cfg.contact.email],
        ['Instagram', cfg.contact.instagram],
        ['Location', cfg.contact.location]
      ];

      var message = h('textarea', { class: 'form-input', id: 'contact-message', name: 'message', required: true, rows: '5' });
      if (SE.state.contactPrefill) {
        message.value = SE.state.contactPrefill;
        SE.state.contactPrefill = null;
      }

      var status = h('p', { class: 'form-status', role: 'status', hidden: true });

      var form = h('form', {
        class: 'contact-form', 'aria-labelledby': 'contact-form-title',
        onsubmit: function (e) {
          e.preventDefault();
          // Phase 1: no backend. Be clear that nothing was sent.
          status.textContent = 'This enquiry form is not connected yet, so your message was not sent. Contact details will be added soon.';
          status.hidden = false;
        }
      },
        h('h2', { id: 'contact-form-title' }, 'Send an enquiry'),
        field('Name', 'contact-name', h('input', { class: 'form-input', id: 'contact-name', name: 'name', type: 'text', autocomplete: 'name', required: true })),
        field('Phone / WhatsApp', 'contact-phone', h('input', { class: 'form-input', id: 'contact-phone', name: 'phone', type: 'tel', autocomplete: 'tel', inputmode: 'tel', required: true })),
        field('Email', 'contact-email', h('input', { class: 'form-input', id: 'contact-email', name: 'email', type: 'email', autocomplete: 'email' })),
        field('Message', 'contact-message', message),
        h('button', { class: 'btn btn--primary', type: 'submit' }, 'SEND ENQUIRY'),
        status
      );

      return h('div', null,
        h('section', { class: 'page-hero' },
          h('div', { class: 'container' },
            h('p', { class: 'eyebrow' }, 'Contact'),
            h('h1', null, 'Get in touch'),
            h('p', null, 'Questions about equipment, or planning a bulk or academy order? Send us an enquiry.')
          )
        ),
        h('section', { class: 'section' },
          h('div', { class: 'container contact-grid' },
            h('dl', { class: 'contact-list' },
              rows.map(function (r) {
                return h('div', { class: 'contact-list__row' }, h('dt', null, r[0]), h('dd', null, r[1]));
              })
            ),
            form
          )
        )
      );
    }
  };
})(window.SE);
