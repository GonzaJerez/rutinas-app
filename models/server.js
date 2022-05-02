const express = require('express')
const cors = require('cors');

const { dbConnection } = require( '../database/config' );
const { socketController } = require( '../sockets/controller' );

class Server {

    constructor(){
        this.app    = express();
        this.port   = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io     = require('socket.io')(this.server);

        this.paths = {
            auth:              '/api/auth',
            days:              '/api/routines/dayWorkout',
            routines:          '/api/routines',
            setsWorkout:       '/api/routines/setsWorkout',
            users:             '/api/users',
            workoutInRoutine:  '/api/routines/workoutInRoutine',
            workouts:          '/api/workouts',
        }

        // Conectar a db
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // endpoints
        this.routes();

        // Sockets
        this.io.on('connection', socketController);
    }

    async conectarDB(){
        dbConnection()
    }

    middlewares(){

        // CORS
        this.app.use(cors())
        
        // Leactura y parseo del body
        this.app.use( express.json() );

        // Directorio publico - el sitio web
        this.app.use(express.static('public'))
    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.days, require('../routes/routineDays'))
        this.app.use(this.paths.routines, require('../routes/routines'))
        this.app.use(this.paths.setsWorkout, require('../routes/sets'))
        this.app.use(this.paths.users, require('../routes/users'))
        this.app.use(this.paths.workoutInRoutine, require('../routes/workoutInRoutine'))
        this.app.use(this.paths.workouts, require('../routes/workouts'))
    }

    listen(){
        this.server.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`)
        })
    }
}

module.exports = Server;