const router = require('express').Router();
const massMediaController = require('../controllers/MassMediaController');

router.get('/new', massMediaController.getMassMediaData);
router.get('/all', massMediaController.getMassMedias);
router.get('/filtered', massMediaController.getFilteredMassMedias);
router.get('/allLogs', massMediaController.getAllLogs);
router.get('/filteredLogs', massMediaController.getFilteredLogs);
router.get('/:id', massMediaController.getMassMediaById);
router.get('/', massMediaController.getHomePage);
router.post('/', massMediaController.addMassMedia);
router.post('/:id/edit', massMediaController.updateMassMedia);
router.get('/:id/edit', massMediaController.getMediaForEdit);
module.exports = router;