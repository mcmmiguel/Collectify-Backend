import i18n from 'i18next';
import Backend from 'i18next-node-fs-backend';
import Middleware from 'i18next-http-middleware';

const resources = {
    en: {
        translation: {
            categories: {
                "Books": "Books",
                "Postage Stamps": "Postage Stamps",
                "Coins": "Coins",
                "Comics": "Comics",
                "Action Figures": "Action Figures",
                "Art": "Art",
                "Antiques": "Antiques",
                "Retro Toys": "Retro Toys",
                "Vintage Clothing": "Vintage Clothing",
                "Movies and Film": "Movies and Film",
                "Music (Records, Vinyl)": "Music (Records, Vinyl)",
                "Collectible Cards": "Collectible Cards",
                "Beer and Wine": "Beer and Wine",
                "Photography": "Photography",
                "Jewelry": "Jewelry",
                "Science Fiction Items": "Science Fiction Items",
                "Vintage Electronics": "Vintage Electronics",
                "Postcards": "Postcards",
                "Historical Artifacts": "Historical Artifacts",
                "Video Games": "Video Games",
                "Other": "Other"
            }
        }
    },
    es: {
        translation: {
            categories: {
                "Books": "Libros",
                "Postage Stamps": "Sellos Postales",
                "Coins": "Monedas",
                "Comics": "Cómics",
                "Action Figures": "Figuras de Acción",
                "Art": "Arte",
                "Antiques": "Antigüedades",
                "Retro Toys": "Juguetes Retro",
                "Vintage Clothing": "Ropa Vintage",
                "Movies and Film": "Cine y Películas",
                "Music (Records, Vinyl)": "Música (Discos, Vinilos)",
                "Collectible Cards": "Tarjetas de Colección",
                "Beer and Wine": "Cerveza y Vinos",
                "Photography": "Fotografía",
                "Jewelry": "Joyería",
                "Science Fiction Items": "Objetos de Ciencia Ficción",
                "Vintage Electronics": "Equipos Electrónicos Vintage",
                "Postcards": "Postales",
                "Historical Artifacts": "Objetos Históricos",
                "Video Games": "Videojuegos",
                "Other": "Otro"
            }
        }
    }
}

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
