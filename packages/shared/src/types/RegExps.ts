
/** Accepts **ONLY** 6 character Hex Color Codes with an optional leading `#` */
export const hexCodeRegEx = new RegExp(/^(#)?[a-fA-F0-9]{6}$/)