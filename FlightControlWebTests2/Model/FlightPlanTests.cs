using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace FlightControlWeb.Model.Tests
{
    [TestClass()]
    public class FlightPlanTests
    {
        [TestMethod]
        public void InFlightRelativeToTest()
        {
            DateTime earlierDate = DateTime.UtcNow;
            // some time after flight ends
            DateTime laterDate = DateTime.UtcNow.AddHours(3);
            DateTime inFlightDate = DateTime.UtcNow.AddHours(2);
            // flight leaves in an hour and lands 1.5 hours later 1.5*60*60
            double totalTimeInHours = 1.5;
            DateTime timeOfDeparture = DateTime.UtcNow.AddHours(1);
            int relativeDifferenceInSecs = (int)Math.Abs(inFlightDate.Subtract(timeOfDeparture).TotalHours);

            // if departure is later than time of request
            Assert.IsTrue(DateTime.Compare(timeOfDeparture, earlierDate) > 0);

            Assert.IsTrue(laterDate.Subtract(timeOfDeparture).TotalHours > totalTimeInHours);

            Assert.IsTrue(relativeDifferenceInSecs <= totalTimeInHours);
        }
    }
}