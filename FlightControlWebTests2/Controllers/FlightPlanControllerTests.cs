using Microsoft.VisualStudio.TestTools.UnitTesting;
using FlightControlWeb.Controllers;
using System;
using System.Collections.Generic;
using System.Text;

namespace FlightControlWeb.Controllers.Tests
{
    [TestClass()]
    public class FlightPlanControllerTests
    {
        [TestMethod()]
        public void GetDestinationAndLandingTimeTest()
        {
            List<string> locations = new List<string>();
            int totalFlightInSeconds = 0;
            DateTime takeoffTime = DateTime.UtcNow;
            DateTime landingTime = DateTime.UtcNow.AddSeconds(3600);
            // supposing flight takes 3600 seconds = 1 hour

            locations.Add(landingTime.ToString("yyyy-MM-ddTHH:mm:ssZ"));

            return locations;
        }
    }
}