const isNotFinished = ({ state }) => state !== 'FINISHED';

export const transformEventsJson = (events = []) => {
  return events
    .filter(isNotFinished)   // filter out events that are already in FINISHED state
    .reduce((acc, event) => { // reduce events by sport category --> by group/league/tournament
      const { group, sport } = event;
      const foundSport = acc.find(s => s.sport === sport);
      const foundSportIndex = acc.findIndex(s => s.sport === sport);
      if (foundSport) {
        const { groups = [] } = foundSport;
        const foundGroup = groups.find(g => g.league === group);
        const foundGroupIndex = groups.findIndex(g => g.league === group);
        if (foundGroup) {
          acc = [
            ...acc.slice(0, foundSportIndex),
            {
              ...acc[foundSportIndex],
              groups: [
                ...acc[foundSportIndex].groups.slice(0, foundGroupIndex),
                {
                  ...acc[foundSportIndex].groups[foundGroupIndex],
                  teams: [...acc[foundSportIndex].groups[foundGroupIndex].teams, { ...event }]
                },
                ...acc[foundSportIndex].groups.slice(foundGroupIndex + 1)
              ]
            },
            ...acc.slice(foundSportIndex + 1)
          ]
        }
        else {
          acc = [
            ...acc.slice(0, foundSportIndex),
            {
              ...acc[foundSportIndex],
              groups: [
                ...acc[foundSportIndex].groups,
                {
                  league: group,
                  teams: [
                    {
                      ...event
                    }
                  ]
                }
              ]
            },
            ...acc.slice(foundSportIndex + 1)
          ]
        }
      }
      else {
        const sportData = {
          sport,
          groups: [
            {
              league: group,
              teams: [
                {
                  ...event
                }
              ]
            }
          ]
        }
        acc.push(sportData)
      }
      return acc;
    }, [])
}

export const saveToLocal = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
}

export const fetchFromLocal = (key) => {
  return JSON.parse(localStorage.getItem(key));
}