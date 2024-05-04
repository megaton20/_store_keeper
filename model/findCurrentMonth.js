

    function getMonthName(appDate, seperator){
        // Name of the days as Array
        let MonthNameArr = new Array ( "January", "February", "March", "April", "May", "June","July", "August","September", "October", 'November', "December");
        let dateArr = appDate.split(seperator); // split the date into array using the date seperator
        let month = eval(dateArr[0]); 
        let day = eval(dateArr[1]);
        let year = eval(dateArr[2]);

        // return the repective Day Name from the array
       if(month == 1){
            return  MonthNameArr[0]; 
        }else if(month == 2) 
        {
            return MonthNameArr[1];
        }else if(month == 3) 
        {
            return MonthNameArr[2];
        }else if(month ==4) 
        {
            return MonthNameArr[3];
        }else if(month ==5) 
        {
            return MonthNameArr[4];
        }else if(month ==6) 
        {
            return MonthNameArr[4];
        }else if(month ==7) 
        {
            return MonthNameArr[6];
        }else if(month ==8) 
        {
            return MonthNameArr[7];
        }else if(month ==9)
         {
            return MonthNameArr[8];
        }else if(month ==10)
         {
            return  MonthNameArr[9];
        }else if(month ==11) 
        {
           return MonthNameArr[10];

        }else if(month ==12) 
        {
           return MonthNameArr[11];
        }

    }
     
    module.exports = getMonthName