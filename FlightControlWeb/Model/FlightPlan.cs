using System;
using System.Collections.Generic;
using System.Windows;
using System.Linq;
using Newtonsoft.Json;

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

        [JsonProperty("passengers")]
        public int Passengers { get; set; }
        [JsonProperty("company_name")]
        public string CompanyName { get; set; }
        [JsonProperty("initial_location")]
        public InitialLocation InitialLocation { get; set; }
        [JsonProperty("segments")]
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

        public Tuple<double, double> Interpolate(DateTime relative_to)
        {
            Segment current = null, last = null;
            int relativeDifferenceInSecs = (int)Math.Abs(relative_to.Subtract(InitialLocation.DateTime).TotalSeconds);
            int timePassedInFlight = 0;
            foreach (Segment segment in Segments)
            {
                current = segment;
                timePassedInFlight += segment.TimeSpan;
                if (timePassedInFlight >= relativeDifferenceInSecs)
                    break;
                last = segment;
            }
            return GetCurrentCoordinates(current, last, timePassedInFlight - relativeDifferenceInSecs);
        }

        private Tuple<double, double> GetCurrentCoordinates(Segment current, Segment last, int secsInSegment)
        {
            double currentLongitude, currentLatitude, longitudeDifference, latitudeDifference;
            // length of line completed over total length is equal to span of time completed over total span of time
            double lengthCompleted = (secsInSegment / current.TimeSpan);
            // means its the first segment
            if (last == null)
            {
                longitudeDifference = current.Longitude - InitialLocation.Longitude;
                latitudeDifference = current.Latitude - InitialLocation.Latitude;
            } else
            {
                longitudeDifference = current.Longitude - last.Longitude;
                latitudeDifference = current.Latitude - last.Latitude;
            }
            // totalSegLen = Math.Sqrt(Math.Pow(longitudeDifference, 2) + Math.Pow(latitudeDifference, 2));
            // lengthCompleted = totalSegLen * (secsInSegment / current.TimeSpan);
            // Current_X / X_Difference = Length_Completed / Total_Length
            currentLongitude = longitudeDifference * lengthCompleted;
            // Current_Y / Y_Difference = Length_Completed / Total_Length
            currentLatitude = latitudeDifference * lengthCompleted;
            return new Tuple<double, double>(currentLongitude, currentLatitude);
        }

        public string HashId()
        {
            // get hash code of initial location and date and convert it to hexaecimal representation
            int locationHash = (this.InitialLocation.Longitude + this.InitialLocation.Latitude).GetHashCode();
            int dateHash = this.InitialLocation.DateTime.GetHashCode();
            int hash = dateHash + locationHash;
            // get uppercase hexadecimal representation
            string idCode = hash.ToString("X");
            // get all capital letters from company name
            string idLetters = string.Concat(this.CompanyName.Where(capital => capital >= 'A' && capital <= 'Z'));
            string flightId = idLetters + idCode;

            // if id is longer than 10 characters
            if (flightId.Length > 10)
                flightId = flightId.ToCharArray().Take(10).ToString();
            return flightId;
        }
    }
}
