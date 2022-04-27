
function displayStateDetail(state) {
    var state_r={};
    state_r.state=state.state;
    state_r.slug=state.slug;
    state_r.code=state.code;
    state_r.nickname=state.nickname;
    state_r.website=state.website;
    state_r.admission_date=state.admission_date;
    state_r.admission_number=state.admission_number;
    state_r.capital_city=state.capital_city;
    state_r.capital_url=state.capital_city;
    state_r.population=state.population.toLocaleString("en-US");
    state_r.population_rank=state.population_rank;
    state_r.constitution_url=state.constitution_url;
    state_r.state_flag_url=state.state_flag_url;
    state_r.state_seal_url=state.state_seal_url;
    state_r.map_image_url=state.map_image_url;
    state_r.landscape_background_url=state.landscape_background_url;
    state_r.skyline_background_url=state.skyline_background_url;
    if (state.twitter_url) {
        state_r.twitter_url=state.twitter_url;
    }
    if (state.facebook_url) {
        state_r.facebook_url=state.facebook_url;
    }
    return state_r;
}

module.exports = displayStateDetail;
