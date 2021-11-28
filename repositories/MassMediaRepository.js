const db = require('../db');
const moment= require('moment')
var count = 0; 

    function addQueryPart(value, name) {
        var query = ``;
        console.log(value)
        if (value) {
            if (count != 0) {
                query+= ` and `;
            }
            
            query+= ` (cast(${name} as text) like '%${value.toString()}%') `

            count++;
        }
        return query;
    }

class MassMediaRepository {
    async getMassMedias() {
        return await db.query('select * from mass_media');
    };

    async getFilteredMassMedias(vals) {
        
        var query = '';

         query+= addQueryPart(vals.number, 'number');
         query+= addQueryPart(vals.series, 'series');
         query+= addQueryPart(vals.status, 'type');
         query+= addQueryPart(vals.who_registered, 'who_registered');
         query+= addQueryPart(vals.date_registration, 'date_registarion');

         query+= addQueryPart(vals.name, 'name');
         query+= addQueryPart(vals.language, 'language');
         query+= addQueryPart(vals.scope_of_distribution, 'scope_of_distribution');
         query+= addQueryPart(vals.frequency_of_issue, 'frequency_of_issue');
         query+= addQueryPart(vals.amount, 'amount');
         query+= addQueryPart(vals.objectives, 'objectives');


        var query1 = '';
        if (count > 0) {

            query1 = `select * from mass_media where (` + query;
            query = query1
        } else {
            query = `select * from mass_media`;
        }



        if (vals.firstName ||  vals.surname || vals.midname) {

            var lastChar = '';
            if (count > 0) {
                query+= ` and (person_id in (`
                lastChar = ')';
            } else {
                query+= ` where (person_id in (`
            }

                count = 0;
             

             var subQuery = `select id from persons where (`;

             subQuery+= addQueryPart(vals.firstName, 'name');
             subQuery+= addQueryPart(vals.surname, 'surname');
             subQuery+= addQueryPart(vals.midname, 'midname');
             subQuery+= `)`

             query+= subQuery + `))` + lastChar;
        } else {
            if(count > 0) {
             query+= `)`;
            }

        }
        
        
        count = 0;

         

         const result =  await db.query(query);

         var results = {q:vals, result:result };

         console.log(results);

        return results
    };

