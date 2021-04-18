const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../db/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            users: '/api/users',
            uploads: '/api/uploads',
            search: '/api/search'
        }

        // Connect to data base
        this.connectDB();

        // Middlewares
        this.middlewares();
        // Routes app
        this.routes();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());
        // Reading and parse of the body
        this.app.use(express.json());
        // Public directory
        this.app.use(express.static('public'));
        // Fileupload - file upload
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.products, require('../routes/products'));
        this.app.use(this.paths.users, require('../routes/users'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
        this.app.use(this.paths.search, require('../routes/search'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port', this.port);
        });
    }
}

module.exports = Server;