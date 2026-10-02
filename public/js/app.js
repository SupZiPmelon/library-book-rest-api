const API_URL = '/api/books';
let editId = null;

const form = document.getElementById('book-form');
const titleInp = document.getElementById('title');
const authorInp = document.getElementById('author');
const categoryInp = document.getElementById('category');
const statusInp = document.getElementById('status');
const ratingInp = document.getElementById('rating');
const notesInp = document.getElementById('notes');

const formTitle = document.getElementById('form-title');
const btnSubmit = document.getElementById('btn-submit');
const btnCancel = document.getElementById('btn-cancel');

const booksList = document.getElementById('books-list');
const searchInp = document.getElementById('search-input');
const filterStatus = document.getElementById('filter-status');
const filterCategory = document.getElementById('filter-category');

document.addEventListener('DOMContentLoaded', () => {
  loadBooks();
  form.addEventListener('submit', onSubmit);
  btnCancel.addEventListener('click', resetForm);
  searchInp.addEventListener('input', () => loadBooks());
  filterStatus.addEventListener('change', () => loadBooks());
  filterCategory.addEventListener('change', () => loadBooks());
});

// GET /api/books (พร้อม query string)
async function loadBooks() {
  try {
    const params = new URLSearchParams();
    if (searchInp.value.trim()) params.append('search', searchInp.value.trim());
    if (filterStatus.value !== 'All') params.append('status', filterStatus.value);
    if (filterCategory.value !== 'All') params.append('category', filterCategory.value);

    const res = await fetch(`${API_URL}?${params.toString()}`);
    const data = await res.json();
    renderBooks(data.data);
    updateStats(data.data);
  } catch (err) {
    console.error('Error fetching books:', err);
  }
}

function renderBooks(books) {
  if (!books || !books.length) {
    booksList.innerHTML = '<p style="text-align:center; color:#94a3b8; padding:30px;">📭 ไม่พบรายการหนังสือ</p>';
    return;
  }

  booksList.innerHTML = books.map(b => `
    <div class="book-card">
      <div>
        <span class="badge badge-${b.status}">${b.status}</span>
        <span style="font-size:0.8rem; color:#64748b; margin-left:6px;">[${b.category}]</span>
        <h3>${b.title}</h3>
        <p>ผู้แต่ง: <strong>${b.author}</strong> | คะแนน: ${'⭐'.repeat(b.rating || 0)}</p>
        ${b.notes ? `<p style="margin-top:6px; font-style:italic; color:#475569;">"${b.notes}"</p>` : ''}
      </div>
      <div class="actions">
        <button type="button" class="btn-edit" onclick="onEdit(${b.id})">✏️ แก้ไข</button>
        <button type="button" class="btn-del" onclick="onDelete(${b.id})">🗑️ ลบ</button>
      </div>
    </div>
  `).join('');
}

// POST หรือ PATCH
async function onSubmit(e) {
  e.preventDefault();
  const payload = {
    title: titleInp.value,
    author: authorInp.value,
    category: categoryInp.value,
    status: statusInp.value,
    rating: Number(ratingInp.value),
    notes: notesInp.value
  };

  if (editId) {
    // PATCH /api/books/:id
    await fetch(`${API_URL}/${editId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } else {
    // POST /api/books
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  resetForm();
  loadBooks();
}

// GET /api/books/:id
window.onEdit = async function(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const { data } = await res.json();
  
  editId = data.id;
  titleInp.value = data.title;
  authorInp.value = data.author;
  categoryInp.value = data.category;
  statusInp.value = data.status;
  ratingInp.value = data.rating;
  notesInp.value = data.notes || '';

  formTitle.textContent = `✏️ แก้ไขหนังสือ (#${data.id})`;
  btnSubmit.textContent = 'บันทึกการแก้ไข';
  btnCancel.style.display = 'inline-block';
};

// DELETE /api/books/:id
window.onDelete = async function(id) {
  if (!confirm(`ต้องการลบหนังสือรหัส #${id} ใช่หรือไม่?`)) return;
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (editId === id) resetForm();
  loadBooks();
};

function resetForm() {
  editId = null;
  form.reset();
  formTitle.textContent = '➕ เพิ่มหนังสือใหม่';
  btnSubmit.textContent = 'บันทึกข้อมูล';
  btnCancel.style.display = 'none';
}

function updateStats(books) {
  if (!books) return;
  document.getElementById('stat-total').textContent = books.length;
  document.getElementById('stat-reading').textContent = books.filter(b => b.status === 'reading').length;
  document.getElementById('stat-completed').textContent = books.filter(b => b.status === 'completed').length;
  document.getElementById('stat-unread').textContent = books.filter(b => b.status === 'unread').length;
}