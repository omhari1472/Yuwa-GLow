// Production URLs - change these to your domain
// const IS_PRODUCTION = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const IS_PRODUCTION = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && window.location.hostname !== '192.168.1.7';

const CONFIG = {
    API_BASE_URL: IS_PRODUCTION ? 'https://yuvaglow.com/api' : 'http://192.168.1.7:8000/api',
    STORAGE_URL: IS_PRODUCTION ? 'https://yuvaglow.com/api/storage/' : 'http://192.168.1.7:8000/storage/',
    APP_NAME: 'YUVA GLOW',
    VERSION: '1.0.0'
};

export default CONFIG;