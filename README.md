# ✍ معرفی
<p align="center">
    <img src=".github/assets/banner.png" alt="B time banner" width="600">
</p>

<p align="center">
    <a href="https://discord.gg/p9TZzEV39e" target="_blank">
         <img src="https://discordapp.com/api/guilds/1088561568272367777/widget.png?style=banner2" alt="total" >
    </a>
    <br/>
<br/>
    <img src="https://img.shields.io/github/languages/top/sajjadmrx/btime-desktop" alt="languages" >
    <img src="https://img.shields.io/github/stars/sajjadmrx/btime-desktop" alt="stars">
    <img src="https://img.shields.io/github/downloads/sajjadmrx/btime-desktop/total.svg" alt="total" >
    <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="prettier" >
    <img src="https://img.shields.io/badge/antivirus-PASS-green" alt="antivirus" >
<br/>
<a href="https://daramet.com/sajjadmrx"  target="_blank"><img  width=100 src="https://github.com/user-attachments/assets/60f38bfe-1353-4518-8c96-d1b9cfdfc797" /></a>
</p>


لیستی از ویجت ها (نمایش تاریخ، قیمت ارز، آب و هوا ) برای سیستم عامل های ویندوز،مک، لینوکس

<p align="center">
    <img src="https://github.com/user-attachments/assets/c69ea776-1f40-489e-872e-1e38bdb6b0d9" alt="gif" >
</p>

- [✍ معرفی](#-معرفی)
  - [📥 دانلود](#-دانلود)
  - [🦠 نتیجه آنتی ویروس](#-نتیجه-آنتی-ویروس)
  - [📝 تغییرات](#-تغییرات)
- [🛡️ حریم خصوصی](#️-حریم-خصوصی)
  - [🛠 همکاری](#-همکاری)
  - [🚀 CI/CD Pipelines](#-cicd-pipelines)

## 📥 دانلود

جهت دانلود [اینجا](https://github.com/sajjadmrx/btime-desktop/releases) کلیک کنید و نسخه مورد نظر رو انتخاب کنید.
| Platform | Status |
|----------|----------|
| Windows | ✅ Stable|
| MacOS | ✅ Stable |
| Linux | ✅ Stable |

## 🦠 نتیجه آنتی ویروس

جهت مشاهده نتیجه آنتی ویروس [اینجا](https://www.virustotal.com/gui/file/e2206493bd724407c9a0d0617f42d0d9df0ee6f1feb4283e6d74371e1cf39aee?nocache=1) کلیک کنید

## 📝 تغییرات

شما میتونید تغییرات رو از [changelog](changelog.md) مشاهده کنید

# 🛡️ حریم خصوصی

[PRIVACY.md](./PRIVACY.md)

## 🛠 همکاری

[CONTRIBUTING.md](./CONTRIBUTING.md)

## 🚀 CI/CD Pipelines

This project uses GitHub Actions for continuous integration (CI) and continuous deployment (CD). The CI/CD pipelines are configured in the following workflow files:

- `.github/workflows/build.yml`: This workflow runs on `push` events, excluding changes to `.yml` files and files in the `.github` directory. It includes steps for checking out the repository, setting up Node.js, caching dependencies, installing dependencies, building the project, running tests, linting the code, and generating code coverage reports.

- `.github/workflows/pull.yml`: This workflow runs on `pull_request` events, excluding changes to `.md` files and files in the `.github` directory. It includes steps for checking out the repository, setting up Node.js, caching dependencies, installing dependencies, building the project, running tests, linting the code, and generating code coverage reports.

- `.github/workflows/release.yml`: This workflow runs on `push` events to the `main` branch, excluding changes to `README.md`, `README-*.md`, and files in the `.github/ISSUE_TEMPLATE` directory. It includes steps for checking out the repository, setting up Node.js, caching dependencies, installing dependencies, building the project, running tests, linting the code, generating code coverage reports, and deploying the project to a staging environment. Additionally, it includes steps for publishing the built project to GitHub for Linux, Windows, and macOS.

درحال تکمیل فایل توضیحات....
