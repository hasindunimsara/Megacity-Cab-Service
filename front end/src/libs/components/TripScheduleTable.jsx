const getCurrentDay = () => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[new Date().getDay()];
};

// Function to check if the time has passed
const isTimePassed = (scheduledTime) => {
    const currentDate = new Date();
    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();

    // Split the scheduled time into hours and minutes
    const [scheduledHour, scheduledMinute] = scheduledTime.split(":").map(Number);
    console.log(`Current time: ${currentHours}:${currentMinutes}, Scheduled time: ${scheduledHour}:${scheduledMinute}`); // Debugging line

    // Compare current time with the scheduled time
    return (currentHours > scheduledHour) || (currentHours === scheduledHour && currentMinutes >= scheduledMinute);
};

// Function to get the message based on available seats and schedule
const getSeatMessage = (availableSeats, schedule) => {
    if (availableSeats === 0) {
        return "No available seats for the scheduled bus.";
    } else if (availableSeats > 0 && availableSeats < 5) {
        return `Only ${availableSeats} seats left! Hurry up!`;
    } else {
        return `${availableSeats} seats available for the scheduled bus.`;
    }
};

const TripScheduleMessage = ({ tripData }) => {
    const schedule = tripData.route.schedule[0]; // Assuming only one schedule in the array
    const availableSeats = tripData.availableSeats;

    const message = getSeatMessage(availableSeats, schedule);

    return (
        <div className={`my-6 py-4 px-6 text-lg ${availableSeats === 0 ? 'text-black bg-red-200 border-[2px] rounded-md border-red-500' : availableSeats < 6 ? 'text-black bg-yellow-200 border-[2px] rounded-md border-yellow-500' : 'text-black bg-green-200 border-[2px] rounded-md border-green-500'}`}>
            {message}
        </div>
    );
};

export default TripScheduleMessage;
