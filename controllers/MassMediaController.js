const MassMediaRepository = require('../repositories/MassMediaRepository');
const massMediaRepository = new MassMediaRepository();

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
        const mass_media = await massMediaRepository.getFilteredMassMedias(req.query);

        const currentPerson = await massMediaRepository.getCurrentPerson();

        if (currentPerson.rowCount === 0) {
            res.render('mass_medias', {mass_media: mass_media.result.rows, login: "", role: "", isRegistrator: false});
            return;
        }
        res.render('mass_medias', {mass_media: mass_media.result.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
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
    

    async getMediaForEdit(req, res) {
        const logins = await massMediaRepository.getLogins();
        const mass_media = await massMediaRepository.getMassMediaById(req.params.id);
        console.log(mass_media)
        const isZMI = mass_media.rows[0].type == 'ЗМІ';
        res.render('editMassMedia', {logins: logins.rows, mass_media: mass_media.rows[0], isZMI:isZMI,  old_date_exists: mass_media.rows[0].date !== null});
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

    async getAllLogs(req, res) {
        const logs = await massMediaRepository.getAllLogs();
        const types = await massMediaRepository.getTypes();
        const logins = await massMediaRepository.getLogins();
        const currentPerson = await massMediaRepository.getCurrentPerson();
        res.render('logs', {logs: logs.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role, id: currentPerson.rows[0].id,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор", types: types.rows, isEdited: false,
            logins:logins.rows
        });
    },

    async getFilteredLogs(req, res) {
        const logs = await massMediaRepository.getFilteredLogs(req.query.date, req.query.login, req.query.type);
        const types = await massMediaRepository.getTypes();
          const logins = await massMediaRepository.getLogins();
        const currentPerson = await massMediaRepository.getCurrentPerson();
        res.render('logs', {logs: logs.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role, id: currentPerson.rows[0].id,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор", types: types.rows
,
            logins:logins.rows
        });
    },

    async updateMassMedia(req, res) {
        const updatedMassMedia = await massMediaRepository.editMassMedia(req.body, req.params.id);
        const log = await massMediaRepository.addUpdateLog(updatedMassMedia);
        const mass_media = await massMediaRepository.getMassMediaById(req.params.id);
        res.redirect(`/mass_medias/${mass_media.rows[0].id}`);
    },
}