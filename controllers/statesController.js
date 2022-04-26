const req = require('express/lib/request');
const State = require('../model/State');

const data = {
    states: require('../model/states.json'),
    setEmployees: function (data) { this.states = data }
}

const getRandomInt = require("../middleware/randomNumberGenerator");
const verifyStateCode = require("../middleware/verifyStateCode");

const getStates = (req, res) => {
    var contig="all";
    if (req.query.contig != undefined) {
        console.log(req.query.contig)
        if (req.query.contig==="true") {contig="true" };
        if (req.query.contig==="false") {contig="false" } ; 
    }
    console.log(req.params)
    newstates=[];
    for (var i=0; i < data.states.length; i++){
        switch(contig) {
            case "true":
                if (data.states[i].code != "AK" && data.states[i].code != "HI"){
                    data.states[i].funfacts=[];
                    newstates.push(data.states[i]);
                }
                break;
            case "false":
                if (data.states[i].code === "AK" || data.states[i].code === "HI"){
                    data.states[i].funfacts=[];
                    newstates.push(data.states[i]);
                }
                break;
            default:
                data.states[i].funfacts=[];
                newstates.push(data.states[i]);
        }
    }
    res.json(newstates);
}

const getState = async (req, res) => {
    if (req.query.contig != undefined) {
        console.log(req.query.contig)
    }
    if (!req?.params?.state) return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    var statecode =req.params.state.toUpperCase();
    for (var i=0; i < data.states.length; i++){

        if (data.states[i].code===statecode){
            const state = await State.findOne({ stateCode : statecode }).exec();
            if (!state){
                data.states[i].funfacts=[];
            } else {
                data.states[i].funfacts=state.funfacts;
                }
            res.json(data.states[i])
        }
    }
    res.status(404).json({ 'message': 'Invalid state abbreviation parameter'});
}

const getStateFunfact = async (req, res) => {
    if (!req?.params?.state) return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    var statecode =req.params.state.toUpperCase();
    for (var i=0; i < data.states.length; i++){
        if (data.states[i].code===statecode){
            const state = await State.findOne({ stateCode : statecode }).exec();
            if (!state){
                res.json({"message": "No fun facts found for "+ data.states[i].state })
            } else {
                if (state.funfacts.length > 0){
                    var n = getRandomInt(0,state.funfacts.length-1);
                    res.json({"funfact": state.funfacts[n] })
                } else {
                    res.json({"message": "No fun facts for "+ data.states[i].state })
                }
            }
        }
    }
    res.status(404).json({ 'message': 'Invalid state abbreviation parameter'});
}

const getStateCapital = async (req, res) => {
    if (!req?.params?.state) return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    var stateCode =req.params.state.toUpperCase();
    for (var i=0; i < data.states.length; i++){
        if (data.states[i].code===stateCode){
            res.json({"state": data.states[i].state, "capital": data.states[i].capital_city })
        }
    }
    res.status(404).json({ 'message': 'Invalid state abbreviation parameter'});
}
const getStateNickname = async (req, res) => {
    if (!req?.params?.state) return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    var stateCode =req.params.state.toUpperCase();
    for (var i=0; i < data.states.length; i++){
        if (data.states[i].code===stateCode){
            res.json({"state": data.states[i].state, "nickname": data.states[i].nickname })
        }
    }
    res.status(404).json({ 'message': 'Invalid state abbreviation parameter'});
}
const getStatePopulation = async (req, res) => {
    if (!req?.params?.state) return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    var stateCode =req.params.state.toUpperCase();
    var result;
    for (var i=0; i < data.states.length; i++){
        if (data.states[i].code===stateCode){
            result={"state": data.states[i].state, "population": data.states[i].population };
        }
    }
    if (!result){
        res.status(404).json({ 'message': 'Invalid state abbreviation parameter'});
    }
    res.json(result);
}
const getStateAdmission = async (req, res) => {
    if (!req?.params?.state) return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    var stateCode =req.params.state.toUpperCase();
    var state;
    var admission_date;    
    for (var i=0; i < data.states.length; i++){
        if (data.states[i].code===stateCode){
            //res.json({"state": data.states[i].state, "admitted": data.states[i].admission_date })
            state=data.states[i].state;
            admission_date= data.states[i].admission_date;
            i =  data.states.length;
        }
    }
    if (!state) {
        res.status(404).json({ 'message': 'Invalid state abbreviation parameter'});
    }
    res.json({"state": state, "admitted": admission_date })
}


