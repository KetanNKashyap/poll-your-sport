import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-google-charts';
import VoteOptions from '../common/voteOptions.component';
import '../../styles/card.css'

class Card extends Component {
  state = {
    votingSection: false,
    pollsSection: false,
  }

  handleVoteButton = () => {
    this.setState({
      votingSection: !this.state.votingSection
    })
  }

  handleViewPolls = () => {
    this.setState({
      pollsSection: !this.state.pollsSection
    })
  }

  onVoteClick = (e, league, teamId) => {
    const { onVoteClick } = this.props;
    onVoteClick(e, league, teamId);
    this.setState({
      votingSection: false
    })
  }

  renderEventVsSection = () => {
    const { group: { teams, league }, pollResults } = this.props;
    // for now no permutation/combinations are made while transforming JSON for matches
    // so we consider each league has max 2 teams for now.
    const teamCountValid = teams.length && teams.length === 2;
    const isLeaguePresent = pollResults.find(p => p.league === league);
    return <div>
      {teamCountValid ? <div>
        <br />
        <h5>{teams[0].awayName}</h5>
        <h3>{'Vs'}</h3>
        <h5>{teams[1].awayName}</h5>
        <button
          className="custom-button button-submit"
          onClick={this.handleVoteButton}>Vote / Poll</button>
        {isLeaguePresent && <button
          className="custom-button button-submit"
          onClick={this.handleViewPolls}>View Polls</button>}
      </div> : <p>{'You cannot vote at the moment as only 1 team has confirmed participation'}</p>}
    </div>
  }

  renderPollsResultsSection = (league) => {
    const { group: { teams }, pollResults } = this.props;
    const { polls } = pollResults.find(p => p.league === league);
    let topMostArray = [['Events', 'Votes']];
    const data = Object.keys(polls).reduce((acc, id) => {
      //draw case
      if (Number(id) === 0) {
        acc.push(['Draw', polls[id]])
      } else {
        const { awayName } = teams.find(t => t.id === Number(id));
        acc.push([awayName, polls[id]]);
      }
      return acc;
    }, topMostArray);
    return (
      <div style={{ display: 'inline-block' }}>
        <Chart
          width='500px'
          height='300px'
          chartType='PieChart'
          data={data}
          options={{
            title: "Sports event polling",
            is3d: true
          }}
        />
        <br />
        <button
          className="custom-button button-cancel"
          onClick={this.handleViewPolls}
        >Back</button>
      </div>
    )
  }

  renderCancelButton = () => <button
    className="custom-button button-cancel"
    onClick={this.handleVoteButton}>Cancel</button>

  render() {
    const { votingSection, pollsSection } = this.state;
    const { group: { league, teams } } = this.props;
    return (
      <div className="card">
        <div className="card-inner">
          {/* show teams match */}
          <h2>{league}</h2>
          {!votingSection && !pollsSection && this.renderEventVsSection()}
          {pollsSection && this.renderPollsResultsSection(league)}
          {votingSection && <VoteOptions
            onVoteClick={this.onVoteClick}
            league={league}
            team1={teams[0]}
            team2={teams[1]}
          />}<br></br><br></br>
          {votingSection && this.renderCancelButton()}
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  onVoteClick: PropTypes.func.isRequired,
  pollResults: PropTypes.array,
  group: PropTypes.object
};

export default Card;
