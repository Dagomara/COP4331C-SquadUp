export const gameTemplates = {
    "Among Us": {
        "gameID": 5,
        "name": "Among Us",
        "filters" : {
          "level": "i1-99"
        }
    },
    "Apex Legends": {
        "gameID": 7,
        "name": "Apex Legends",
        "filters": {
            "level": "i1-500",
            "rank": ["Unranked", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Apex Predator"],
            "characters": ["Ash", "Bangalore", "Bloodhound", "Caustic", "Crypto", "Fuse", "Gibraltar", "Horizon", "Lifeline", "Loba", "Mad Maggie", "Mirage", "Newcastle", "Octane", "Pathfinder", "Rampart", "Revenant", "Seer", "Valkyrie", "Wattson", "Wraith"]
        }
    },
    "League of Legends": {
        "gameID": 3,
        "name": "League of Legends",
        "filters": {
          "level": "i1-2500",
          "rank": ["Unranked","Iron", "Bronze", "Silver","Gold","Platinum","Diamond","Master","Grandmaster","Challenger"],
          "positions": ["Top", "Jungle", "Mid","Bottom","Support"]
        }
    },
    "Overwatch": {
        "gameID": 6,
        "name": "Overwatch",
        "filters": {
            "level": "i1-3000",
            "rank": ["Unranked","Bronze", "Silver","Gold","Platinum","Diamond","Master","Grandmaster"],
            "positions": ["Tank", "Damage", "Support"]
        }
    },
    "Rocket League": {
        "gameID": 4,
        "name": "Rocket League",
        "filters": {
          "level": "i1-1000",
          "rank": ["Unranked", "Bronze", "Silver","Gold","Platinum","Diamond","Champion","Grand Champion","Supersonic Legend"]
        }
    },
    "Team Fortress 2": {
        "gameID": 1,
        "name": "Team Fortress 2",
        "filters": {
          "level": "i1-250",
          "positions": ["attack", "defense", "support"],
          "characters": ["scout","pyro","soldier","engineer",
            "demoman","spy","sniper","heavy","medic"],
          "gamemodes": ["Capture The Flag", "Control Point", "Payload", "King of The Hill", "Mann vs. Machine", "Special Delivery", "Territorial Control", "Medieval Mode", "Arena", "Capture The Flag"]
        }
    },
    "Valorant": {
        "gameID": 2,
        "name": "Valorant",
        "filters": {
          "level": "i1 - 399",
          "rank": ["unranked", "iron", "bronze", "silver", "gold", "platinum", "diamond", "ascendant", "immortal", "radiant"],
          "positions": ["duelist", "initiator", "controller", "sentinel"],
          "characters": ["astra", "brimstone", "omen", "viper", "phoenix", "jett", "yoru", "raze", "reyna", "neon", "breach", "fade", "kay/o", "skye", "sova", "chamber", "cypher", "killjoy", "sage"],
          "gamemodes": ["unrated", "competitive", "spike rush", "deathmatch", "escalation", "replication"],
        }
    }
};