# 📱 Edu-Attend
A mobile-first system that enables teachers to mark absent students before exams and syncs the data with backend staff for processing and sorting. Student lists are preloaded by the admin team a day before the exam and are automatically reflected in the app.

---

## 🚀 Features

- 🔐 Teacher login and classroom selection
- 📋 View student list (available only 1 day before exam)
- ✅ Mark absentees via checkbox
- 📤 Auto-submit absent list to backend
- 🗃️ Backend admin panel to upload student CSVs
- 🧮 Course-wise and ascending order sorting for staff
- 📱 Built for mobile-first usage

---

## 📌 Tech Stack

### Frontend (Mobile App)
- React Native / Flutter
- Axios for API calls

### Backend
- Node.js with Express.js (or Django/FastAPI)
- REST APIs
- Role-based access (Teacher/Admin)

### Database
- PostgreSQL (preferred)
- Sequelize ORM (or Prisma/TypeORM)

### Admin Panel (Web)
- React.js / Next.js
- CSV Upload Interface

---

## 🧪 Usage

### 1. Admin Uploads Student List
- Via web dashboard → Upload `.csv` file with columns:
  `Classroom, Student Name, USN, Course, Exam Date`

### 2. Teacher Marks Absentees
- Login → Select classroom → Check absentees → Submit

### 3. Management Staff
- Fetch absentee list
- View sorted course-wise absentee report

---

## 📅 Smart Visibility

Student lists become visible to teachers **only 1 day before the exam**, controlled by backend logic.

---

## 🔧 Future Enhancements

- Notifications for missing entries
- Offline marking and sync
- Analytics dashboard for staff
- Multi-language support
