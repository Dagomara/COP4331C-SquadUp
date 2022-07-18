API Endpoints:

- editProfile
    Input:
    + User discordID
    + username (name + Tag:4 digits, unique)
    + Gender
    + School

    Output:
    + User discordID
    + Success/Error

- View Profile
    Input:
    + User discordID

    Output:
    + Games
    + Gender
    + School
    + Status

- Add games
    Input:
    + User discordID
    + Game parameters

    Output:
    + GameID
    + Success/Error

- Matchmaking
    Input:
    + User discordID *
    + Game
    + Rank
    + School
    + Gender

    Output:
    + Matching User discordID through FuzzySearch
    + Waiting/Success/Error message

- Add Friends
    Input:
    + User discordID
    + Friend username

    Output:
    + Friend username
    + Success/Error message

- Get Friends
    Input:
    + User discordID

    Output:
    + Friends List

- Block User
    Input:
    + User discordID
    + Friend username

    Output:
    + Blocked discordID
    + username
    + Success/Error message

- Get Blocked List
    Input:
    + User discordID

    Output:
    + Blocked discordID
    + Blocked username
    + Success/Error message