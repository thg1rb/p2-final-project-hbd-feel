# 🏆 KU Award - Client & Evaluator Portal

A fast, reactive frontend built with Svelte. This is the primary interface for students to apply for scholarships and
for academic leaders (Dept Heads, Deans) to review them.

## 👤 Team Members (HBD Feel)

| Student ID | Full Name (Nickname)                 |                  GitHub Username                  |
|:----------:|--------------------------------------|:-------------------------------------------------:|
| 6610401934 | Kerdsiri Srijaroen (Tonnam)          | [Tonwantpillow](https://github.com/Tonwantpillow) |
| 6610402132 | Bowornrat Tangnararatchakit (Bright) |        [thg1rb](https://github.com/thg1rb)        |
| 6610402205 | Rugsit Rungrattanachai (Nest)        |        [Rugsit](https://github.com/Rugsit)        |
| 6610405905 | Narakorn Thanapornpakdee (Nam)       |          [nk-n](https://github.com/nk-n)          |

## 🛠 Tech Stack

* **Framework:** Svelte / SvelteKit
* **API:** Connected to the KU Award Laravel Server
* **Authentication:** Shared JWT/Session via Backend (Supports Password & Google OAuth)

## 🌟 Key Features

* **Student Dashboard:** * Submit one request per award type per event.
    * View submission history.
    * **Visual Timeline:** Track the real-time status of applications through various approval stages.
* **Reviewer Interface:** * **Department Heads:** View/Handle requests from their specific department.
    * **Deans & Associate Deans:** View/Handle requests for their entire faculty.
    * **Boards:** Final review interface.
* **Campus Separation:** Frontend logic respects campus-based data isolation.
* **Results Page:** A public-facing announcement page for scholarship results.

## 🔐 Account Management

* **Profile Editing:** Update personal info and change passwords.
* **Security Gate:** Access to services is blocked until the "Force Password Change" requirement is met.

## Get Started

Copy the `.env` file

```shell
cp .env.example .env
```

Run the container

```shell
docker compose up -d
```
