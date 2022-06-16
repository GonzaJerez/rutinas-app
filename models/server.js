const express = require('express')
const cors = require('cors');
const fileUpload = require('express-fileupload')

const { dbConnection } = require( '../database/config' );
const { socketController } = require( '../sockets/controller' );

class Server {

    constructor(){
        this.app    = express();
        this.port   = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io     = require('socket.io')(this.server);

        this.paths = {
            // Users
            users:             '/api/users',
            auth:              '/api/auth',
            // Muscles & workouts
            muscles:           '/api/muscles',
            workouts:          '/api/workouts',
            // Routines
            routines:          '/api/routines',
            days:              '/api/routines',
            combinedWorkouts:  '/api/routines',
            workoutInRoutine:  '/api/routines',
            // Images & movements
            routinesImages:    '/api/routinesImages',
            movements:         '/api/movements',

            // Search
            search:            '/api/search',

            //Groups
            groups:              '/api/groups'
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

        // Carga de imgs
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/'
        }));
    }

    routes(){
        this.app.use(this.paths.users, require('../routes/users'))
        this.app.use(this.paths.auth, require('../routes/auth'))

        this.app.use(this.paths.muscles, require('../routes/muscles'))
        this.app.use(this.paths.workouts, require('../routes/workouts'))

        this.app.use(this.paths.routines, require('../routes/routines'))
        this.app.use(this.paths.days, require('../routes/routineDays'))
        this.app.use(this.paths.combinedWorkouts, require('../routes/combinedWorkouts'))
        this.app.use(this.paths.workoutInRoutine, require('../routes/workoutInRoutine'))
        
        this.app.use(this.paths.movements, require('../routes/movements'))
        this.app.use(this.paths.routinesImages, require('../routes/routinesImages'))

        this.app.use(this.paths.search, require('../routes/search'))

        this.app.use(this.paths.groups, require('../routes/group'))
    }

    listen(){
        this.server.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`)
        })
    }
}

module.exports = Server;