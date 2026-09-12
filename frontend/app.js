async function loadNotes() {
  const response = await fetch('http://localhost:3000/notes');
  const notes = await response.json();

  const list = document.getElementById('notesList');
  list.innerHTML = '';

  notes.forEach(note => {
    const li = document.createElement('li');
    li.textContent = note.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', async () => {
      await fetch(`http://localhost:3000/notes/${note.id}`, {
        method: 'DELETE'
      });
      loadNotes();
    });
    li.appendChild(deleteBtn);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', async () => {
      const newText = prompt('Edit your note:', note.text);
      if (newText === null) {
        return;
      }
      await fetch(`http://localhost:3000/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText })
      });
      loadNotes();
    });
    li.appendChild(editBtn);

    list.appendChild(li);
  });
}

loadNotes();

const input = document.getElementById('noteInput');

document.getElementById('addBtn').addEventListener('click', async () => {
  text = input.value;
  await fetch('http://localhost:3000/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text })
  });
  input.value = '';
  loadNotes();
});