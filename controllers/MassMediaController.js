const MassMediaRepository = require('../repositories/MassMediaRepository');
const massMediaRepository = new MassMediaRepository();

//@ОСТАНОВИЛАСЬ ВНИЗУ@
module.exports = {
    async getMassMedias(req, res) {
        const mass_medias = await massMediaRepository.getMassMedias();
        const currentPerson = await massMediaRepository.getCurrentPerson();
        if (currentPerson.rowCount === 0) {
            res.render('mass_medias', {mass_medias: mass_medias.rows, login: "", role: "", isRegistrator: false});
            return;
        }
        res.render('mass_medias', {mass_medias: mass_medias.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор"});
    },

    async getFilteredMassMedias(req, res) {
        const mass_medias = await massMediaRepository.getFilteredMassMedias( req.query.number, req.query.series,
            req.query.name, req.query.surname, req.query.midname);
        const currentPerson = await massMediaRepository.getCurrentPerson();
        if (currentPerson.rowCount === 0) {
            res.render('mass_medias', {mass_medias: mass_medias.rows, login: "", role: "", isRegistrator: false});
            return;
        }
        res.render('mass_medias', {mass_medias: mass_medias.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор"});
    },

    async getMassMediaById(req, res) {
        const mass_media = await massMediaRepository.getMassMediaById(req.params.id);
        const currentPerson = await massMediaRepository.getCurrentPerson();
        if (currentPerson.rowCount === 0) {
            res.render('mass_media', {mass_media: mass_media.rows[0], login: "", role: "", isRegistrator: false});
            return;
        }
        res.render('mass_media', {mass_media: mass_media.rows[0], login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор"});
    },

    async getHomePage(req, res) {
        const currentPerson = await massMediaRepository.getCurrentPerson();
        if (currentPerson.rowCount === 0) {
            res.render('home', {login: "", role: ""});
            return;
        }
        res.render('home', {login: currentPerson.rows[0].login, role: currentPerson.rows[0].role});
    },

    async getMassMediaData(req, res) {
        const logins = await massMediaRepository.getLogins();
        res.render('newMassMedia', {logins: logins.rows});
    },

    //@ОСТАНОВИЛАСЬ ТУТ@
    async addMassMedia(req, res) {
        const newMassMedia = await massMediaRepository.addMassMedia(req.body);
        // console.log(currentPerson);
        // if (currentPerson.rowCount === 0) {
        //     res.render('forms', {login: "", role: "", isRegistered: false});
        //     return;
        // }
        // res.render('forms', {login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
        //     isRegistered: true, logins: logins.rows, statuses: statuses.rows});
        // const currentPerson = await formRepository.getCurrentPerson();
        // if (currentPerson.rowCount === 0) {
        //     res.render('forms', {forms: forms.rows, login: "", role: "", isRegistrator: false});
        //     return;
        // }
        // res.render('forms', {forms: forms.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
        //     isRegistrator: currentPerson.rows[0].role === "Реєстратор"});
        await this.getMassMedia;
    },
}