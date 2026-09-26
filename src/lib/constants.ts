export const MAX_GUESSES = 5;
export const BLANK_GUESS = '_BLANK_';
export const STORAGE_KEY = 'scapdle';

export const APOSTROPHE_RE = /'/g;
export const NON_ALPHA_RE = /[^a-zA-Z]/g;
export const WHITESPACE_RE = /\s+/;
export const NON_UPPER_RE = /[^A-Z]/g;
export const ALPHA_RE = /[a-zA-Z]/;
export const UPPER_RE = /[A-Z]/;

export const isSpecial = (char: string) => !ALPHA_RE.test(char);

export const MOTDS = [
	'Buying gf',
	'Selling lobbies 250ea',
	'Free armour trimming!',
	'Doubling money at the GE',
	'Oh dear, you are dead!',
	'Wise Old Man approved',
	'Lure some into the wildy',
	'Nothing interesting happens.',
	'Pker spotted at 30 wildy!',
	'Gz on 99!',
	'Remember to bank your cabbages',
	'Welcome to Lumbridge',
	'Sit rat',
	'Brought to you by Zezima',
	'Summer sweep-up is here!',
	'Please wait, loading...',
	'Pet rock not included',
	'Dragon med helm dropped!',
	'Bond purchased, 1b in bank',
	'Watch out for the Squirrel',
	'Tele to Varrock now!',
	'Wave 63 but no Jad',
	'Can I borrow 1k?',
	'Duel arena: stake wins!'
];
