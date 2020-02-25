function _createCard(card) {

    const $card = document.createElement('div');
    $card.classList.add('col');
    $card.style.marginBottom = '30px';
    $card.setAttribute('data-card_id', card.id);
    $card.insertAdjacentHTML('afterbegin', `
      <div class="card" style="align-items: center; height: 100%; ">
        <img class="card-img-top" style="width: 300px;" src="${card.img}">
        <div class="card-body">
          <h5 class="card-title">${card.title}</h5>
          <a href="#" class="btn btn-primary" data-card_popup data-price="${card.price}">Посмотреть цену</a>
          <a href="#" class="btn btn-danger" data-card_delete>Удалить</a>
        </div>
      </div>
    `);
    return $card
}

function addListenerTo($parentNode, selector, eventName, func, funcParams = null) {
    $parentNode.querySelectorAll(selector).forEach(item => {
        item.addEventListener(eventName, (e) => {
            e.preventDefault();
            func(e, funcParams)
        })
    })
}

function addSetOfListeners($parentNode, items) {
    items.forEach(item => {
        addListenerTo($parentNode, item.selector, item.eventName, item.func, item.funcParams)
    })
}

function noop() {
}

$.card = function (cardsArray, modal) {

    if (typeof modal !== 'object') {
        modal = noop();
    }

    const $cards = document.createElement('div');
    $cards.classList.add('row');
    cardsArray.forEach(card => {
        $cards.appendChild(_createCard(card));
    });
    document.body.appendChild($cards);

    const cardsActions = {
        openCardPopup(e, params) {
            console.log(params)
            modal.setContent(`<h3>Цена: ${e.target.dataset.price}</h3>`);
            modal.open();
        },
        addCard(card) {
            const newCard = _createCard(card);
            $cards.appendChild(newCard);
            addSetOfListeners(newCard, listenerItems);
        },
        deleteCard(event) {
            modal.setContent('Вы увернны?');
            modal.setFooterButtons(
                [
                    {
                        text: 'Ок', type: 'primary', handler() {
                            modal.close();
                            event.target.closest('.col').remove();
                        }
                    },
                    {
                        text: 'Cancel', type: 'danger', handler() {
                            modal.close()
                        }
                    }
                ]
            )
            modal.open();
        },
        disposeCards() {
            $cards.remove();
        }
    };
    const listenerItems = [
        {selector: '[data-card_delete]', eventName: 'click', func: cardsActions.deleteCard},
        {
            selector: '[data-card_popup]',
            eventName: 'click',
            func: cardsActions.openCardPopup,
            funcParams: {text: '123123'}
        }
    ];

    addSetOfListeners($cards, listenerItems);

    return cardsActions;
};