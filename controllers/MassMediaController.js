const MassMediaRepository = require('../repositories/MassMediaRepository');
const massMediaRepository = new MassMediaRepository();

//@ОСТАНОВИЛАСЬ ВНИЗУ@
module.exports = {
    async getMassMedias(req, res) {
        const mass_media = await massMediaRepository.getMassMedias();
        const currentPerson = await massMediaRepository.getCurrentPerson();
        if (currentPerson.rowCount === 0) {
            res.render('mass_medias', {mass_media: mass_media.rows, login: "", role: "", isRegistrator: false});
            return;
        }
        res.render('mass_medias', {mass_media: mass_media.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор"});
    },

    async getFilteredMassMedias(req, res) {
        const mass_media = await massMediaRepository.getFilteredMassMedias( req.query.number, req.query.series,
            req.query.name, req.query.surname, req.query.midname);
        const currentPerson = await massMediaRepository.getCurrentPerson();
        if (currentPerson.rowCount === 0) {
            res.render('mass_medias', {mass_media: mass_media.rows, login: "", role: "", isRegistrator: false});
            return;
        }
        res.render('mass_medias', {mass_media: mass_media.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
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
        console.log(currentPerson)
        if (currentPerson.rowCount === 0) {
       // if(true){
            res.render('login', {login: "", role: ""});
            // res.render('login', {login: "", role: ""});
            return;
        }
        res.render('home', {login: currentPerson.rows[0].login, role: currentPerson.rows[0].role, id: currentPerson.rows[0].id});
    },

    async getMassMediaData(req, res) {
        const logins = await massMediaRepository.getLogins();
        res.render('newMassMedia', {logins: logins.rows});
    },

    async addMassMedia(req, res) {
        const newMassMedia = await massMediaRepository.addMassMedia(req.body);
        if (newMassMedia == null) return;
        const log = await massMediaRepository.addCreationLog(newMassMedia.rows[0]);
        const mass_media = await massMediaRepository.getMassMedias();
        const currentPerson = await massMediaRepository.getCurrentPerson();
        if (currentPerson.rowCount === 0) {
            res.render('mass_medias', {mass_media: mass_media.rows, login: "", role: "", isRegistrator: false});
            return;
        }
        res.render('mass_medias', {mass_media: mass_media.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role, id: currentPerson.rows[0].id,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор"});
    },
}