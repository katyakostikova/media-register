const db = require('../db');
const md5 = require('md5')


//@ВРОДЕ ПЕРЕДЕЛАЛА@ +новое
class AuthRepository {
    async getFoundations() {
        return await db.query(`select * from foundations`);
    };

    async getPositions() {
        return await db.query(`select * from positions`);
    };

    async getPassportAuth() {
        return await db.query(`select * from passport_authorities`);
    };

    async getAdmin(login) {
        return await db.query(`select count (distinct login) from persons where (role = 'Адміністратор' and login = '${login}')`);
    };

    async getUser(login) {
        return await db.query(`select count (distinct login) from persons where (login = '${login}')`);
    };

    async getUserWithPass(login, password) {
        return await db.query(`select count (distinct login) from persons where (login = '${login}' and password  = '${md5(password)}')`);
    };

    async addAdmin(adminData) {
        return await db.query(`insert into passports (number, series, issue_date, issued_by) values (${adminData.passport_number}, ${adminData.series === undefined ? null : adminData.series}, '${adminData.passport_date.toString()}', (select id from passport_authorities where number = ${adminData.passport_issue}));
            insert into persons (
            name, surname, midname, passport_id, birthday, taxnum, login, password, foundation_id, position_id, is_active, role, email
            ) values (
            '${adminData.name.toString()}', '${adminData.surname.toString()}', '${adminData.midname.toString()}', (select id from passports where number = '${adminData.passport_number.toString()}'), '${adminData.birthdate.toString()}', ${adminData.taxnum}, 
            '${adminData.login.toString()}', '${md5(adminData.password).toString()}', (select id from institutions where name = '${adminData.institution.toString()}'), (select id from positions where name = '${adminData.position.toString()}'), 
            true, 'Адміністратор', '${adminData.email.toString()}')
            )`
        );
    };

    async addRegistrator(adminData) {
        return await db.query(`insert into passports (number, series, issue_date, issued_by) values (${adminData.passport_number}, ${adminData.series === undefined ? null : adminData.series}, '${adminData.passport_date.toString()}', (select id from passport_authorities where number = ${adminData.passport_issue}));
        insert into persons (
        name, surname, midname, passport_id, birthday, taxnum, login, password, foundation_id, position_id, is_active, role, email
        ) values (
        '${adminData.name.toString()}', '${adminData.surname.toString()}', '${adminData.midname.toString()}', (select id from passports where number = '${adminData.passport_number.toString()}'), '${adminData.birthdate.toString()}', ${adminData.taxnum}, 
        '${adminData.login.toString()}', '${md5(adminData.password).toString()}', (select id from institutions where name = '${adminData.institution.toString()}'), (select id from positions where name = '${adminData.position.toString()}'), 
        true, 'Реєстратор', '${adminData.email.toString()}')
        )`
        );
    };

