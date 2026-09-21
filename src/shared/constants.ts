/**
 * Duración en días del período gratuito para membresías creadas sin pago inicial.
 * Si no se registra un pago al dar de alta (o al cambiar de plan), la membresía
 * queda activa durante este período como "free trial".
 */
export const FREE_TRIAL_DAYS = 5;

/**
 * Parámetros de seguridad y autenticación.
 */
export const BCRYPT_SALT_ROUNDS = 10;
export const MAX_FAILED_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MINUTES = 15;
export const JWT_EXPIRES_IN = '24h';
export const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_dev_key_change_in_production';
