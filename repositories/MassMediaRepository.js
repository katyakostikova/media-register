const db = require('../db');

//@ТУДУ@
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
        return await db.query(`select login, role, id from persons where id = (select id from current_per)`);
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

    
    async editMassMedia(massMediaData, id) {
        await db.query(`update mass_media set number = ${mass_media.number}, series = ${mass_media.series}, type = '${massMediaData.type.toString()}', 
        name = '${massMediaData.name.toString()}', language = '${massMediaData.language.toString()}', date_registarion = '${massMediaData.date_registarion.toString()}', 
        scope_of_distribution = '${massMediaData.scope_of_distribution.toString()}', frequency_of_issue = '${massMediaData.frequency_of_issue.toString()}', 
        amount = ${massMediaData.amount}, objectives = '${massMediaData.objectives.toString()}', 
        person_id = (select id from persons where (login = '${massMediaData.login.toString()}')),
        who_registered = '${massMediaData.who_registered.toString()}'`); //where id=${id}

        await db.query(`create table temp as (select id, number, series, type, name, language, date_registarion, scope_of_distribution,
        frequency_of_issue, amount, objectives, person_id, who_registered from mass_media where (id = ${id}));
        alter table temp add column temp_id serial primary key, add column old_number int,
        add column old_series int, add column old_type int, add column old_name int,
        add column old_language int, add column old_date_registarion date, add column old_scope_of_distribution text, 
        add column old_frequency_of_issue text, add column old_amount text, add column old_objectives text,
        add column who_registered text, add column old_login text, add column update_date date;
        update temp set old_number = ${massMediaData.old_number}, old_series = ${massMediaData.old_series}, old_type = ${massMediaData.old_type},
        old_name = ${massMediaData.old_name}, old_language = ${massMediaData.old_language}, old_date_registarion = ${massMediaData.old_date_registarion},
        old_scope_of_distribution = ${massMediaData.old_scope_of_distribution}, old_frequency_of_issue = ${massMediaData.old_frequency_of_issue},
        old_amount = ${massMediaData.old_amount}, old_objectives = ${massMediaData.old_objectives}, who_registered=${massMediaData.who_registered},
        old_login = '${massMediaData.old_login.toString()}', update_date = '${moment().format('L').toString()}'`);

       
        const temp = await db.query(`select * from temp`);

          //todo 1.1
        return await db.query(`select id, number, series, to_char(usage_date, 'YYYY-MM-DD') as usage_date, person_id, status_id,
        old_number, old_series, to_char(old_usage_date, 'YYYY-MM-DD') as old_usage_date, old_status, old_login, to_char(update_date, 'YYYY-MM-DD') as update_date from temp where (temp_id = ${temp.rows[0].temp_id})`);
    };

    //todo

    async editLogForm(formData, id) {
        return await db.query(`update forms set number = ${formData.old_number}, series = ${formData.old_series}, 
        usage_date = '${formData.old_usage_date.toString()}', person_id = '${formData.old_person_id}',
        status_id = ${formData.old_status_id} where (id = ${id})`);
    };

  /*  async getUserById(id) {
        return await db.query(`select id, name, surname, midname, to_char(birthday, 'YYYY-MM-DD') as birthday, role, is_active from persons where (id = ${id})`);
    };*/

    async getRegistrators() {
        return await db.query(`select * from persons where (role = 'Реєстратор')`);
    };

    async activateRegistrator(id) {
        return await db.query(`update persons set is_active = true where (id = ${id})`);
    };

    async deactivateRegistrator(id) {
        return await db.query(`update persons set is_active = false where (id = ${id})`);
    };

    async getAllLogs() {
        return await db.query(`select id, idc, (type_id = 2) as is_edited, form_id, to_char(date, 'YYYY-MM-DD') as date, old_number, old_series, old_usage_date, old_status_id, number, series, type, login from (select * from logs
        inner join (select id as ida, number, series from forms) as forms on logs.form_id = forms.ida
        inner join (select id as idb, type from types) as types on logs.type_id = types.idb
        inner join (select id as idc, login from persons) as persons on logs.person_id = persons.idc) as all_data`);
    };

    async getTypes() {
        return await db.query(`select * from types`);
    };

    async getFilteredLogs(date, login, type) {
        let boolDate = false;
        let boolType = false;

        if (date.toString().length === 0) boolDate = true;
        if (type.toString().length === 0) boolType = true;

        return await db.query(`select * from 
        (select id, idc, (type_id = 2) as is_edited, form_id, to_char(date, 'YYYY-MM-DD') as date, old_number, old_series, old_usage_date, old_status_id, 
        number, series, type, login from (select * from logs
        inner join (select id as ida, number, series from forms) as forms on logs.form_id = forms.ida
        inner join (select id as idb, type from types) as types on logs.type_id = types.idb
        inner join (select id as idc, login from persons) as persons on logs.person_id = persons.idc) as all_data) as a
        where ((${boolDate} or date = '${date.toString()}')
        and (login like '%${login.toString()}%')
        and (${boolType} or (type = '${type}')))`);
    };

    async deleteForm(id) {
        await db.query(`delete from logs where (form_id = ${id})`);
        return await db.query(`delete from forms where (id = ${id})`);
    };

    async getDataByLogId(id) {
        return await db.query(`select * from 
        (select id, idc, (type_id = 2) as is_edited, form_id, to_char(date, 'YYYY-MM-DD') as date, old_number, old_series, 
        to_char(old_usage_date, 'YYYY-MM-DD') as old_usage_date, old_status_id, old_person_id,
        (select name from persons where (id = old_person_id)) as old_name, (select surname from persons where (id = old_person_id)) as old_surname, 
        (select middle_name from persons where (id = old_person_id)) as old_middle_name, (select status from form_statuses where (id = old_status_id)) as old_status, 
        (select name from persons where (id in (select person_id from forms where id = form_id))) as name,
        (select surname from persons where (id in (select person_id from forms where id = form_id))) as surname,
        (select middle_name from persons where (id in (select person_id from forms where id = form_id))) as middle_name,
        (select status from form_statuses where (id = (select status_id from forms where (id = form_id)))) as status,
        number, series, type, login from (select * from logs
        inner join (select id as ida, number, series from forms) as forms on logs.form_id = forms.ida
        inner join (select id as idb, type from types) as types on logs.type_id = types.idb
        inner join (select id as idc, login from persons) as persons on logs.person_id = persons.idc) as all_data) as a
        where id = ${id}`);
    };

    async addCreationLog(data) {
        return await db.query(`insert into logs (type_id, form_id, person_id, date, old_number, old_series, old_usage_date, old_status_id, old_person_id) 
        values (1, ${data.id}, ${data.person_id}, '${data.usage_date.toString()}', null, null, null, null, null)`);
    };

    async addUpdateLog(data) {
        await db.query(`insert into logs (type_id, form_id, person_id, date, old_number, old_series, old_usage_date, old_status_id, old_person_id) 
        values (2, ${data.id}, ${data.person_id}, '${data.update_date.toString()}', ${data.old_number}, ${data.old_series}, '${data.old_usage_date.toString()}', 
        (select id from form_statuses where (status = '${data.old_status.toString()}')), 
        (select id from persons where (login = '${data.old_login.toString()}')))`);
        return await db.query(`drop table temp`);
    };
}


module.exports = MassMediaRepository;