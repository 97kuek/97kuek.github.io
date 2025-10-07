
document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selectors ---
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const contentWrapper = document.getElementById('content-wrapper');
    const themeToggle = document.getElementById('theme-toggle');
    const langToggle = document.getElementById('lang-toggle');
    const searchToggle = document.getElementById('search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const backToTopButton = document.getElementById('back-to-top');

    // --- Sidebar --- 
    sidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        document.body.classList.toggle('sidebar-open');
    });

    contentWrapper.addEventListener('click', () => {
        if (document.body.classList.contains('sidebar-open')) {
            document.body.classList.remove('sidebar-open');
        }
    });

    // --- Search --- 
    searchToggle.addEventListener('click', () => {
        searchOverlay.classList.add('visible');
        searchInput.focus();
    });

    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('visible');
        }
    });

    // --- Language & Search Data ---
    const translations = {
        'ja': {
            'title': 'Keitaro Ueki - 早稲田大学基幹理工学部',
            'name': 'Keitaro Ueki',
            'affiliation': '早稲田大学 基幹理工学部',
            'nav-home': 'Home', 'nav-about': 'About', 'nav-research': 'Research', 'nav-publications': 'Publications', 'nav-blog': 'Blog', 'nav-contact': 'Contact',
            'about-title': 'About Me', 'about-description': '経歴やスキルについて',
            'education-title': '学歴', 'birth-event': '誕生', 'school-start-event': '桐蔭学園中等教育学校 入学', 'school-end-event': '桐蔭学園中等教育学校 卒業', 'uni-start-event': '早稲田大学基幹理工学部 学系II 入学', 'major-event': '早稲田大学基幹理工学部 情報通信学科 進学',
            'hobbies-title': '趣味', 'hobbies-text': '映画鑑賞、ドラム演奏。人力飛行機を製作するプロジェクトに所属しており、日々主翼や尾翼を製作しています。',
            'research-title': 'Research Interests', 'research-description': '現在の研究内容',
            'research-item-1': '音響信号処理', 'research-item-2': '自然言語処理', 'research-item-3': '生命情報科学', 'research-item-4': '遺伝的アルゴリズムによる最適化',
            'publications-title': 'Publications & Projects', 'publications-description': '過去の論文や発表',
            'project-1-title': 'プロジェクト名 or 論文タイトル 1', 'project-1-meta': '[学会名 or 雑誌名], 2024.', 'project-1-desc': 'ここに簡単な概要を記述します。共著者がいる場合はそれも記載します。',
            'project-2-title': 'プロジェクト名 or 論文タイトル 2', 'project-2-meta': '[進行中], 2025.', 'project-2-desc': '現在進行中のプロジェクトや研究について記述します。',
            'blog-title': 'Blog', 'blog-description': '日々の考えや学び',
            'blog-post-1-title': '新しいウェブサイト', 'blog-post-1-meta': '2025年10月7日', 'blog-post-1-body': '新しいウェブサイトへようこそ！このブログでは、私の研究、プロジェクト、そして興味のあることについて書いていこうと思います。',
            'blog-post-2-title': '最近の活動', 'blog-post-2-meta': '2025年10月6日', 'blog-post-2-body': '最近は、人力飛行機の製作に多くの時間を費やしています。主翼の設計と製作は非常に挑戦的ですが、とてもやりがいがあります。',
            'contact-title': 'Contact', 'contact-description': 'お問い合わせはこちら', 'contact-text': 'ご意見、ご質問などありましたら、お気軽にご連絡ください。',
            'footer-text': '© 2025 Keitaro Ueki. All Rights Reserved.',
        },
        'en': {
            'title': 'Keitaro Ueki - Waseda University',
            'name': 'Keitaro Ueki',
            'affiliation': 'School of Fundamental Science and Engineering, Waseda University',
            'nav-home': 'Home', 'nav-about': 'About', 'nav-research': 'Research', 'nav-publications': 'Publications', 'nav-blog': 'Blog', 'nav-contact': 'Contact',
            'about-title': 'About Me', 'about-description': 'About my career and skills.',
            'education-title': 'Education', 'birth-event': 'Born', 'school-start-event': 'Entered Toin Gakuen Secondary Education School', 'school-end-event': 'Graduated from Toin Gakuen Secondary Education School', 'uni-start-event': 'Entered Department II, School of Fundamental Science and Engineering, Waseda University', 'major-event': 'Advancing to the Department of Communications and Computer Engineering',
            'hobbies-title': 'Hobbies', 'hobbies-text': 'Watching movies, playing the drums. I belong to a project that builds human-powered aircraft, and I am involved in the daily production of the main and tail wings.',
            'research-title': 'Research Interests', 'research-description': 'Current research topics.',
            'research-item-1': 'Acoustic Signal Processing', 'research-item-2': 'Natural Language Processing', 'research-item-3': 'Bioinformatics', 'research-item-4': 'Optimization with Genetic Algorithms',
            'publications-title': 'Publications & Projects', 'publications-description': 'Past papers and presentations.',
            'project-1-title': 'Project or Publication Title 1', 'project-1-meta': '[Conference or Journal Name], 2024.', 'project-1-desc': 'A brief description of the project or publication. Co-authors can also be mentioned here.',
            'project-2-title': 'Project or Publication Title 2', 'project-2-meta': '[In Progress], 2025.', 'project-2-desc': 'Description of ongoing projects or research.',
            'blog-title': 'Blog', 'blog-description': 'Daily thoughts and learnings.',
            'blog-post-1-title': 'New Website', 'blog-post-1-meta': 'October 7, 2025', 'blog-post-1-body': 'Welcome to my new website! In this blog, I will write about my research, projects, and interests.',
            'blog-post-2-title': 'Recent Activities', 'blog-post-2-meta': 'October 6, 2025', 'blog-post-2-body': 'Recently, I have been spending a lot of time building a human-powered aircraft. Designing and building the main wing is very challenging, but also very rewarding.',
            'contact-title': 'Contact', 'contact-description': 'Contact me here.', 'contact-text': 'Please feel free to contact me with any comments or questions.',
            'footer-text': '© 2025 Keitaro Ueki. All Rights Reserved.',
        }
    };

    const keyToPage = {
        'about-title': { url: 'about.html', title: 'About' },
        'hobbies-text': { url: 'about.html', title: 'Hobbies' },
        'research-title': { url: 'research.html', title: 'Research' },
        'research-item-1': { url: 'research.html', title: 'Research' },
        'research-item-2': { url: 'research.html', title: 'Research' },
        'research-item-3': { url: 'research.html', title: 'Research' },
        'research-item-4': { url: 'research.html', title: 'Research' },
        'publications-title': { url: 'publications.html', title: 'Publications' },
        'project-1-desc': { url: 'publications.html', title: 'Publication 1' },
        'project-2-desc': { url: 'publications.html', title: 'Publication 2' },
        'blog-title': { url: 'blog.html', title: 'Blog' },
        'blog-post-1-body': { url: 'blog.html', title: 'Blog Post' },
        'blog-post-2-body': { url: 'blog.html', title: 'Blog Post' },
        'contact-title': { url: 'contact.html', title: 'Contact' },
    };

    function performSearch(query) {
        if (!query || query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }

        const currentLang = langToggle.getAttribute('data-current-lang') || 'ja';
        const searchableText = translations[currentLang];
        const lowerCaseQuery = query.toLowerCase();
        let resultsHTML = '';

        for (const key in searchableText) {
            if (keyToPage[key]) {
                const text = searchableText[key].toLowerCase();
                if (text.includes(lowerCaseQuery)) {
                    const pageInfo = keyToPage[key];
                    resultsHTML += `<a href="${pageInfo.url}" class="search-result-item">
                        <h4>${pageInfo.title}</h4>
                        <p>${searchableText[key].substring(0, 100)}...</p>
                    </a>`;
                }
            }
        }

        searchResults.innerHTML = resultsHTML || '<p>No results found.</p>';
    }

    searchInput.addEventListener('input', (e) => performSearch(e.target.value));

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

    // --- Scroll-based Effects ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(element => { revealObserver.observe(element); });

    // --- Language Translations ---
    function setLanguage(lang) {
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            if (translations[lang] && translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });
        langToggle.setAttribute('data-current-lang', lang);
    }

    function toggleLanguage() {
        const newLang = langToggle.getAttribute('data-current-lang') === 'ja' ? 'en' : 'ja';
        setLanguage(newLang);
    }

    langToggle.addEventListener('click', toggleLanguage);

    // --- Initial Page Setup ---
    function initializePage() {
        // 1. Theme
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

        // 2. Language
        const userLang = navigator.language || navigator.userLanguage;
        setLanguage(userLang.startsWith('ja') ? 'ja' : 'en');

        // 3. Active Navigation Link
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.sidebar-nav a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    initializePage();

});
