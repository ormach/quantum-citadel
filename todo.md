- Change log
   - Implemented market pack slider to show 3 packs per page.
   - Implemented new interface for album and reserch. Before research UI was placed belowe the album oto match the overall design idea of placing game sections in a column layout to rely on native web scrolling for navigation. But after testing, it became clear that scrolling down for each quest while holding a card is not very convinient.
   - Added a basic menu with option to reset the game and a link to discord.
   - Fixed a bug with research contract UI.
   - Fixed a bug when research contract would reset on page reload.

- Collection pages
   - Add pages button (for N coins)
   - Add number of cards per page.
   - Cost for album pages

- Market
   - Add option to buy one 'daily' card.
   - Starter pack of ~10 cards.
   - Show a pop-up with definition of a new card?
   - Have a pack opening animation.

- Bugs
   - Rarity icon can be dragged out.
   - There is total exp calculation bug.

- Code
   - Dealing with multiple instances of the game and LS saving. You can buy card in one window, then buy in another to pick the best rolls etc.
   - Move interval reward check to a separate method.

- Inspection
   - If card was inspected, add it to cards metadata. On placing card into inspector/on hover, show metadata.

- Game design
   - Create formulas as research quests. Add =, >, < signs.
   - Add rarity match bonuses.
   - Coins as dragable game objects.
   - Haradric cube.
   - Remove card name from card descriptions.
   - Resolve issue with enertia and newtons first law.
   - Give bonus coins per card rarity in response.

- Reseach / Upgrade & progression system
   - Uses exp as currency. Exp gained for research completion.
   - Exp can be spent to affect the daily rewar or available packs.
   - Save research in LS to avoid resetting on refresh.
   - Sell album ui upgrades.
   - Add secondary descriptions for cards.
   - Automatically add new packs instead of data.js packs object.