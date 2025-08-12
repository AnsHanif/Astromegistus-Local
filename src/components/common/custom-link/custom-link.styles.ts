import { CustomLinkTypes } from './custom-link.types';

const primaryLinkStyles =
  'bg-primary-color text-white font-semibold text-sm sm:text-base text-center px-8 py-2 rounded-[20px] hover:bg-[#0025e2] !no-underline';

const secondaryLinkStyles = '';

export const customLinkStyles = Object.freeze({
  [CustomLinkTypes.PRIMARY]: primaryLinkStyles,
  [CustomLinkTypes.SECONDARY]: secondaryLinkStyles,
});
