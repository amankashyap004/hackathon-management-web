/**
 * Formats an ISO date string into "DD MMM YYYY" format.
 * @param isoDate - The ISO date string to format.
 * @returns A string formatted as "DD MMM YYYY".
 */

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
