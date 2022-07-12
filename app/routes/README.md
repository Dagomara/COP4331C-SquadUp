API Endpoints:

- Login/Register (through Discord)
    Input:
    + DiscordLoginAuth
    + Username
    + Tag : 4 digits, unique
    + Gender
    + School

    Output:
    + DiscordID
    + Success/Error


- Add games
    Input:
    + User DiscordID
    + Game
    + Rank
    + Level 
    + ...

    Output:
    + Game
    + Success/Error

- Matchmaking
    Input:
    + User DiscordID *
    + Game Name *
    + Rank
    + School
    + Gender

    Output:
    + Matching User DiscordID through FuzzySearch
    + Waiting/Success/Error message

- View Profile
    Input:
    + Username + Tag

    Output:
    + Username + Tag
    + Games
    + School
    + Rank
    + Level
    + ...

- Add Friends
    Input:
    + User DiscordID
    + Friend Username + Tag

    Output:
    + Friend Username + Tag
    + Success/Error message

- Get Friends
    Input:
    + User DiscordID

    Output:
    + Friends List

- Block User
    Input:
    + User DiscordID
    + Friend Username + Tag

    Output:
    + Blocked DiscordID
    + Username + Tag
    + Success/Error message

- Get Blocked List
    Input:
    + User DiscordID

    Output:
    + Blocked DiscordID
    + Blocked Username + Tag
    + Success/Error message