const createFunFact = async (req, res) => {
    if (!req?.params?.state) return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    var stateCode =req.params.state.toUpperCase();  
    if (!verifyStateCode(stateCode)) return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    if ( !req?.body?.funfacts) {
        return res.status(400).json({ 'message': 'State fun facts value required' });
    }
    const {  funfacts } = req.body; 
    if (!funfacts instanceof Array) return res.status(400).json({ 'message': 'State fun facts value must be an array' });
    var result;
        try {
        const state_m = await State.findOne({ stateCode : stateCode }).exec();
        if (!state_m){
            const result = await State.create({
                stateCode: stateCode,
                funfacts: funfacts
            });
        } else {
            for (var x=0; x < funfacts.length;x++){
                state_m.funfacts.push(funfacts[x]);                
            }
            state_m.save();
            result =await State.findOne({ stateCode : stateCode }).exec();

        }
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const updateFunfact = async (req,res) =>{
    if (!req?.params?.state) return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    var stateCode =req.params.state.toUpperCase(); 
    if (!req?.body?.funfact ) {
        return res.status(400).json({ 'message': 'State fun fact value required' });
    }
    if (!req?.body?.index) {
        return res.status(400).json({ 'message': 'State fun fact index value required' });
    }
    const {  index, funfact } = req.body; 
    if (index < 1)  return res.status(400).json({ 'message': 'Invalid index' });
    var result;
        try {
        const state_m = await State.findOne({ stateCode : stateCode }).exec();
        if (!state_m){
            var stateName;
            for (var i=0; i < data.states.length; i++){
                if (data.states[i].code===stateCode){
                    stateName=data.states[i].state;
                }
            }
            return res.status(400).json({ 'message': 'No Fun Facts found for ' + stateName });
        } else {
            if (index > state_m.funfacts.length) {
                var stateName;
                for (var i=0; i < data.states.length; i++){
                    if (data.states[i].code===stateCode){
                        stateName=data.states[i].state;
                    }
                }
                return res.status(400).json({ 'message': 'No Fun Facts found at that index for '+stateName });   
            } 
            state_m.funfacts[index-1]= funfact;                
            state_m.save();
            result = state_m;
        }
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }

}

const deleteFunfact = async (req,res) =>{
    if (!req?.params?.state) return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    var stateCode =req.params.state.toUpperCase();
    if ( !req?.body?.index) {
        return res.status(400).json({ 'message': 'An index is required' });
    }
    var index = req.body.index; 
    if (index < 1)  return res.status(400).json({ 'message': 'Invalid index' });
    
    var result;
        try {
        var state_m = await State.findOne({ stateCode : stateCode }).exec();
        if (!state_m){
            return res.status(400).json({ 'message': 'State not found' });
        } else {
            if (index > state_m.funfacts.length) return res.status(400).json({ 'message': 'Record not found' });
            index = parseInt(index)-1;
            state_m.funfacts.splice(index,1);                
            state_m.save();
            result = state_m;
        }
        res.status(201).json(result);
    } catch (err) {
        console.log("An Error Has Occurred")
        res.status(500).json({ 'message': err.message });
    }
}


// -------------------- Lagniappes --------------------------------------
const getPopulations = (req, res) => {
    var ord="--";
    if (req.query.rank != undefined || req.query.ascending != undefined || req.query.descending != undefined) {
        if (req.query.ascending==="true" || req.query.descending==="false" || req.query.rank==="ascending") {ord="asc" };
        if (req.query.descending==="true" || req.query.ascending==="false" || req.query.rank==="descending") {ord = "desc"} ; 
    }
    newstates=[];
    for (var i=0; i < data.states.length; i++){
        newstates.push({ state: data.states[i].code,population:  data.states[i].population})
    }
    switch(ord){
        case "asc":
            res.json(newstates.sort((a, b) => parseInt(b.population) - parseInt(a.population)).reverse() );
            break;
        case "desc":
            res.json(newstates.sort((a, b) => parseInt(b.population) - parseInt(a.population)) );
            break;
        default:
            res.json(newstates);
        }
}

const getAdmissions = (req, res) => {
    var ord="--";
    if (req.query.rank != undefined || req.query.ascending != undefined || req.query.descending != undefined) {
        if (req.query.ascending==="true" || req.query.descending==="false" || req.query.rank==="ascending") {ord="asc" };
        if (req.query.descending==="true" || req.query.ascending==="false" || req.query.rank==="descending") {ord = "desc"} ; 
    }
    newstates=[];
    for (var i=0; i < data.states.length; i++){
        newstates.push({ state: data.states[i].code,admission:  data.states[i].admission_date})
    }
    switch(ord){
        case "asc":
            res.json(newstates.sort((a, b) => parseInt(b.admission) - parseInt(a.admission)).reverse() );
            break;
        case "desc":
            res.json(newstates.sort((a, b) => parseInt(b.admission) - parseInt(a.admission)) );
            break;
        default:
            res.json(newstates);
        }
}
const getCapitals = (req, res) => {
    newstates=[];
    for (var i=0; i < data.states.length; i++){
        newstates.push({ state: data.states[i].code,capital:  data.states[i].capital_city})
    }
    res.json(newstates);
}
const getNickNames = (req, res) => {
    newstates=[];
    for (var i=0; i < data.states.length; i++){
        newstates.push({ state: data.states[i].code,capital:  data.states[i].nickname})
    }
    res.json(newstates);
}

module.exports = {getStates, getState, getStateFunfact, 
                 getStateCapital,getStateNickname, getStatePopulation,
                 getStateAdmission, createFunFact, updateFunfact, deleteFunfact,
                 getPopulations, getAdmissions,getCapitals,getNickNames };