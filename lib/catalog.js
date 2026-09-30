export const EDITIONS = [
  {
    kicker: "Field note",
    title: "The hour that refuses to hurry",
    body: "Most rooms pretend time is a straight corridor. It isn’t. An hour is a pocket. If you sit still long enough, the pocket has weather: a kettle ticking, a bus two streets over, the particular grey of a September morning that hasn’t decided whether it will rain. This desk exists for that weather. Not productivity. Not a feed. Just the next sixty minutes, held open."
  },
  {
    kicker: "Workshop",
    title: "Leave a mark that can wait",
    body: "A public note is not a performance. It is a thing you set on the table and walk away from. Other people may pick it up. They may not. The point is that it survives the hour you wrote it in. Drafts stay in the desk. Public slips go to the wall. That is the whole etiquette."
  },
  {
    kicker: "Evening",
    title: "Lamps before opinions",
    body: "After dark the internet gets loud in a way that has nothing to do with volume. People start arguing with ghosts. Better to write one clean paragraph and turn the lamp down. If the paragraph is honest it will still be honest at breakfast."
  },
  {
    kicker: "Weather",
    title: "A small inventory of rain",
    body: "There are at least four rains worth naming: the kind that polishes pavement, the kind that smells like iron, the kind that makes windows look painted, and the kind that arrives sideways and ruins a plan you were only half committed to. Keep a list. Lists are how weather becomes memory."
  },
  {
    kicker: "Craft",
    title: "Sentences with elbows",
    body: "A sentence needs a joint. Without one it slides. Put a concrete noun in the middle. Let the verb do work a weaker writer would assign to an adverb. Then stop. The last line of an hour should feel like a door left on the latch, not a speech."
  },
  {
    kicker: "City",
    title: "What the pavement keeps",
    body: "Cities remember in scratches. A station name worn off a sign. A café that changed owners but not the chairs. If you write about a place, write the scratch, not the postcard. The postcard already has a job."
  },
  {
    kicker: "Kitchen",
    title: "Toast as a theory of care",
    body: "Someone in the next room is making toast. That is enough plot for an hour. Heat, patience, a little smoke, the decision to stay. Most of what we call a life is that sequence with different nouns."
  },
  {
    kicker: "Archive",
    title: "Yesterday’s hour still counts",
    body: "Nothing here is meant to vanish at midnight. The current feature rotates. The wall accumulates. If you come back next week the room should feel lived in, not reset. That is the difference between a product and a desk."
  }
];

export function hourKey(date = new Date()) {
  const d = new Date(date);
  d.setMinutes(0, 0, 0);
  return d.toISOString().slice(0, 13);
}

export function editionFor(date = new Date()) {
  const key = hourKey(date);
  const n = [...key].reduce((a, c) => a + c.charCodeAt(0), 0);
  return { key, ...EDITIONS[n % EDITIONS.length] };
}
