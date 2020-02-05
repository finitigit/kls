
const create = async (data = {}) => {

    const to = 'bdireq'

    const res = await sendReq.post(`${config.baseUrl}${to}`, data)
    return res.data

}


module.exports = { create }