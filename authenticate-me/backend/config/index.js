module.exports = {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT,
    dbFile: process.env.DB_FILE,
    jwtConfig: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN
    }
}