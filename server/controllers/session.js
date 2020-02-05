
const create = async (data = {}) => {

    const res = await sendReq.post(`${config.baseUrl}sessions`, data)
    return res.data

}


module.exports = { create }