    async getMassMediaById(id) {
        return await db.query(`select mass_media.id, number, series, to_char(date_registarion, 'YYYY-MM-DD') as date, type, mass_media.name, language, date_registarion, scope_of_distribution, who_registered, frequency_of_issue, amount, is_active,
        persons.name as pername, surname, midname, person_id from 
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
       const result =  await db.query(`insert into mass_media (number, series, type, name, language, date_registarion, scope_of_distribution,
            frequency_of_issue, amount, objectives, person_id, who_registered) 
            values (${massMediaData.number}, ${massMediaData.series},
                 '${massMediaData.type.toString()}', '${massMediaData.name.toString()}',
                 '${massMediaData.language.toString()}', '${moment().format('Y-M-D').toString()}',
                 '${massMediaData.scope_of_distribution.toString()}', '${massMediaData.frequency_of_issue.toString()}',
                 '${massMediaData.amount}', null, (select id from persons where (login = '${massMediaData.login.toString()}')),
                 '${massMediaData.login.toString()}')`);

        if (result) {
            return await db.query(`select id, number, series, type, name, language, to_char(date_registarion, 'YYYY-MM-DD') as date, scope_of_distribution,
                    frequency_of_issue, amount, objectives, person_id, who_registered
                from mass_media order by id desc limit 1`);
        } else {
            return null
        }
        
    };

    
    async editMassMedia(massMediaData, id) {
        console.log(massMediaData)
       
      const result =  await db.query(`update mass_media set number = ${massMediaData.number}, series = ${massMediaData.series}, type = '${massMediaData.type.toString()}', 
                        name = '${massMediaData.name.toString()}', language = '${massMediaData.language.toString()}', date_registarion = '${massMediaData.date_registarion.toString()}', 
                        scope_of_distribution = '${massMediaData.scope_of_distribution.toString()}', frequency_of_issue = '${massMediaData.frequency_of_issue.toString()}', 
                        amount = ${massMediaData.amount}
                        where id=${id}`);


        if (result) {
            return massMediaData;
        } else {
            return {};
        }


        //person_id = (select id from persons where (login = '${massMediaData.login.toString()}')),
        //who_registered = '${massMediaData.who_registered.toString()}'); //

    /*    await db.query(`create table temp as (select id, number, series, type, name, language, date_registarion, scope_of_distribution,
        frequency_of_issue, amount, objectives, person_id, who_registered from mass_media where (id = ${id}));
        alter table temp add column temp_id serial primary key, add column old_number int,
        add column old_series int, add column old_type int, add column old_name int,
        add column old_language int, add column old_date_registarion date, add column old_scope_of_distribution text, 
        add column old_frequency_of_issue text, add column old_amount text, add column old_objectives text,
        add column who_registered text, add column old_login text, add column update_date date;
        update temp set old_number = ${massMediaData.old_number}, old_series = ${massMediaData.old_series}, old_type = '${massMediaData.old_type}',
        old_name = ${massMediaData.old_name}, old_language = ${massMediaData.old_language}, old_date_registarion = ${massMediaData.old_date_registarion},
        old_scope_of_distribution = ${massMediaData.old_scope_of_distribution}, old_frequency_of_issue = ${massMediaData.old_frequency_of_issue},
        old_amount = ${massMediaData.old_amount}, old_objectives = null, who_registered=${massMediaData.who_registered},
        old_login = '${massMediaData.old_login.toString()}', update_date = '${moment().format('L').toString()}'`);

       
        const temp = await db.query(`select * from temp`);
*/



   

    

var data = {
    old_number:massMediaData.old_number,
    old_series:massMediaData.old_series,
    old_type: massMediaData.old_type,
    old_name: massMediaData.old_name,
    old_language: massMediaData.old_language,
    old_date_registarion: massMediaData.old_date_registarion,
    old_scope_of_distribution: massMediaData.old_scope_of_distribution,
    old_frequency_of_issue: massMediaData.old_frequency_of_issue,
    update_date: moment().format('L').toString(),
    old_login: massMediaData.old_login,
    old_objectives: massMediaData.old_objectives,
    who_registered: massMediaData.who_registered,
    old_amount: massMediaData.old_amount,
   
    id: id,
    number: massMediaData.number,
    series: massMediaData.series,
    type: massMediaData.type,
    name: massMediaData.name,
    language: massMediaData.language,
    date_registarion: massMediaData.date_registarion,
    scope_of_distribution: massMediaData.scope_of_distribution,
    frequency_of_issue: massMediaData.frequency_of_issue,
    amount: massMediaData.amount,
    person_id: massMediaData.person_id,
    who_registered: massMediaData.who_registered,
    objectives: massMediaData.objectives
}

console.log(data)


return data;

        /*  return await db.query(`select id, number, series, person_id, 
          old_number, old_series, old_type, old_name, old_language, old_date_registarion,
          old_scope_of_distribution, old_frequency_of_issue, old_amount, old_objectives, old_who_registered, old_login,
          to_char(update_date, 'YYYY-MM-DD') as update_date from temp where (temp_id = ${temp.rows[0].temp_id})`);*/
      }

    //изменения во вкладке доков
    async editLogMassMedia(massMediaData, id) {
        return await db.query(`update mass_media set number = ${mass_media.number}, series = ${mass_media.series}, type = '${massMediaData.type.toString()}', 
        name = '${massMediaData.name.toString()}', language = '${massMediaData.language.toString()}', date_registarion = '${massMediaData.date_registarion.toString()}', 
        scope_of_distribution = '${massMediaData.scope_of_distribution.toString()}', frequency_of_issue = '${massMediaData.frequency_of_issue.toString()}', 
        amount = ${massMediaData.amount}, objectives = '${massMediaData.objectives.toString()}', 
        person_id = (select id from persons where (login = '${massMediaData.login.toString()}')),
        who_registered = '${massMediaData.who_registered.toString()}' where id=${id}`);
    };

    async getUserById(id) {
        return await db.query(`select id, name, surname, midname, to_char(birthday, 'YYYY-MM-DD') as birthday, role, is_active from persons where (id = ${id})`);
    };


    async getRegistrators() {
        return await db.query(`select * from persons where (role = 'Реєстратор')`);
    };

    async getUsers() {
        return await db.query(`select * from persons where (role = 'Користувач')`);
    };

    async activateRegistrator(id) {
        return await db.query(`update persons set is_active = true where (id = ${id})`);
    };

    async deactivateRegistrator(id) {
        return await db.query(`update persons set is_active = false where (id = ${id})`);
    };

    async deleteUser(id) {
        return await db.query(`delete from persons where (id = ${id})`);
    };

    async getAllLogs() {
        return await db.query(`select id, idc, (type_id = 2) as is_edited, mass_media_id, to_char(date, 'YYYY-MM-DD') as date, old_number, old_series, old_type, old_name, old_language, to_char(old_date_registarion, 'YYYY-MM-DD') as old_date_registarion,
        old_scope_of_distribution, old_frequency_of_issue, old_amount, old_objectives, old_who_registered, number, series, type, login from (select * from logs
        inner join (select id as ida, number, series from mass_media) as mass_media on logs.mass_media_id = mass_media.ida
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
        (select id, idc, (type_id = 2) as is_edited, mass_media_id, to_char(date, 'YYYY-MM-DD') as date, old_number, old_series, old_type, old_name, old_language, to_char(old_date_registarion, 'YYYY-MM-DD') as old_date_registarion,
        old_scope_of_distribution, old_frequency_of_issue, old_amount, old_objectives, old_who_registered,
        number, series, type, login from (select * from logs
        inner join (select id as ida, number, series from mass_media) as mass_media on logs.mass_media_id = mass_media.ida
        inner join (select id as idb, type from types) as types on logs.type_id = types.idb
        inner join (select id as idc, login from persons) as persons on logs.person_id = persons.idc) as all_data) as a
        where ((${boolDate} or date = '${date.toString()}')
        and (login like '%${login.toString()}%')
        and (${boolType} or (type = '${type}')))`);
    };

    async deleteMassMedia(id) {
        await db.query(`delete from logs where (mass_media_id = ${id})`);
        return await db.query(`delete from mass_media where (id = ${id})`);
    };

    
    async getDataByLogId(id) {
        return await db.query(`select * from 
        (select id, idc, (type_id = 2) as is_edited, old_number, old_series, old_type, old_name, old_language, to_char(old_date_registarion, 'YYYY-MM-DD') as old_date_registarion,
        old_scope_of_distribution, old_frequency_of_issue, old_amount, old_objectives, old_who_registered, old_person_id,
        (select name from persons where (id = old_person_id)) as old_name, (select surname from persons where (id = old_person_id)) as old_surname, 
        (select midname from persons where (id = old_person_id)) as old_midname, 
        (select name from persons where (id in (select person_id from mass_media where id = mass_media_id))) as name,
        (select surname from persons where (id in (select person_id from mass_media where id = mass_media_id))) as surname,
        (select midname from persons where (id in (select person_id from mass_media where id = mass_media_id))) as midname,
        number, series, type, login from (select * from logs
        inner join (select id as ida, number, series from mass_media) as mass_media on logs.mass_media_id = mass_media.ida
        inner join (select id as idb, type from types) as types on logs.type_id = types.idb
        inner join (select id as idc, login from persons) as persons on logs.person_id = persons.idc) as all_data) as a
        where id = ${id}`);
    };

    async addCreationLog(data) {
        console.log(data)
        return await db.query(
            `insert into logs ( type_id, mass_media_id, person_id, date, old_number, old_series, old_type, old_name, 
            old_language, old_date_registarion,
        old_scope_of_distribution, old_frequency_of_issue, old_amount, old_objectives, old_who_registered, old_person_id) 
        values (1, ${data.id}, ${data.person_id}, '${data.date.toString()}', null, null, null, null, null, null, null, 
        null, null, null, null, null)`);
    };

    async addUpdateLog(data) {
        console.log(data)
        
        return await db.query(`insert into logs (type_id, mass_media_id, person_id,
         date, old_number, old_series, old_type, old_name, old_language, old_date_registarion,
        old_scope_of_distribution, old_frequency_of_issue, old_amount, old_objectives, old_who_registered, old_person_id) 
        values (2, ${data.id}, ${data.person_id}, '${moment().format('Y-M-D hh:mm:ss').toString()}', ${data.old_number}, ${data.old_series}, '${data.old_type.toString()}', '${data.old_name.toString()}', 
        '${data.old_language.toString()}', '${data.old_date_registarion.toString()}', '${data.old_scope_of_distribution.toString()}', 
        '${data.old_frequency_of_issue.toString()}', ${data.old_amount}, 
        null, '${data.who_registered.toString()}', 
         ${data.person_id})`);
    };
}


module.exports = MassMediaRepository;