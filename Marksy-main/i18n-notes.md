# i18n / Language Switching Notes

This project now supports English (en) and Sinhala (si).

## How it works
- `LanguageContext` in `src/contexts/LanguageContext.tsx` stores current language, persists in localStorage, and exposes `t(key)`.
- Dictionaries are inline (en & si). You can split them later into separate files if they grow large.
- Components call `const { t } = useLanguage()` then replace visible strings with `t('key.path')`.

## Adding a new translation key
1. Pick a logical key: `section.feature.label` (e.g. `stats.average`)
2. Add English entry in `en` dictionary.
3. Add Sinhala (or other language) entry in its dictionary with same key.
4. Use it: `t('stats.average')`

If a key is missing in chosen language it falls back to English, then the raw key.

## Adding another language
1. Extend the union type: `lang: 'en' | 'si' | 'ta'` etc.
2. Add new dictionary object (e.g. `const ta: TranslationDict = { ... }`).
3. Add to `dictionaries` map.
4. Expand UI toggle to include selection logic (dropdown or cycle button).

## Improving Sinhala Quality
Current Sinhala translations are seed versions and may need refinement by a native speaker for:
- Natural phrasing
- Formal vs informal tone consistency
- Educational terminology accuracy

## Potential Enhancements
- Lazy-load large dictionaries.
- Implement ICU pluralization for counts (e.g. subject(s)).
- Add direction (rtl) support if adding languages like Arabic.
- Provide a settings page with language selector.

## Example
```
<p>{t('stats.average')}</p>
```

Will render "Average" in English or "ආසල්ම" (placeholder Sinhala) when Sinhala is active.
