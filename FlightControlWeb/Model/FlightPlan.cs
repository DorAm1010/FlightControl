using System;
using System.Collections.Generic;
using System.Linq;

namespace FlightControlWeb.Model
{
    public class FlightPlan
    {
        public FlightPlan()
        {
        }

        public FlightPlan(int passengers, string companyName, InitialLocation initialLocation, List<Segment> segments)
        {
            Passengers = passengers;
            CompanyName = companyName;
            InitialLocation = initialLocation;
            Segments = segments;
        }

        public int Passengers { get; set; }
        public string CompanyName { get; set; }
        public InitialLocation InitialLocation { get; set; }
        public List<Segment> Segments { get; set; }

        public bool InFlightRelativeTo(DateTime relative_to)
        {
            DateTime timeOfDeparture = InitialLocation.DateTime;
            // if departure is later than time of request
            if (DateTime.Compare(timeOfDeparture, relative_to) > 0)
                return false;

            // total flight duration in seconds
            int totalTimeInSec = Segments.Sum(segment => segment.TimeSpan);
            // difference between time of departure and time of request
            int relativeDifferenceInSecs = (int)Math.Abs(relative_to.Subtract(timeOfDeparture).TotalSeconds);
            if (totalTimeInSec > relativeDifferenceInSecs)
                return true;

            return false;
        }

        internal string GetCurrentDateTime()
        {
            throw new NotImplementedException();
        }

        public Tuple<double, double> Interpolate(DateTime relative_to)
        {
            double relativeLongitude, relativeLatitude;
            int totalTime = 0;
            int relativeDifferenceInSecs = (int)Math.Abs(relative_to.Subtract(InitialLocation.DateTime).TotalSeconds);
            int timePassedInFlight = 0;
            for (int i = 0; i < Segments.Count; i++)
            {
                timePassedInFlight += Segments[i].TimeSpan;
                if (timePassedInFlight >= relativeDifferenceInSecs)
                {

                }
            }
            return new Tuple<double, double>(1.0, 2.0);
        }

        public string HashId()
        {
            // get hash code of initial location and date and convert it to hexaecimal representation
            int locationHash = (InitialLocation.Longitude + InitialLocation.Latitude).GetHashCode();
            int dateHash = InitialLocation.DateTime.GetHashCode();
            int hash = dateHash + locationHash;
            // get uppercase hexadecimal representation
            string idCode = hash.ToString("X");
            // get all capital letters from company name
            string idLetters = string.Concat(CompanyName.Where(capital => capital >= 'A' && capital <= 'Z'));
            string flightId = idLetters + idCode;

            // if id is longer than 10 characters
            if (flightId.Length > 10)
                flightId = flightId.ToCharArray().Take(10).ToString();
            return flightId;
        }
    }
}
