const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'frase_super_secreta_gym';

const verifyToken = (req, res, next) => {
    // 1. Buscamos el token en la cabecera (Header)
    const authHeader = req.headers['authorization'];
    
    // Normalmente viene como "Bearer eyJhbGci..."
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(403).json({ message: '⛔ Acceso denegado: Falta el Token' });
    }

    // 2. Verificamos si es válido
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ message: '⛔ Token inválido o expirado' });
        }

        // 3. Si todo está bien, guardamos los datos del usuario en la petición
        req.user = user;
        next(); // ¡Pase usted!
    });
};

module.exports = verifyToken;