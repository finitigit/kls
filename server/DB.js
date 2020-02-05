const sql = require('mssql'),
    config = {
        user: 'Liran',
        password: '123456Mark123456',
        server: 'klssqlserver.database.windows.net',
        database: 'KLS',

        options: {
            encrypt: true
        }
    }

async function log(description, value, app_id, username) {
    return new Promise(async (resolve, reject) => {
        await sql.close()
        sql.connect(config)
            .then(async () => {
                try {
                    const q = `insert into XMLnewLogs (time, description, value, app_id, username) VALUES ('${Date.now()}', '${description}', '${JSON.stringify(value).replace(/'/g, '')}', '${app_id}', '${username}')`
                    console.log(q)
                    const res = await sql.query(q)
                    resolve(res)
                } catch (error) {
                    console.log(error)
                    resolve()
                }
            })
            .catch(error => {
                console.log(error)
                resolve()
            })
    })
}
module.exports = { log }

