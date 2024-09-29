- Change log
   - Added coin rewards per period of time to slow down the game.
   - Added a way to navigate between collection pages.
   - Fixed a bug where rarity icons can be moved out of the card.
   - Added 26 initial cards.
   - Added new logo and card pack designs to the game.
   - Added alternative definitions to researc tasks.

- Collection pages
   - Add pages button (for N coins)
   - Add number of cards per page.

- UI
   - Cost for album pages

- Market
   - Add option to buy one 'daily' card.
   - Add discount for buying a pack.
   - Starter pack of ~10 cards.

- Bugs
   - Grab cursor doesn't work in FF.
   - Rarity icon can be dragged out.

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

- Reseach / Upgrade & progression system
   - Uses exp as currency. Exp gained for research completion.
   - Exp can be spent to affect the daily rewar or available packs.
   - Save research in LS to avoid resetting on refresh.
   - Sell album ui upgrades.
   - Add secondary descriptions for cards.