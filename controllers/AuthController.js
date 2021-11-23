const AuthRepository = require('../repositories/AuthRepository');
const authRepository = new AuthRepository();

//@СДЕЛАЛА@
module.exports = {
    async getRegData(req, res) {
        const foundations = await authRepository.getFoundations();
        const positions = await authRepository.getPositions();
        const passAuth = await authRepository.getPassportAuth();
        res.render('registration', {foundations: foundations.rows, positions: positions.rows, passAuth: passAuth.rows});
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

    async getLoginData(req, res) {
        const error = await authRepository.getErrorMessage(req.body, 1);
        if (error !== "") {
            res.render('login', {errorMessage: error, params: req.body.login});
            return;
        }
        const user = await authRepository.getLoginData(req.body);
        if (user.rowCount > 0) {
            const newCurrentPerson = await authRepository.addCurrentPerson(user.rows[0].id);
            res.redirect('/forms');
        }
    },

    async logout(req, res) {
        const deletedCurrentPerson = await authRepository.deleteCurrentPerson();
        res.redirect('/');
    },
}