## Instructions to set up and run project
### Frontend
The frontend uses React and Typescript through Vite. Install dependencies in the client folder with
```shell
npm install
```

Run the development server from the client folder with
```shell
npm run dev
```

The local development server should be hosted on http://localhost:3000

### Backend
The backend uses Typescript, so you can't just run it through Node. 
Use these npm scripts to initialize and run them from the server folder.
```shell
npm install
```
Make sure MongoDB is started on your computer and the port is in its proper configuration for the project (mongodb://127.0.0.1:27017/fake_so)

Initialize the database in the server folder with
```shell
npm run init <admin-username> <admin-password>
```
(Replace `<admin-username>` and `<admin-password>` with the username and password of your choice.)

Start the express server from the server folder with
```shell
npm run start
```

You can run jest unit tests from the server folder. Make sure MongoDB is started with the proper config.
```shell
npm test
```
Warning: You will need to reset the database after running.
