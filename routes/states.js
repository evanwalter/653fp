const express = require('express');
const router = express.Router();
const {getStates, getState, getStateFunfact, 
      getStateCapital,getStateNickname,
      getStatePopulation, getStateAdmission, createFunFact, updateFunfact} = require('../controllers/statesController');
//const ROLES_LIST = require('../../config/roles_list');
//const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
.get(getStates)
  //  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee)
  //  .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
  //  .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

 router.route('/:state/funfacts')
  .get(getStateFunfact)
  .post(createFunFact);
  router.route('/:state/funfact')
  .get(getStateFunfact)
  .post(createFunFact)
  .patch(updateFunfact);
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