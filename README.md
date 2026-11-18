# Campus Stores

## My work

Changed files: `app.js` and `styles.css`. Open `index.html`, press **Restart sample shift**, and work the shift from the Requests tab.

### Would I keep it

Yes, with one change. The records are sound: one slip per physical unit, a repair exclusion, and an approved quantity rule. What fails is the handover between people and shifts.

### One moment it handles well

At 3:45 pm, opening a new issue slip for the Film Society offers only PR-04 as a projector. PR-06 is in repair and is left out of the list. The form also refuses a unit type that is not on the approved request and a second unit of a type already on loan. A rushed desk cannot hand Kabir a broken projector.

### One moment I would change

At 9 am Saturday, Leela walks in with an adapter. There are two identical ones, AD-12 and AD-15, both in bin C4. The register showed `L-404 · AD-12 · Kabir Sen · Due Fri 8 pm` with a Record return button. In the original, three things were missing:
- Return closed the slip without asking which unit was in hand, so the wrong adapter could close the wrong slip.
- The slip still named Kabir, though Leela had the unit. There was no way to record who held it.
- Nothing marked it overdue. The only context was a free text note in the Desk book, separate from the slip.

Pickup had a related cost. The kit needed three slips, each asking again for request, collector and return time, and the request page never showed what was still not issued.

### The change

- **Kit checklist on each request.** Every approved item shows Not issued, With someone, or Returned.
- **Issue kit.** One form: collector and return time once, one unit chosen per line. It creates all the slips together.
- **Label check on return.** Record return asks for the label on the unit in hand. A wrong label is refused and says which slip it belongs to.
- **Update holder.** Set who has the unit now, when it is expected back, and a short note. These show on the slip and the checklist.
- **Overdue tag** on slips and requests, based on the desk time.
- **Open slips card** at the top of the Desk book, listing every slip still out with holder, expected time and note.
- **Undo return** on returned slips.

### Same job with the change

1. Friday 3:45 pm: open RQ-214, press Issue kit, choose Kabir and Fri 8 pm once, pick PR-04, SP-02 and an adapter. The checklist shows all three with Kabir.
2. Friday 7:30 pm: confirm the projector and speaker by label. The adapter line stays open. Update holder to Leela Das, expected Sat 9 am, with a note.
3. Saturday 9 am: RQ-214 shows one open line, overdue since Fri 8 pm, with Leela. The Desk book card says the same. Leela hands over the adapter, the label is typed, it matches AD-12, and the loan closes. Typing AD-15 is refused.

### What I kept

One slip per physical unit, the repair exclusion, the approved quantity rule, the Outstanding filter, and the original single slip form. The new screens are built on the same records.

### One observation at a real counter

Watch a real morning handover. Count how many times the incoming person asks the previous shift or scrolls through free text before closing a loan, and how many returns are closed without anyone reading the label on the unit. If the change helped, both counts drop.


Campus Stores is a Product Engineer work sample set at a fictional campus media equipment desk. Work through a club’s screening, from equipment pickup to a partial return and the next morning’s handover. Open **Candidate brief** in the app for the assignment.

## Run the app

Open `index.html` in a modern browser. The app includes its scripts, styles, and icons and can run offline.

To serve it over local HTTP, run this from the repository folder and visit `http://localhost:8000`.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Each browser stores its own sample shift locally when browser storage is available. **Restart sample shift** restores the fictional starting records.

## Source

- `index.html` contains the desk layout, candidate brief, and bundled icons.
- `app.js` contains the sample records and interactions.
- `styles.css` defines the desktop and mobile layouts.

Icon license notices are in [third-party/lucide-LICENSE.txt](third-party/lucide-LICENSE.txt).


## Submit your work

1. [Fork Campus Stores](https://github.com/virinchi-healthcare/campus-stores/fork) into your GitHub account. Complete the candidate brief and push your changes to your public fork. In your README, point reviewers to your work and explain the decision you made.
2. In your fork, open **Commits**, select the final commit you want reviewed, and copy the page URL. It should look like `https://github.com/YOUR-USERNAME/campus-stores/commit/COMMIT-SHA`.
3. [Submit your work through the Google Form](https://docs.google.com/forms/d/e/1FAIpQLScvzoh1R4WS-SkiwAVBQbMvniieJYSoOEfLMyVo5CyjOvYUgQ/viewform). Your **roll number**, **email ID**, and **final commit link from your public fork** are required. Enter your roll number and email ID in the form only.