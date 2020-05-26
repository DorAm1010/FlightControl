using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlightControlWeb.Model
{
    public class InitialLocation
    {
        public double Longitude { get; set; }
        public double Latitude { get; set; }

        // format: yyyy-dd-MMThh:mm:ssZ
        public DateTime DateTime { get; set; }
    }
}
