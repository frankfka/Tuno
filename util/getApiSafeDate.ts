import { parseISO } from 'date-fns';

// Serving dates via API will convert the date to an ISO string, this gives us a valid date object no matter
// if we use the function in front or backend
const getApiSafeDate = (dateOrIsoDateString: string | Date): Date => {
  return typeof dateOrIsoDateString === 'string'
    ? parseISO(dateOrIsoDateString)
    : dateOrIsoDateString;
};

export default getApiSafeDate;
