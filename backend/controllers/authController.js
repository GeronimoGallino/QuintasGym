const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Clave secreta para firmar los tokens (En prod debe ir en .env)
// Por ahora la ponemos aquí para probar
const JWT_SECRET = process.env.JWT_SECRET || 'frase_super_secreta_gym';

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Buscamos el usuario
        const usuario = await Usuario.findOne({ where: { username } });
        if (!usuario) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        // 2. Comparamos contraseñas (La que viene vs La encriptada en BD)
        const validPassword = await bcrypt.compare(password, usuario.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // 3. Generamos el Token
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol }, // Payload (datos dentro del token)
            JWT_SECRET,
            { expiresIn: '12h' } // Dura 12 horas
        );

        res.json({
            message: 'Bienvenido',
            token, 
            usuario: { username: usuario.username, rol: usuario.rol }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = { login };