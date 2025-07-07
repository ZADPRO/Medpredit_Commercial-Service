export const CurrentTime = () => {
  const today = new Date();
  return today;
};

export const getDateOnly = (): Date => {
  const today = new Date();
  const day = today.getDate(); // No need to pad, since Date constructor handles raw numbers
  const month = today.getMonth(); // Months are already 0-based
  const year = today.getFullYear();

  // Return a Date object representing only the date part (time will be 00:00:00)
  return new Date(year, month, day);
};

export const getParticularDateOnly = (delayDate: number) => {
  const today = new Date();
  today.setDate(today.getDate() - delayDate); // Subtract 1 day
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

export const calculateAge = (dateOfBirth) => {
  const dob = new Date(dateOfBirth); // Parse the given date
  const today = new Date(); // Current date

  let age = today.getFullYear() - dob.getFullYear(); // Calculate year difference
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();
  // Adjust age if the current month/day is earlier than the birth month/day
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};

export const getTotalHoursBetween = (startTime: string, endTime: string) => {
  // Function to convert 12-hour format to 24-hour format
  const convertTo24HourFormat = (time: string) => {
    const [timePart, modifier] = time.split(" ");
    let [hour, minute] = timePart.split(":").map(Number);

    if (modifier === "PM" && hour < 12) {
      hour += 12; // Convert PM hour to 24-hour format
    }
    if (modifier === "AM" && hour === 12) {
      hour = 0; // Midnight case
    }

    return { hour, minute };
  };

  // Convert both times to 24-hour format
  const { hour: startHour, minute: startMinute } =
    convertTo24HourFormat(startTime);
  const { hour: endHour, minute: endMinute } = convertTo24HourFormat(endTime);

  // Set the date for both times
  const today = new Date();
  const startDate = new Date(today);
  startDate.setHours(startHour, startMinute, 0, 0);

  const endDate = new Date(today);
  endDate.setHours(endHour, endMinute, 0, 0);

  // If the end time is earlier than the start time, assume it's the next day
  if (endDate < startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }

  // Calculate the difference in milliseconds
  const differenceMs = endDate.getTime() - startDate.getTime();

  // Convert milliseconds to total hours
  const totalHours = differenceMs / (1000 * 60 * 60); // This will be a decimal value

  return totalHours;
};

export const calculateDaysDifference = (date1, date2) => {
  // Parse the dates
  const d1: any = new Date(date1);
  const d2: any = new Date(date2);

  // Calculate the difference in time (milliseconds)
  const diffInTime = Math.abs(d2 - d1);

  // Convert the difference to days
  const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
  return diffInDays;
};

export const calculateAgeAndSubtractTime = (input1, input2) => {
  console.log(input1, input2);
  const birthDate = new Date(input1.replace(" T", "T")); // Convert to Date object

  const currentDate = new Date();

  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDifference = currentDate.getMonth() - birthDate.getMonth();

  // Adjust age if birthday hasn't occurred yet this year
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  // Subtract input2 from age (assuming input2 is in years)
  let resultAge = age - input2;

  console.log(resultAge);

  // Return the result
  return resultAge;
};

export function addDaysToDate(currentDate: string, daysToAdd: number): string {
  const date = new Date(currentDate);
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split("T")[0]; // Returns in YYYY-MM-DD format
}


export function generateFileName(): string {
  const timestamp = Date.now(); // Milliseconds since Jan 1, 1970
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `${timestamp}${random}`; // e.g., "17132654798341234"
}