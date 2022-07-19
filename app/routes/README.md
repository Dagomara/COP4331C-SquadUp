API Endpoints:

- editProfile
    Input:
    + User discordID
    + username (name + Tag:4 digits, unique)
    + Gender
    + School

    Output:
    + updated profile
    + Success/Error

- View Profile
    Input:
    + User discordID

    Output:
    + Games
    + Gender
    + School
    + Status
    + Avatar

- Add games
    Input:
    + User discordID
    + Game parameters

    Output:
    + Updated games list
    + Success/Error

- Matchmaking
    Input:
    + User discordID *
    + GameID
    + Filters

    Output:
    + Matching User discordID through FuzzySearch
    + Waiting/Success/Error message

- Add Friends
    Input:
    + User discordID
    + Friend username

    Output:
    + Updated friends list
    + Success/Error message

- View Friends
    Input:
    + User discordID

    Output:
    + Friends List

- Block User
    Input:
    + User discordID
    + Blocked username

    Output:
    + Blocked list
    + Success/Error message

- Get Blocked List
    Input:
    + User discordID

    Output:
    + Blocked list
    + Success/Error message