    async getErrorMessage(data, type) {
        if (type === 1) {
            console.log(data);
            let foundUsers = await this.getUser(data.login.toString());
            let foundUsersWithPass = await this.getUserWithPass(data.login.toString(), data.password.toString());
            if (foundUsers.rows[0].count === '0') {
                return "Error: Користувача з таким логіном не існує";
            }
            if (foundUsersWithPass.rows[0].count === '0') {
                return "Error: Неправильний пароль";
            }
            return "";
        }
        
const db = require('../db');
const md5 = require('md5')

class AuthRepository {
    async getInstitutions() {
        return await db.query(`select * from institutions`);
    };

    async getPositions() {
        return await db.query(`select * from positions`);
    };

    async getIssues() {
        return await db.query(`select * from passport_authorities`);
    };

    async getAdmin(login) {
        return await db.query(`select count (distinct login) from persons where (role = 'Адміністратор' and login = '${login}')`);
    };

    async getUser(login) {
        return await db.query(`select count (distinct login) from persons where (login = '${login}')`);
    };

    async getDeRegistrators(login) {
        return await db.query(`select * from persons where (login = '${login}')`);
    };

    async getUserWithPass(login, password) {
        return await db.query(`select count (distinct login) from persons where (login = '${login}' and password  = '${md5(password)}')`);
    };

    async getEmails(email) {
        return await db.query(`select count (distinct email) from emails where (email = '${email}')`);
    };

    async addAdmin(adminData) {
        return await db.query(`insert into passports (number, series, issue_date, issued_by) values (${adminData.passport_number}, ${adminData.series === undefined ? null : adminData.series}, '${adminData.passport_date.toString()}', (select id from passport_authorities where number = ${adminData.passport_issue}));
            insert into persons (
            name, surname, middle_name, passport_id, birth_date, taxpayer_number, login, password, institution_id, position_id, is_active, role, email_id
            ) values (
            '${adminData.name.toString()}', '${adminData.surname.toString()}', '${adminData.middle_name.toString()}', (select id from passports where number = '${adminData.passport_number.toString()}'), '${adminData.birthdate.toString()}', ${adminData.taxpayer_number}, 
            '${adminData.login.toString()}', '${md5(adminData.password).toString()}', (select id from institutions where name = '${adminData.institution.toString()}'), (select id from positions where name = '${adminData.position.toString()}'), 
            true, 'Адміністратор', (select id from emails where email = '${adminData.email.toString()}')
            )`
        );
    };

    async addRegistrator(adminData) {
        return await db.query(`insert into passports (number, series, issue_date, issued_by) values (${adminData.passport_number}, ${adminData.series === undefined ? null : adminData.series}, '${adminData.passport_date.toString()}', (select id from passport_authorities where number = ${adminData.passport_issue}));
            insert into persons (
            name, surname, middle_name, passport_id, birth_date, taxpayer_number, login, password, institution_id, position_id, is_active, role, email_id
            ) values (
            '${adminData.name.toString()}', '${adminData.surname.toString()}', '${adminData.middle_name.toString()}', (select id from passports where number = '${adminData.passport_number.toString()}'), '${adminData.birthdate.toString()}', ${adminData.taxpayer_number}, 
            '${adminData.login.toString()}', '${md5(adminData.password).toString()}', (select id from institutions where name = '${adminData.institution.toString()}'), (select id from positions where name = '${adminData.position.toString()}'), 
            true, 'Реєстратор', (select id from emails where email = '${adminData.email.toString()}')
            )`
        );
    };

    async getErrorMessage(data, type) {
        if (type === 1) {
            let foundUsers = await this.getUser(data.login.toString());
            let foundUsersWithPass = await this.getUserWithPass(data.login.toString(), data.password.toString());
            let deactivatedRegistrators = await this.getDeRegistrators(data.login.toString());
            if (foundUsers.rows[0].count === '0') {
                return "Error: Користувача з таким логіном не існує";
            }
            if (foundUsersWithPass.rows[0].count === '0') {
                return "Error: Невірний пароль";
            }
            if (deactivatedRegistrators.rows[0].role === "Реєстратор" && deactivatedRegistrators.rows[0].is_active === false) {
                return "Error: Реєстратор не активований";
            }
            return "";
        }
        else if (type === 2) {
            let foundAdmins = await this.getUser(data.login.toString());
            let foundEmails = await this.getEmails(data.email.toString());
            if (foundAdmins.rows[0].count !== '0') {
                return "Error: адміністратор з таким логіном вже існує";
            }
            if (data.password !== data.password_confirmation) return "Error: паролі не співпадають";
            if (foundEmails.rows[0].count === '0') {
                return "Error: Такої пошти Адміністратора не існує";
            }
            return "";
        }
        else {
            let foundRegistrators = await this.getUser(data.login.toString());
            if (foundRegistrators.rows[0].count !== '0') {
                return "Error: Реєстратор з таким логіном вже існує";
            }
            if (data.password !== data.password_confirmation) return "Error: паролі не співпадають";
            return "";
        }
    };

    async getLoginData(loginData) {
        return await db.query(`select id, role, login from persons where (login = '${loginData.login}' and password = '${md5(loginData.password)}')`);
    };

    async addCurrentPerson(personId) {
        return await db.query(`insert into current_per (id) values (${personId})`);
    };

    async deleteCurrentPerson() {
        return await db.query(`delete from current_per`);
    };
}

module.exports = AuthRepository;