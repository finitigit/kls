const jwt = require('jsonwebtoken')

exports.createToken = (_id, ua) =>
    jwt.sign({ _id, ua }, config.secret, { expiresIn: '5h' })

exports.verifyToken = async (_id, headers, readById) => {
    try {

        const token = headers.authorization,
            ua = headers['user-agent']

        let tokenData = {}

        if (!_id || !token) throw 'Unauthorized - no token'

        const user = await readById({ id: _id }, true)

        if (!user || user.error) throw 'Unauthorized user - user not found'

        if (token != user.token) throw 'Unauthorized user - token not match'

        try { tokenData = jwt.verify(token, config.secret) }
        catch (error) { throw 'Failed to authenticate token.' }

        if (Date.now() > tokenData.exp * 1000 || _id != tokenData._id || ua != tokenData.ua)
            throw 'Unauthorized user or token'

        return user

    } catch (error) {
        throw {
            error,
            status: 401
        }
    }

}
