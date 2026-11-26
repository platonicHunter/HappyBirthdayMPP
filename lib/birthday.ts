export interface BirthdayStatus {
  isBirthdayToday: boolean;
  age: number;
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  formattedTargetDate: string;
}

/**
 * birthDateStr format: "YYYY-MM-DD" (ဥပမာ - "1979-11-27")
 */
export function getDynamicBirthdayStatus(birthDateStr: string): BirthdayStatus {
  const [bYear, bMonth, bDay] = birthDateStr.split("-").map(Number);

  // မြန်မာစံတော်ချိန် (+06:30) ဖြင့် လက်ရှိအချိန်ကို တွက်ချက်ခြင်း
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const mmOffsetMs = 6.5 * 3600000;
  const mmNow = new Date(utcMs + mmOffsetMs);

  const curYear = mmNow.getFullYear();
  const curMonth = mmNow.getMonth() + 1;
  const curDay = mmNow.getDate();

  // လက်ရှိအသက်ကို နှစ်နှင့် လ/ရက် နှုတ်၍ တွက်ချက်ခြင်း
  let currentAge = curYear - bYear;
  if (curMonth < bMonth || (curMonth === bMonth && curDay < bDay)) {
    currentAge -= 1;
  }

  // ယနေ့သည် မွေးနေ့ ဟုတ်/မဟုတ် စစ်ဆေးခြင်း
  const isBirthdayToday = curMonth === bMonth && curDay === bDay;

  if (isBirthdayToday) {
    return {
      isBirthdayToday: true,
      age: curYear - bYear,
      timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      formattedTargetDate: `${bDay}.${bMonth}.${curYear}`,
    };
  }

  // မွေးနေ့မရောက်သေးပါက လာမည့်မွေးနေ့ 00:00:00 (+06:30) အထိ Countdown တွက်ခြင်း
  let targetYear = curYear;
  if (curMonth > bMonth || (curMonth === bMonth && curDay > bDay)) {
    targetYear += 1;
  }

  const paddedMonth = String(bMonth).padStart(2, "0");
  const paddedDay = String(bDay).padStart(2, "0");
  const targetIso = `${targetYear}-${paddedMonth}-${paddedDay}T00:00:00+06:30`;
  const targetMs = new Date(targetIso).getTime();

  const diff = Math.max(0, targetMs - now.getTime());

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    isBirthdayToday: false,
    age: targetYear - bYear,
    timeLeft: { days, hours, minutes, seconds },
    formattedTargetDate: `${paddedDay}.${paddedMonth}.${targetYear}`,
  };
}