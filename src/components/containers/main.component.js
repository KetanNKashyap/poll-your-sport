import React, { Component } from 'react';

import Card from '../common/card.component';
import { SPORT_EVENTS } from '../../constants/eventsConstant';
import { transformEventsJson, saveToLocal, fetchFromLocal } from '../../utils/helper';

// draw id
const draw = 0;

class Main extends Component {
    state = {
        selectedSport: {},
        pollResults: [],
        transformedEvents: [] // transformed JSON for sports
    }

    randomKeyObject = (DataArray = []) => DataArray[Math.floor(Math.random() * DataArray.length)];

    componentDidMount() {
        // restruture events by category, filter out FINISHED and Single Team events
        const transformedEvents = transformEventsJson(SPORT_EVENTS);
        const randomSport = this.randomKeyObject(transformedEvents);
        const pollResults = fetchFromLocal('poll_results');
        this.setState({
            transformedEvents,
            selectedSport: randomSport,
            pollResults: pollResults ? pollResults : [],
        })
    }

    updateRandomSport = () => {
        const { transformedEvents } = this.state;
        const randomSport = this.randomKeyObject(transformedEvents);
        this.setState({
            selectedSport: randomSport,
        })
    }

    setToLocal = () => {
        const { pollResults } = this.state;
        saveToLocal('poll_results', pollResults);
    }

    handleVoteClick = (e, league, teamId) => {
        e.preventDefault();
        const { pollResults, selectedSport: { groups = [] } } = this.state;
        const { teams } = groups.find(g => g.league === league);
        const foundLeague = pollResults.find(l => l.league === league);
        const foundindex = pollResults.findIndex(l => l.league === league);
        if (foundLeague) {
            const { polls = {} } = foundLeague;
            const updatedPolls = Object.keys(polls).reduce((acc, id) => {
                if (Number(id) === teamId) {
                    acc[id] = polls[id] + 1;
                } else acc[id] = polls[id];
                return acc;
            }, {});
            const updatedPollsResult = [
                ...pollResults.slice(0, foundindex),
                {
                    ...foundLeague,
                    polls: updatedPolls
                },
                ...pollResults.slice(foundindex + 1)
            ]
            this.setState({
                pollResults: updatedPollsResult
            }, () => this.setToLocal())
        } else {
            const teamsPolls = teams.reduce((acc, { id }) => {
                if (id === teamId) {
                    acc[teamId] = 1;
                } else acc[id] = 0;
                return acc;
            }, {})
            const newLeagueResult = {
                league,
                polls: {
                    ...teamsPolls,
                    ...(teamId === draw ? { [teamId]: 1 } : { [draw]: 0 }),
                }
            }
            this.setState({
                pollResults: [...this.state.pollResults, newLeagueResult]
            }, () => this.setToLocal())
        }
    }

    render() {
        const { selectedSport: { sport, groups }, pollResults } = this.state;
        const isSportAvailable = sport && groups && groups.length;
        return (
            <div>
                <header>
                    <h2>Vote for your favourite team!</h2>
                    <button onClick={() => this.updateRandomSport()} className="refresh">Refresh Category</button>
                    {sport && <h3>{sport}</h3>}
                </header>
                {isSportAvailable && <div style={{ padding: 30, textAlign: 'center' }}>
                    {groups.map((group, index) => <Card
                        pollResults={pollResults}
                        key={index}
                        group={group}
                        onVoteClick={this.handleVoteClick}
                    />)}
                </div>}
            </div>
        );
    }
}

export default Main;
