# 🏆 KU Award - Client & Evaluator Portal

A fast, reactive frontend built with Svelte. This is the primary interface for students to apply for scholarships and
for academic leaders (Dept Heads, Deans) to review them.

## 👤 WebTech Team Members

| Student ID | Full Name (Nickname)                 |                  GitHub Username                  |
|:----------:|--------------------------------------|:-------------------------------------------------:|
| 6610401934 | Kerdsiri Srijaroen (Tonnam)          | [Tonwantpillow](https://github.com/Tonwantpillow) |
| 6610402132 | Bowornrat Tangnararatchakit (Bright) |        [thg1rb](https://github.com/thg1rb)        |
| 6610402205 | Rugsit Rungrattanachai (Nest)        |        [Rugsit](https://github.com/Rugsit)        |
| 6610405905 | Narakorn Thanapornpakdee (Nam)       |          [nk-n](https://github.com/nk-n)          |

## 👤 DevOps Team Members

| Student ID | Full Name (Nickname)                 |                  GitHub Username                  |
|:----------:|--------------------------------------|:-------------------------------------------------:|
| 6610401934 | Kerdsiri Srijaroen (Tonnam)          | [Tonwantpillow](https://github.com/Tonwantpillow) |
| 6610402116 | Tee Anusonsart (Tee)                 | [TeeAnusonsart](https://github.com/TeeAnusonsart) |
| 6610402132 | Bowornrat Tangnararatchakit (Bright) |        [thg1rb](https://github.com/thg1rb)        |
| 6610402183 | Pawat Chaijaroen (Keam)              |      [KeamKRUB](https://github.com/KeamKRUB)      |
| 6610402205 | Rugsit Rungrattanachai (Nest)        |        [Rugsit](https://github.com/Rugsit)        |
| 6610402272 | Isarapong Tuensakul (Game)           |     [Gamenakub](https://github.com/Gamenakub)     |
| 6610405905 | Narakorn Thanapornpakdee (Nam)       |          [nk-n](https://github.com/nk-n)          |

## 🛠 Tech Stack

* **Framework:** Svelte / SvelteKit
* **API:** Connected to the KU Award Laravel Server
* **Authentication:** Supports traditional credentials & Google OAuth

## 🌟 Key Features

* **Student Dashboard:** Submit one application per event.
    * View submission history.
    * **Visual Timeline:** Track the status of applications through various approval stages.
* **Reviewer Interface:**
    * **Department Heads:** View/Handle applications from their specific department.
    * **Deans & Associate Deans:** View/Handle applications for their entire faculty.
    * **Boards:** Final review interface.
* **Campus Separation:** Frontend logic respects campus-based data isolation.
* **Results Page:** A public-facing announcement page for scholarship results.

## 🔐 Account Management

* **Profile Editing:** Update personal info and change passwords.
* **Security Gate:** Access to services is blocked until the "Force Password Change" requirement is met.

## 🚀 Get Started

Copy the `.env` file

```shell
cp .env.example .env
```

Run the container

```shell
docker compose up -d
```

## 🎓 Student Activity Management System

| Role | Full Name | Username | Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| **นิสิต (NISIT)** | นรากร ธนภรภักดี | `narakorn` | `narakorn.th@ku.th` | `password` |
| **หัวหน้าภาค (DEPT_HEAD)** | สมชาย สายวิชาการ | `dept_head_01` | `dept.head@example.com` | `password` |
| **รองคณบดี (ASSO_DEAN)** | จิราพร รักษ์การศึกษา | `asso_dean_01` | `asso.dean@example.com` | `password` |
| **คณบดี (DEAN)** | วิชา ปัญญาเลิศ | `dean_01` | `dean@example.com` | `password` |
| **คณะกรรมการ (BOARD)** | อำนาจ ตัดสินใจ | `board_01` | `board@example.com` | `password` |
