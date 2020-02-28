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

function addOrRemoveListenerTo($parentNode, addOrRemoveEventListener, selector, eventName, func, funcParams = null) {
    $parentNode.querySelectorAll(selector).forEach(item => item[addOrRemoveEventListener](eventName, func, funcParams))
}

function addSetOfListeners($parentNode, items) {
    items.forEach(item => addOrRemoveListenerTo($parentNode, 'addEventListener', item.selector, item.eventName, item.func, item.funcParams))
}

function removeSetOfListeners($parentNode, items) {
    items.forEach(item => addOrRemoveListenerTo($parentNode, 'removeEventListener', item.selector, item.eventName, item.func, item.funcParams))
}


$.card = function (cardsArray) {
    const $cards = document.createElement('div');
    $cards.classList.add('row');
    cardsArray.forEach(card => {
        $cards.appendChild(_createCard(card));
    });
    document.body.appendChild($cards);
    const confirmDeleteEvent = new CustomEvent("confirmDelete", {bubbles: true});
    const showPriceEvent = new CustomEvent("showPrice", {bubbles: true});
    const cardsActions = {
        addCard: function (card) {
            const newCard = _createCard(card);
            $cards.appendChild(newCard);
            addSetOfListeners(newCard, listenerItems);
        },
        openCardPopup: function (e) {
            e.preventDefault()
            e.target.dispatchEvent(showPriceEvent);
        },
        deleteCard: function (e) {
            e.preventDefault()
            e.target.dispatchEvent(confirmDeleteEvent);
        },
        confirmDelete: function (e) {
            e.preventDefault()
            const parent = e.target.closest('.col');
            removeSetOfListeners(parent, listenerItems);
            parent.remove();
        },
        disposeCards: function () {
            removeSetOfListeners($cards, listenerItems);
            document.body.removeEventListener("confirmDelete", () => {},false);
            document.body.removeEventListener("showPrice",() => {}, false);
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
    return Object.assign(cardsActions);
};