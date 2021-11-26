const db = require('../db');

//@ВРОДЕ ГОТОВО НО НАДО ОЧЕНЬ ХОРОШО ПРОВЕРИТЬ@
class MassMediaRepository {
    async getMassMedias() {
        return await db.query('select * from mass_media');
    };

    async getFilteredMassMedias(number, series, name, surname, midname) {

        return await db.query(`select * from mass_media where (\n` +
            `(cast(series as text) like '%${series.toString()}%') and \n` +
            `(cast(number as text) like '%${number.toString()}%') and \n` +
            `(person_id in (\n` +
            `select id from persons where (\n` +
            `(name like '%${name.toString()}%') and \n` +
            `(surname like '%${surname.toString()}%') and \n` +
            `(midname like '%${midname.toString()}%')\n` +
            `)\n` +
            `)))`);
    };

    async getMassMediaById(id) {
        return await db.query(`select mass_media.id, number, series, mass_media.name, is_active,
        surname, midname from 
	    mass_media inner join persons on mass_media.person_id = persons.id 
	    where mass_media.id = ${id}`);
    };

    async getCurrentPerson() {
        return await db.query(`select login, role from persons where id = (select id from current_per)`);
    };

    async getLogins() {
        return await db.query(`select login from persons`);
    };

    async addMassMedia(massMediaData) {
        return await db.query(`insert into mass_media(number, series, type, name, language, date_registarion, scope_of_distribution,
            frequency_of_issue, amount, objectives, person_id, who_registered) 
            values (${massMediaData.number}, ${massMediaData.series},
                 '${massMediaData.type.toString()}', '${massMediaData.name.toString()}',
                 '${massMediaData.language.toString()}', '${massMediaData.date_registration.toString()}',
                 '${massMediaData.scope_of_distribution.toString()}', '${massMediaData.frequency_of_issue.toString()}',
                 '${massMediaData.amount}', '${massMediaData.objectives.toString()}', (select id from persons where (login = '${massMediaData.login.toString()}')),
                '${massMediaData.who_registered}')
        )`);
    };
}

module.exports = MassMediaRepository;