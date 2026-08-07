// Resolve the current weekday and time (HH:MM) in the students' timezone
// (Asia/Kolkata), so class tracking works regardless of where the server runs.
const getKolkataClock = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const part = (type) => parts.find((p) => p.type === type)?.value || "";

  let hour = part("hour");
  if (hour === "24") hour = "00";

  return {
    day: part("weekday"),
    time: `${hour}:${part("minute")}`,
  };
};

const timeToMinutes = (hhmm) => {
  const [h, m] = String(hhmm).split(":").map(Number);
  return (Number(h) || 0) * 60 + (Number(m) || 0);
};

module.exports = {
  getKolkataClock,
  timeToMinutes,
};
