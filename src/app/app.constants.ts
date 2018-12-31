export const ERR_LOGOUT: string  = 'No se pudo cerrar la sesión';
export const ERR_TOKEN_EXPIRED: string  = 'La sesión ha caducado';
export const OK_LOGOUT: string  = 'Se ha cerrado correctamente la sesión';
export const endpointsSinJWT = [
    { path: '/auth/login', method: 'POST'},
    { path: '/api/user', method: 'POST'},
    { path: '/api/restaurantChain/getById', method: 'GET'}
];
