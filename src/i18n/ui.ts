export const languages = { ja: "日本語", en: "English" } as const;
export const defaultLang = "ja" as const;
export type Lang = keyof typeof languages;

const ui = {
  ja: {
    "timeline.readMore": "続きを読む",
    "timeline.present": "現在",
    "timeline.close": "閉じる",
    "timeline.seeResume": "職務経歴をもっと見る",
    "timeline.companySite": "会社サイトを見る",
    "timeline.schoolSite": "学校サイトを見る",
    "timeline.months": "ヶ月",
    "timeline.years": "年",
    "timeline.dateLocale": "ja-JP",
    "about.seeMore": "詳細を見る",
    "projects.subtitle":
      "Webアプリから画像処理プログラムまで、これまで取り組んできたプロジェクトの一部をご紹介します。",
    "projects.noFeatured":
      "注目のプロジェクトはまだありません。すべてのプロジェクトをご覧ください。",
    "projects.seeAll": "すべてのプロジェクトを見る",
    "nav.home": "ホーム",
    "nav.search": "検索",
    "nav.openMenu": "メニューを開く",
    "lang.switchTo": "EN",
    "lang.switchLabel": "Switch to English",
    "filter.noResults": "該当するアイテムがありません。",
    "filter.reset": "フィルターをリセット",
    "filter.items": "件",
  },
  en: {
    "timeline.readMore": "Read more",
    "timeline.present": "Present",
    "timeline.close": "Close",
    "timeline.seeResume": "See full resume",
    "timeline.companySite": "Company website",
    "timeline.schoolSite": "School website",
    "timeline.months": "mo",
    "timeline.years": "yr",
    "timeline.dateLocale": "en-US",
    "about.seeMore": "See more",
    "projects.subtitle":
      "A selection of projects I have worked on, from web apps to image processing.",
    "projects.noFeatured": "No featured projects yet.",
    "projects.seeAll": "View all projects",
    "nav.home": "Home",
    "nav.search": "Search",
    "nav.openMenu": "Open menu",
    "lang.switchTo": "JA",
    "lang.switchLabel": "日本語に切り替え",
    "filter.noResults": "No items match the selected filters.",
    "filter.reset": "Reset filters",
    "filter.items": " items",
  },
} as const;

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return (
      (ui[lang] as (typeof ui)[typeof defaultLang])[key] ??
      ui[defaultLang][key]
    );
  };
}
