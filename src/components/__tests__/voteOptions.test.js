import React from 'react';
import { shallow } from '../../enzyme';

import VoteOptions from '../common/voteOptions.component';

const team1 = {
    awayName: "Chernetsova, D/Perper, A",
    country: "FRANCE",
    createdAt: "2015-12-18T12:30:39.317Z",
    group: "El Kantaoui",
    homeName: "Baskova, D/Podlinska, M",
    id: 1003026673,
    name: "Baskova, D/Podlinska, M - Chernetsova, D/Perper, A",
    objectId: "heL53W56d2",
    sport: "TENNIS",
    state: "STARTED"
};
const team2 = {
    awayName: "Njoze, M",
    country: "SWEDEN",
    createdAt: "2015-12-18T12:30:39.322Z",
    group: "El Kantaoui",
    homeName: "Stoilkovska, M",
    id: 1003026214,
    name: "Stoilkovska, M - Njoze, M",
    objectId: "gldlV9xhi2",
    sport: "TENNIS",
    state: "STARTED"
};
const league = "El Kantaoui";

describe('Vote Options tests', () => {
    it('renders teams (VS) match', () => {
        const wrapper = shallow(<VoteOptions
            team1={team1}
            team2={team2}
            league={league}
        />);

        // Expect the wrapper object to be defined
        expect(wrapper.find('.vote-section')).toBeDefined();
        // Expect chip class (team1, team2, draw) count to be 3
        expect(wrapper.find('.chip')).toHaveLength(3);
    });

    it('renders correct text for team 1 / first team', () => {
        const wrapper = shallow(<VoteOptions
            team1={team1}
            team2={team2}
            league={league}
        />);

        const firstTeam = wrapper.find('.chip').first();
        expect(firstTeam.text()).toEqual(team1.awayName)
    });

    it('renders correct text for team 2 / last team', () => {
        const wrapper = shallow(<VoteOptions
            team1={team1}
            team2={team2}
            league={league}
        />);

        const firstTeam = wrapper.find('.chip').last();
        expect(firstTeam.text()).toEqual(team2.awayName)
    });
});