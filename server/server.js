const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

let books = [
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin', category: 'Technology', status: 'reading', rating: 5, notes: 'สอนเรื่อง Clean Code' },
  { id: 2, title: 'Atomic Habits', author: 'James Clear', category: 'Self-Development', status: 'completed', rating: 5, notes: 'พัฒนาตัวเองวันละ 1%' },
  { id: 3, title: 'Design Patterns', author: 'Gang of Four', category: 'Technology', status: 'unread', rating: 4, notes: 'ดีไซน์แพตเทิร์นยอดนิยม' }
];
let nextId = 4;

app.get('/api/books', (req, res) => {
  const { category, status, search } = req.query;
  let results = [...books];
  if (category && category !== 'All') results = results.filter(b => b.category.toLowerCase() === category.toLowerCase());
  if (status && status !== 'All') results = results.filter(b => b.status.toLowerCase() === status.toLowerCase());
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  }
  res.json({ success: true, total: results.length, data: results });
});

app.get('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const book = books.find(b => b.id === id);
  if (!book) return res.status(404).json({ success: false, message: 'ไม่พบหนังสือ' });
  res.json({ success: true, data: book });
});

app.post('/api/books', (req, res) => {
  const { title, author, category, status, rating, notes } = req.body;
  if (!title || !author || !category) return res.status(400).json({ success: false, message: 'ข้อมูลไม่ครบถ้วน' });
  const newBook = { id: nextId++, title, author, category, status: status || 'unread', rating: Number(rating) || 0, notes: notes || '' };
  books.push(newBook);
  res.status(201).json({ success: true, data: newBook });
});

app.patch('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = books.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'ไม่พบหนังสือ' });
  books[idx] = { ...books[idx], ...req.body };
  res.json({ success: true, data: books[idx] });
});

app.delete('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = books.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'ไม่พบหนังสือ' });
  books.splice(idx, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});