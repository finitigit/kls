import { baseUrl } from 'Config'
import axios from 'axios'
axios.defaults.baseURL = baseUrl

const setAuthorization = (token = '') => {
    localStorage.token = token
    axios.defaults.headers.common.Authorization = token
}
setAuthorization(localStorage.token)

function loguot1() {
    delete localStorage.token
    delete localStorage._id
    location.reload()
}
export const loguot = loguot1

export const localAction = (payload, type = 'LOCAL_ACTION') =>
    dispatch => dispatch({ type, payload })

export const sendReq = (method, url, data, options = {}) =>
    new Promise((resolve, reject) => {

        const { login, loguot } = options

        url += `${url.includes('?') ? '' : '?'}&_id=${localStorage._id}`

        axios[method](url, data)
            .then(res => {

                const { data } = res


                if (data.error) throw data.error

                if (login || loguot) {
                    setAuthorization(data.token)
                    localStorage._id = data.username || ''
                }

                if (loguot) throw { status: 401 }

                resolve(data)

            })
            .catch(error => {
                if (error.status == 504) error.message = 'עיכוב בקבלת הנתונים, יש לנסות שוב בעוד 30 שניות'
                if (error.status == 401 && localStorage.token)
                    loguot1()

                reject(error.message || error)

            })
    })

