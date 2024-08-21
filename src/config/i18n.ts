import i18n from 'i18next';
import Backend from 'i18next-node-fs-backend';
import Middleware from 'i18next-http-middleware';
import en from '../locales/en';
import es from '../locales/es';

const resources = { en, es };

i18n
    .use(Backend)
    .use(Middleware.LanguageDetector)
    .init({
        resources,
        fallbackLng: 'en',
        detection: {
            order: ['querystring', 'header'],
            caches: ['cookie']
        }
    });

export default i18n;
