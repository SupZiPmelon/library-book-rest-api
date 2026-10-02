\# นายนนนน วาสนานนท์ 660910667

\# Library Book (Reading List) - REST API Mini Project



ระบบจัดการรายการหนังสือส่วนตัว (Reading List) พัฒนาด้วยสถาปัตยกรรม REST API โดยใช้ Node.js และ Express สำหรับฝั่งเซิร์ฟเวอร์ และ Vanilla HTML/CSS/JavaScript สำหรับฝั่งไคลเอนต์



\## โครงสร้างโปรเจกต์

\- `/server/server.js`: ระบบเซิร์ฟเวอร์และ RESTful API Endpoints (GET, POST, PATCH, DELETE)

\- `/public/index.html`: โครงสร้างหน้าเว็บ Single Page Application

\- `/public/css/style.css`: ไฟล์จัดการสไตล์และ Responsive Design

\- `/public/js/app.js`: ไฟล์เชื่อมต่อ API และควบคุมการแสดงผล DOM



\## REST API Endpoints

\- `GET /api/books` - ดึงรายการหนังสือทั้งหมด (รองรับ Query filter: status, category, search)

\- `GET /api/books/:id` - ดึงรายละเอียดหนังสือตาม ID (ส่ง 404 หากไม่พบ)

\- `POST /api/books` - เพิ่มหนังสือใหม่ (ส่ง 201 Created เมื่อสำเร็จ, 400 Bad Request เมื่อข้อมูลไม่ครบ)

\- `PATCH /api/books/:id` - แก้ไขข้อมูลหนังสือ (ส่ง 200 OK หรือ 404 หากไม่พบ)

\- `DELETE /api/books/:id` - ลบหนังสือตาม ID (ส่ง 204 No Content เมื่อสำเร็จ, 404 หากไม่พบ)



\## วิธีการรันโปรเจกต์

1\. ติดตั้ง Dependencies:

   ```bash

   npm install

2\. รันเซิร์ฟเวอร์:

&#x20;  npm run dev

3\. เข้าใช้งาน: http://localhost:3000

