const ENTER_KEYCODE = 13;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  const items = document.querySelector('.items');

  text.init(form, items);
});

const text = (() => {
  let items;

  function init(_form, _items) {
    items = _items;
    _form.addEventListener('submit', formHandler);

    for (let task of items.querySelectorAll('.item')) {
      const button = task.querySelector('.item__button');
      button.addEventListener('click', deleteItem);

      const checkbox = task.querySelector('.item__checkbox');
      checkbox.addEventListener('click', finish);

      const text = task.querySelector('.item__text');
      text.addEventListener('click', edit);
    }
  }

  function formHandler(e) {
    e.preventDefault();

    if(e.target.querySelector('.form__input').value.length > 0){
      const task = e.target.querySelector('.form__input');
      add(task.value);
      task.value = '';
    }
  }

  // event handler fyrir það að klára færslu
  function finish(e) {
    e.target.parentNode.classList.toggle('item--done');
  }

  // event handler fyrir það að breyta færslu
  function edit(e) {
    const { target } = e;
    const { textContent, parentNode } = target;

    parentNode.removeChild(target);

    const taskToEdit = el('input', 'item__edit');
    taskToEdit.setAttribute('type', 'text');
    taskToEdit.value = textContent;
    taskToEdit.addEventListener('keyup', commit);

    const button = parentNode.querySelector('item__button');

    parentNode.insertBefore(taskToEdit, button);
    taskToEdit.focus();
  }

  // event handler fyrir það að klára að breyta færslu
  function commit(e) {
    const { keyCode, target } = e;

    if (keyCode === ENTER_KEYCODE) {
      const { value, parentNode } = target;

      target.removeEventListener('keyup', commit);
      parentNode.removeChild(target);

      const text = el('span', 'item__text', edit);
      text.appendChild(document.createTextNode(value));

      const button = parentNode.querySelector('.item__button');

      parentNode.insertBefore(text, button);
    } else {
      return;
    }
  }

  // fall sem sér um að bæta við nýju item
  function add(value) {
    const newTask = el('li', 'item');

    const checkbox = el('input', 'item__checkbox', finish);
    checkbox.setAttribute('type', 'checkbox');

    const text = el('span', 'item__text', edit);
    text.appendChild(document.createTextNode(value));

    const button = el('button', 'item__button', deleteItem);
    button.appendChild(document.createTextNode('Eyða'));

    newTask.appendChild(checkbox);
    newTask.appendChild(text);
    newTask.appendChild(button);
    items.appendChild(newTask);
  }

  // event handler til að eyða færslu
  function deleteItem(e) {
    const taskToDelete = e.target.parentNode;

    const checkbox = taskToDelete.querySelector('.item__checkbox');
    checkbox.removeEventListener('click', finish);

    const text = taskToDelete.querySelector('.item__text');
    text.removeEventListener('click', edit);

    const button = taskToDelete.querySelector('.item__button');
    button.removeEventListener('click', deleteItem);

    taskToDelete.parentNode.removeChild(taskToDelete);
  }

  // hjálparfall til að útbúa element
  function el(type, className, clickHandler) {
    const task = document.createElement(type);

    if (className !== null) {
      task.classList.add(className);
    }

    if (clickHandler !== null) {
      task.addEventListener('click', clickHandler);
    }

    return task;
  }

  return {
    init: init
  }
})();
