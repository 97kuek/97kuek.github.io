
document.addEventListener('DOMContentLoaded', () => {
    const langToggle = document.getElementById('lang-toggle');
    const userLang = navigator.language || navigator.userLanguage;

    const translations = {
        'ja': {
            'title': 'Keitaro Ueki (植木敬太郎) - 早稲田大学',
            'name': 'Keitaro Ueki (植木敬太郎)',
            'affiliation': '早稲田大学 基幹理工学部 情報通信学科 学部2年',
            'about-title': 'About Me',
            'about-text': '2005年生まれ。<br>桐蔭学園中等教育学校卒業後は、早稲田大学基幹理工学部情報通信学科に進学。<br>現在は学部2年生で、主に自然言語処理、音響信号処理に興味を持っています。<br>人力飛行機を製作するプロジェクトに携わっており、空力設計やプロペラ設計の補助も担当していました。',
            'research-title': 'Research Interests',
            'research-item-1': '音響信号処理',
            'research-item-2': '自然言語処理',
            'research-item-3': '遺伝的アルゴリズムによる最適化',
            'research-item-4': 'その他',
            'publications-title': 'Publications & Projects',
            'project-1-title': 'プロジェクト名 or 論文タイトル 1',
            'project-1-meta': '<strong>[学会名 or 雑誌名], 2024.</strong>',
            'project-1-desc': 'ここに簡単な概要を記述します。共著者がいる場合はそれも記載します。',
            'project-2-title': 'プロジェクト名 or 論文タイトル 2',
            'project-2-meta': '<strong>[進行中], 2025.</strong>',
            'project-2-desc': '現在進行中のプロジェクトや研究について記述します。',
            'contact-title': 'Contact',
            'contact-text': 'ご意見、ご質問などありましたら、お気軽にご連絡ください。',
            'footer-text': '&copy; 2025 Keitaro Ueki (植木敬太郎). All Rights Reserved.',
            'lang-btn': 'English'
        },
        'en': {
            'title': 'Keitaro Ueki - Waseda University',
            'name': 'Keitaro Ueki',
            'affiliation': 'B2, Dept. of Communications and Computer Engineering, Waseda University',
            'about-title': 'About Me',
            'about-text': 'Born in 2005.<br>After graduating from Toin Gakuen Secondary Education School, I entered the School of Fundamental Science and Engineering at Waseda University.<br>I am currently a sophomore, mainly interested in natural language processing and acoustic signal processing.<br>I was also involved in a human-powered aircraft project, assisting with aerodynamic and propeller design.',
            'research-title': 'Research Interests',
            'research-item-1': 'Acoustic Signal Processing',
            'research-item-2': 'Natural Language Processing',
            'research-item-3': 'Optimization with Genetic Algorithms',
            'research-item-4': 'Others',
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

    // Set initial language based on browser settings
    const initialLang = userLang.startsWith('ja') ? 'ja' : 'en';
    setLanguage(initialLang);
});
