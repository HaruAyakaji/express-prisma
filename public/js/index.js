import * as bootstrap from 'bootstrap';

function fadeAway(tr) {
  tr?.animate(
    [
      {
        transform: 'scale(0)',
      },
    ],
    500
  ).addEventListener('finish', () => {
    tr.remove();
    renderIndex();
  });
}

function formReset() {
  document.querySelector('#modal-name').value = sessionStorage.name;
  document.querySelector('#modal-age').value = sessionStorage.age;
  document.querySelector('#modal-birth').value = sessionStorage.birth;
}

function renderIndex() {
  document.querySelectorAll('#showArea tr td:first-child').forEach((elem, k) => {
    elem.textContent = k + 1;
  });
}

function render(data) {
  if (!data) {
    return;
  }
  const tr = document.createElement('tr');
  tr.setAttribute('data-id', data.id);
  const td1 = document.createElement('td');
  const td2 = document.createElement('td');
  td2.textContent = data.name;
  const td3 = document.createElement('td');
  td3.textContent = data.age;
  const td4 = document.createElement('td');
  td4.textContent = data.birth?.split('T')[0];
  const td5 = document.createElement('td');
  const i5 = document.createElement('i');
  i5.classList.add('bi', 'bi-pencil-fill', 'btn', 'btn-sm', 'btn-outline-green');
  td5.append(i5);
  const td6 = document.createElement('td');
  const i6 = document.createElement('i');
  i6.classList.add('bi', 'bi-trash3-fill', 'btn', 'btn-sm', 'btn-outline-red');
  td6.append(i6);
  tr.append(td1, td2, td3, td4, td5, td6);
  document.querySelector('#showArea').append(tr);

  const editBtn = tr.querySelector('.bi-pencil-fill');
  editBtn.addEventListener('click', async () => {
    sessionStorage.characterId = tr.getAttribute('data-id');
    const response = await fetch(`/api/${sessionStorage.characterId}`);
    if (response.ok) {
      const data = await response.json();
      if (data) {
        document.querySelector('#controlLabel').textContent = 'Update character';
        document.querySelector('#btn1').textContent = 'Update';
        document.querySelector('#modal-message').textContent = '';

        sessionStorage.name = data.name;
        sessionStorage.age = data.age;
        sessionStorage.birth = data.birth?.split('T')[0];
        bootstrap.Modal.getOrCreateInstance('#controller').show();
      } else {
        fadeAway(tr);
        bootstrap.Modal.getOrCreateInstance('#errorMsg').show();
      }
    }
  });

  const deleteBtn = tr.querySelector('.bi-trash3-fill');
  deleteBtn.addEventListener('click', async () => {
    const id = tr.getAttribute('data-id');
    const response = await fetch(`/api/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      fadeAway(tr);
    }
  });
}

async function createCharacter() {
  const response = await fetch('/api', {
    method: 'POST',
    body: new FormData(document.querySelector('#modal-form')),
  });

  if (response.ok) {
    render(await response.json());
    renderIndex();
    bootstrap.Modal.getOrCreateInstance('#controller').hide();
  } else {
    const error = await response.json();
    document.querySelector('#modal-message').textContent = error.message;
  }
}

async function updateCharacter() {
  const response = await fetch(`/api/${sessionStorage.characterId}`, {
    method: 'PATCH',
    body: new FormData(document.querySelector('#modal-form')),
  });

  if (response.ok) {
    const data = await response.json();
    const tr = document.querySelector(`[data-id="${sessionStorage.characterId}"]`);
    if (tr) {
      if (data) {
        tr.querySelector('td:nth-child(2)').textContent = data.name;
        tr.querySelector('td:nth-child(3)').textContent = data.age;
        tr.querySelector('td:nth-child(4)').textContent = data.birth?.split('T')[0];
      } else {
        fadeAway(tr);
        bootstrap.Modal.getOrCreateInstance('#errorMsg').show();
      }
    }
    bootstrap.Modal.getOrCreateInstance('#controller').hide();
  } else {
    const error = await response.json();
    document.querySelector('#modal-message').textContent = error.message;
  }
}

new bootstrap.Popover('#logo', {
  trigger: 'hover',
});

addEventListener('pageshow', async () => {
  const response = await fetch('/api');
  if (response.ok) {
    const datas = await response.json();
    for (const data of datas) {
      render(data);
    }
    renderIndex();
  }
});

document.querySelector('#create').addEventListener('click', () => {
  document.querySelector('#controlLabel').textContent = 'Create character';
  document.querySelector('#btn1').textContent = 'Create';
  document.querySelector('#modal-message').textContent = '';

  delete sessionStorage.characterId;
  sessionStorage.name = '';
  sessionStorage.age = '';
  sessionStorage.birth = '';
  bootstrap.Modal.getOrCreateInstance('#controller').show();
});

document.querySelector('#btn1').addEventListener('click', async () => {
  if (sessionStorage.characterId) {
    await updateCharacter();
  } else {
    await createCharacter();
  }
});

document.querySelector('#btn2').addEventListener('click', formReset);
document.querySelector('#controller').addEventListener('show.bs.modal', formReset);
