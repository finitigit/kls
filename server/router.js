'use strict'
const
    controllers = require('./controllers'),
    auth = require('./auth')


async function rest(collection, action, data = {}, req, res) {

    let result

    try {

        const { headers } = req,
            func = controllers[collection][action]

        if (func && func.auth == 'createToken')
            data.token = auth.createToken(data.id, headers['user-agent'])

        else {
            data._user = await auth.verifyToken((data.query || {})._id, headers, controllers.user.readById)
            if (action == 'relogin') return res.send(data._user)
        }

        if (typeof func != 'function')
            throw `function '${collection}/${action}' not found`

        result = await func(data)

        res.send(result)

    } catch (error) {

        res.send({ error: (error || {}).message || error })

    }

}


const Router = app => {
    app.get('/j5/:status?', (req, res) => {

        const { params, query = {} } = req,
            { status } = params

        query.status = status

        res.send(query)
    })

    app.get('/:collection/:id?', (req, res) => {

        const { params, query } = req,
            { collection, id } = params

        rest(collection, id ? 'readById' : 'read', { id, query }, req, res)
    })

    app.post('/:collection/:action?', (req, res) => {

        const { body, params, query } = req,
            { collection, action } = params

        body.query = query
        rest(collection, action || 'create', body, req, res)
    })

    app.put('/:collection/:id?', (req, res) => {

        const { body, params, query } = req,
            { collection, id } = params

        body.query = query
        rest(collection, 'update', body, req, res)
    })

    app.delete('/:collection/:id', (req, res) => {

        const { params, query } = req,
            { collection, id } = params

        rest(collection, 'del', { id, query }, req, res)
    })

}

module.exports = Router
