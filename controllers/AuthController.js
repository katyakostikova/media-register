const AuthRepository = require('../repositories/AuthRepository');
const authRepository = new AuthRepository();

const MassMediaRepository = require('../repositories/MassMediaRepository');
const massMediaRepository = new MassMediaRepository();

const nodemailer = require('nodemailer');

module.exports = {

    async getRegData(req, res) {
        const foundations = await authRepository.getFoundations();
        const positions = await authRepository.getPositions();
        const passAuth = await authRepository.getPassportAuth();


        const currentPerson = await massMediaRepository.getCurrentPerson();
        if (currentPerson.rowCount === 0) {
            res.render('registration', {foundations: foundations.rows, positions: positions.rows,
                passAuth: passAuth.rows, login: "", role: "", isRegistrator: false});
            return;
        }

        res.render('registration', {foundations: foundations.rows, positions: positions.rows, passAuth: passAuth.rows, id: currentPerson.rows[0].id,
            role: currentPerson.rows[0].role === "Адміністратор" ? "registrator" : ""});

    },

    async getRegDataUser(req, res) {
        const foundations = await authRepository.getFoundations();
        const positions = await authRepository.getPositions();
        const passAuth = await authRepository.getPassportAuth();


        const currentPerson = await massMediaRepository.getCurrentPerson();
        if (currentPerson.rowCount === 0) {
            res.render('registration', {foundations: foundations.rows, positions: positions.rows,
                passAuth: passAuth.rows, login: "", role: "", isRegistrator: false});
            return;
        }

        res.render('registration', {foundations: foundations.rows, positions: positions.rows, passAuth: passAuth.rows, id: currentPerson.rows[0].id,
            role: "user"});

    
    },

     async addAdmin(req, res) {
         const error = await authRepository.getErrorMessage(req.body, 2);
         if (error !== "") {
             const foundations = await authRepository.getFoundations();
             const positions = await authRepository.getPositions();
             const passAuth = await authRepository.getPassportAuth();
             res.render('registration', {errorMessage: error, foundations: foundations.rows, positions: positions.rows, passAuth: passAuth.rows});
             return;
         }
         const added = await authRepository.addAdmin(req.body);
         if (added) {
             res.render('login', {params: req.body.login});
         }
         else {
             res.redirect('/error');
         }
     },

    async addRegistrator(req, res) {
         const error = await authRepository.getErrorMessage(req.body, 3);
         if (error !== "") {
             const foundations = await authRepository.getFoundations();
             const positions = await authRepository.getPositions();
             const passAuth = await authRepository.getPassportAuth();
             res.render('registration', {errorMessage: error, foundations: foundations.rows, positions: positions.rows, passAuth: passAuth.rows, role:'registrator'});
             return;
         }
         const added = await authRepository.addRegistrator(req.body);
         if (added) {
             const registrators = await massMediaRepository.getRegistrators();
            res.render('registrators', {registrators: registrators.rows});
         }
         else {
             res.redirect('/error');
         }
     },

    async addUser(req, res) {
         const error = await authRepository.getErrorMessage(req.body, 4);
         if (error !== "") {
             const foundations = await authRepository.getFoundations();
             const positions = await authRepository.getPositions();
             const passAuth = await authRepository.getPassportAuth();
             res.render('registration', {errorMessage: error, foundations: foundations.rows, positions: positions.rows, passAuth: passAuth.rows, role:'user'});
             return;
         }
         const added = await authRepository.addUser(req.body);
         if (added) {

            console.log(req.body)

            var mail = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'developer.pro77@gmail.com',
                pass: '1Pro23456789'
              }
            });

                var mailOptions = {
               from: 'developer.pro77@gmail.com',
               to: req.body.email,
               subject: 'Password for Service',
               text: 'Here is your password '+ req.body.password + ' and username ' + req.body.login,
                }
  
            mail.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
            });

             const users = await massMediaRepository.getUsers();
            res.render('users', {users: users.rows});
         }
         else {
             res.redirect('/error');
         }
     },

    async getLoginData(req, res) {
        const error = await authRepository.getErrorMessage(req.body, 1);
        console.log(error)
        if (error !== "") {
            res.render('login', {errorMessage: error, params: req.body.login});
            return;
        }
        const user = await authRepository.getLoginData(req.body);
        if (user.rowCount > 0) {
            const newCurrentPerson = await authRepository.addCurrentPerson(user.rows[0].id);
            res.redirect('/mass_medias');
        }
    },

    async logout(req, res) {
        console.log("logout called ")
        const deletedCurrentPerson = await authRepository.deleteCurrentPerson();
        res.redirect('/');
    },
}