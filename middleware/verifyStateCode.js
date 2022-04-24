
const data = {
    states: require('../model/states.json'),
    setEmployees: function (data) { this.states = data }
}

function verifyStateCode(stateCode) {
    for (var i=0; i < data.states.length; i++){
        if (data.states[i].code===stateCode) return true;
    }
    return false;
}

module.exports = verifyStateCode;