export const getLast7Days = () => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        result.push({
            day: daysOfWeek[date.getDay()],
            date: date.toISOString().split("T")[0], // format as YYYY-MM-DD
            income: 0,
            expense: 0,
        });
    }return result.reverse(); // reverse to have the most recent day last
}

export const getLast12Months = () => {
    const monthsOfYear = [
        "Jan", 
        "Feb", 
        "Mar", 
        "Apr", 
        "May", 
        "Jun", 
        "Jul", 
        "Aug", 
        "Sep", 
        "Oct", 
        "Nov", 
        "Dec"
    ];
    const result = [];
    const currentDate = new Date();
    for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        
        const monthName = monthsOfYear[date.getMonth()];
        const shortYear = date.getFullYear().toString().slice(-2);
        const formattedMonthYear = `${monthName} ${shortYear}`; // Apr 23 , Apr 24 , . . .
        const formattedDate = date.toISOString().split("T")[0]; // format as YYYY-MM-DD
        result.push({
            month: formattedMonthYear,
            fulldate: formattedDate,
            income: 0,
            expense: 0,
        });
    }
    return result.reverse(); // reverse to have the most recent month last
};


export const getYearsRange = (startYear: number , endYear: number): any => {
    const result = [];
    for (let year = startYear; year<=endYear ; year++){
        result.push({
            year: year.toString(),
            fullDate: `01-01-${year}`, // using 1st Jan as fulldate for year selection
            income: 0,
            expense: 0,
        })
    }
    return result.reverse();    
}