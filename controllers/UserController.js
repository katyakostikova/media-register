//const db = require('../db');
const MassMediaRepository = require('../repositories/MassMediaRepository');
const massMediaRepository = new MassMediaRepository();

module.exports = {

	/*  async getPersons(req, res) {
        const persons = await db.query('select * from persons');
        res.json(persons.rows);
    };*/

    async getUserById(req, res) {
    	const user = await massMediaRepository.getUserById(req.params.id);

        const currentPerson = await massMediaRepository.getCurrentPerson();
        console.log(currentPerson);
        res.render('userPage', {user: user.rows[0], login: currentPerson.rows[0].login, role: currentPerson.rows[0].role, id: currentPerson.rows[0].id,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор", isRegOnPage: user.rows[0].role === "Реєстратор", view: false}
);
       
    },

    async getRegistrators(req, res) {
    	console.log("Registraort here ")
        const registrators = await massMediaRepository.getRegistrators();
        const currentPerson = await massMediaRepository.getCurrentPerson();
        res.render('registrators', {registrators: registrators.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role, id: currentPerson.rows[0].id,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор"});
    },

    /*
{user: user.rows[0], login: currentPerson.rows[0].login, role: currentPerson.rows[0].role, id: currentPerson.rows[0].id,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор", isRegOnPage: user.rows[0].role === "Реєстратор", view: false}

    */
 }