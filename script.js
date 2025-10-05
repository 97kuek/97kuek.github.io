
document.addEventListener('DOMContentLoaded', () => {
    const langToggle = document.getElementById('lang-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const header = document.querySelector('header');
    const userLang = navigator.language || navigator.userLanguage;

    // --- Theme (Dark Mode) ---
    const sunIcon = '<i class="fa-solid fa-sun"></i>';
    const moonIcon = '<i class="fa-solid fa-moon"></i>';

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = sunIcon;
        } else {
            document.body.classList.remove('dark-mode');
            themeToggle.innerHTML = moonIcon;
        }
    }

    function toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    }

    themeToggle.addEventListener('click', toggleTheme);

    // --- Header Scroll ---
    const backToTopButton = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        // Header scroll effect
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    // --- Back to Top Click ---
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Scroll Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    const translations = {
        'ja': {
            'title': 'Keitaro Ueki - 早稲田大学基幹理工学部',
            'name': 'Keitaro Ueki',
            'affiliation': '早稲田大学 基幹理工学部 情報通信学科 学部2年',
            'about-title': 'About Me',
            'about-text': '・2005年生まれ<br>・2018年4月桐蔭学園中等教育学校入学<br>・2023年3月桐蔭学園中等教育学校卒業<br>・2024年4月早稲田大学基幹理工学部学系2入学<br>・2025年4月早稲田大学基幹理工学部情報通信学科進学<br><br>趣味は映画鑑賞・ドラム演奏です。人力飛行機を製作するプロジェクトに所属しており、日々主翼や尾翼を製作しています。',
            'research-title': 'Research Interests',
            'research-item-1': '音響信号処理',
            'research-item-2': '自然言語処理',
            'research-item-3': '生命情報科学',
            'research-item-4': '遺伝的アルゴリズムによる最適化',
            'publications-title': 'Publications & Projects',
            'project-1-title': 'プロジェクト名 or 論文タイトル 1',
            'project-1-meta': '<strong>[学会名 or 雑誌名], 2024.</strong>',
            'project-1-desc': 'ここに簡単な概要を記述します。共著者がいる場合はそれも記載します。',
            'project-2-title': 'プロジェクト名 or 論文タイトル 2',
            'project-2-meta': '<strong>[進行中], 2025.</strong>',
            'project-2-desc': '現在進行中のプロジェクトや研究について記述します。',
            'contact-title': 'Contact',
            'contact-text': 'ご意見、ご質問などありましたら、お気軽にご連絡ください。',
            'footer-text': '&copy; 2025 Keitaro Ueki. All Rights Reserved.',
            'lang-btn': 'English'
        },
        'en': {
            'title': 'Keitaro Ueki - Waseda University',
            'name': 'Keitaro Ueki',
            'affiliation': 'B2, Dept. of Communications and Computer Engineering, Waseda University',
            'about-title': 'About Me',
            'about-text': 'Born in 2005.<br>After graduating from Toin Gakuen Secondary Education School, I entered the School of Fundamental Science and Engineering at Waseda University.<br>I am currently a sophomore with an interest in natural language processing and acoustic signal processing.<br>My hobbies include watching movies, listening to music, programming, and playing the drums.<br>I am also participating in the university\'s human-powered aircraft project, working daily on the construction of the main and tail wings.',
            'research-title': 'Research Interests',
            'research-item-1': 'Acoustic Signal Processing',
            'research-item-2': 'Natural Language Processing',
            'research-item-3': 'Bioinformatics',
            'research-item-4': 'Optimization with Genetic Algorithms',
            'publications-title': 'Publications & Projects',
            'project-1-title': 'Project or Publication Title 1',
            'project-1-meta': '<strong>[Conference or Journal Name], 2024.</strong>',
            'project-1-desc': 'A brief description of the project or publication. Co-authors can also be mentioned here.',
            'project-2-title': 'Project or Publication Title 2',
            'project-2-meta': '<strong>[In Progress], 2025.</strong>',
            'project-2-desc': 'Description of ongoing projects or research.',
            'contact-title': 'Contact',
            'contact-text': 'Please feel free to contact me with any comments or questions.',
            'footer-text': '&copy; 2025 Keitaro Ueki. All Rights Reserved.',
            'lang-btn': '日本語'
        }
    };

    function setLanguage(lang) {
        document.documentElement.lang = lang;
        document.title = translations[lang]['title'];
        
        const elements = document.querySelectorAll('[data-lang-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-lang-key');
            if (translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });
        langToggle.textContent = translations[lang]['lang-btn'];
        langToggle.setAttribute('data-current-lang', lang);
    }

    function toggleLanguage() {
        const currentLang = langToggle.getAttribute('data-current-lang');
        const newLang = currentLang === 'ja' ? 'en' : 'ja';
        setLanguage(newLang);
    }

    langToggle.addEventListener('click', toggleLanguage);

    // --- Initial Setup ---
    // 1. Set theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);

    // 2. Set initial language based on browser settings
    const initialLang = userLang.startsWith('ja') ? 'ja' : 'en';
    setLanguage(initialLang);
});
