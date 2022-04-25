const express = require('express');
const router = express.Router();
const {getStates, getState, getStateFunfact, getStateCapital,getStateNickname,
      getStatePopulation, getStateAdmission, createFunFact, updateFunfact, deleteFunfact,
      getPopulations, getAdmissions, getCapitals, getNickNames} = require('../controllers/statesController');

router.route('/')
.get(getStates)

router.route('/populations')
  .get(getPopulations);
router.route('/admissions')
  .get(getAdmissions);
router.route('/capitals')
    .get(getCapitals);
router.route('/nicknames')
.get(getNickNames);
  
  
router.route('/:state/funfacts')
  .get(getStateFunfact)
  .post(createFunFact);
router.route('/:state/funfact')
  .get(getStateFunfact)
  .post(createFunFact)
  .patch(updateFunfact)
  .delete(deleteFunfact);
router.route('/:state/capital')
  .get(getStateCapital);
router.route('/:state/nickname')
  .get(getStateNickname);
router.route('/:state/population')
  .get(getStatePopulation);
router.route('/:state/admission')
  .get(getStateAdmission);
 
router.route('/:state')
  .get(getState);

module.exports = router;