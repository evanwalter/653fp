
const data = {
    states: require('../model/states.json')
    //setEmployees: function (data) { this.states = data }
}

function verifyStateCode(stateCode) {
    var codes = data.states.map(s => s.code);
    for (var i=0; i <codes.length; i++){
        if (codes[i]===stateCode) return true;
    }
    return false;
}

module.exports = verifyStateCode;