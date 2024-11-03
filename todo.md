- Change log
   - Resolved a bug when player level would not be saved.
   - Changed card pack cost to 100, and now there are 5 cards per pack.

- Collection pages
   - Add pages button (for N coins)
   - Add number of cards per page.

- UI
   - Cost for album pages
   - Time until reward?

- Market
   - Add option to buy one 'daily' card.
   - Add discount for buying a pack.
   - Starter pack of ~10 cards.
   - Show a pop-up with definition of a new card?
   - Have a pack opening animation.

- Bugs
   - Grab cursor doesn't work in FF.
   - Rarity icon can be dragged out.
   - Got thermal energy quest, added correct card and lost.

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