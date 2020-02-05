const bcrypt = require('bcryptjs'),
    hash = p => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(`@${p}#`, salt)
    }

const create = async (data = {}) => {

    if (data.password)
        data.password = hash(data.password)

    const res = await sendReq.post(`${config.baseUrl}users`, data)
    return res.data

}

const read = async (data = {}) => {

    const res = await sendReq.get(`${config.baseUrl}users`)
    return res.data

}

const readById = async (data, withToken) => {

    let { p } = data.query || {}

    const res = await sendReq.get(`${config.baseUrl}users/${data.id}?${p ? 'with-pass=true' : (withToken ? 'with-tok=true' : '')}`),
        user = res.data

    if (withToken) {
        delete user.password
        return user
    }

    if (user.password) {
        const pp = user.password.replace(/\\\//g, '/')
        const match = await bcrypt.compareSync(`@${p}#`, pp)

        if (match) {
            delete user.password

            user.token = data.token
            await update(user)

            return user
        }

    }

    throw 'שם המשתמש והסיסמא אינם תואמים'
}
readById.auth = 'createToken'

const update = async (data = {}) => {

    const { id = data.username } = data

    if (data.password)
        data.password = hash(data.password)

    const res = await sendReq.put(`${config.baseUrl}users${id ? `/${id}` : ''}`, data)
    return res.data

}

const del = async (data) => {

    const res = await sendReq.delete(`${config.baseUrl}users/${data.id}`)
    return res.data

}

module.exports = { create, read, readById, update, del }