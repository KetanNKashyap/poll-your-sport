import React, { Component } from 'react';
import PropTypes from 'prop-types';

class VoteOptions extends Component {
    render() {
        const { team1, team2, league, onVoteClick } = this.props;
        return (
            <div className="vote-section">
                <div className="chip" onClick={(e) => onVoteClick(e, league, team1.id)}>
                    {team1.awayName}
                </div>
                <br />
                <br />
                <div className="chip" onClick={(e) => onVoteClick(e, league, 0)}> {/* 0 is for draw match */}
                    Draw
                    </div>
                <br />
                <br />
                <div className="chip" onClick={(e) => onVoteClick(e, league, team2.id)}>
                    {team2.awayName}
                </div>
            </div>
        );
    }
}

VoteOptions.propTypes = {
    team1: PropTypes.object.isRequired,
    team2: PropTypes.object.isRequired,
    league: PropTypes.string.isRequired,
    onVoteClick: PropTypes.func,
};

export default VoteOptions;
