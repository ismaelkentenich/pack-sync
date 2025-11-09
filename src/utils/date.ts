export function formatDate(date: string | Date): string {
  const d = new Date(date);

  const day = d.getDate().toString().padStart(2, "0");

  const monthNames = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();

  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");

  return `${day} de ${month} de ${year} às ${hours}:${minutes}`;
}
