Element.prototype.appendAfter = function (el) {
    el.parentNode.insertBefore(this, el.nextSibling);
};

function noop() {}

function _creteModalFooter(buttons = []) {

    if (buttons.length === 0) {
        return document.createElement('div');
    }

    const wrap = document.createElement('div');
    wrap.classList.add('modal-footer');
    buttons.forEach(btn => {
        const $btn = document.createElement('button');
        $btn.textContent = btn.title;
        $btn.classList.add('btn');
        $btn.classList.add(`btn-${btn.type || 'secondary'}`);
        $btn.onclick = btn.handler || noop;

        wrap.appendChild($btn);
    });
    return wrap;
}

function _createModal(options) {
    const DEFAULT_WIDTH = '600px';
    const modal = document.createElement('div');
    modal.classList.add('vmodal');
    modal.insertAdjacentHTML('afterbegin', `
    <div class="modal-overlay" data-close="true">
      <div class="modal-window" style="width:${options.width || DEFAULT_WIDTH}">
        <div class="modal-header">
          <span class="modal-title">${options.title || ''}</span>
          ${options.closable ? `<span class="modal-close" data-close="true">&times;</span>` : ''}
        </div>
        <div class="modal-body" data-body>
         ${options.body || ''}
        </div>
       
      </div>
    </div>
  `);
    document.body.appendChild(modal);

    const footer = _creteModalFooter(options.footerButtons);
    console.log(footer);
    footer.appendAfter(modal.querySelector('[data-body]'));
    return modal;
}

/*
* title: string
* closable: boolean
* content: string
* width: string ('400px')
* destroy(): void
* Окно должно закрываться
* --------------
* setContent(html: string): void | PUBLIC
* onClose(): void
* onOpen(): void
* beforeClose(): boolean
* --------------
* animate.css
* */
$.modal = function (options) {
    console.log();
    const ANIMATION_SPEED = 200;
    const $modal = _createModal(options);
    let closing = false;
    let destoryed = false;

    const modal = {
        open() {
            if (destoryed) {
                return console.error('Modal is destroyed');
            }
            !closing && $modal.classList.add('open');
        },
        close() {
            closing = true;
            $modal.classList.remove('open');
            $modal.classList.add('hide');
            setTimeout(() => {
                $modal.classList.remove('hide');
                closing = false
            }, ANIMATION_SPEED)
        }
    };
    const listener = e => e.target.dataset.close && modal.close();

    $modal.addEventListener('click', listener);

    return Object.assign(modal, {
        destroy() {
            setTimeout(() => {
                this.close();
            }, ANIMATION_SPEED);
            $modal.remove()
            $modal.removeEventListener('click', listener);
            destoryed = true;
        },
        setContent(html) {
            $modal.querySelector('[data-body]').innerHTML = html;
        }
    })
}
